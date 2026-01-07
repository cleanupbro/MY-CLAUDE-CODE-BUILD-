import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UploadedFile } from '../types';

const BUCKET_NAME = 'job-applications';

export interface FileUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 * Falls back to base64 embedding if Supabase is not configured
 */
export const uploadFile = async (file: UploadedFile, submissionId: string): Promise<FileUploadResult> => {
  // If Supabase is not configured, return the base64 data as-is
  if (!isSupabaseConfigured() || !supabase) {
    console.log('Supabase not configured, using base64 fallback for file storage');
    return {
      success: true,
      url: file.data, // Return base64 data URL
      path: `local/${file.name}`,
    };
  }

  try {
    // Convert base64 data URL to Blob
    const base64Data = file.data.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.type });

    // Generate unique file path
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${submissionId}/${timestamp}_${sanitizedFileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      // Fallback to base64
      return {
        success: true,
        url: file.data,
        path: `local/${file.name}`,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('File upload error:', error);
    // Fallback to base64
    return {
      success: true,
      url: file.data,
      path: `local/${file.name}`,
    };
  }
};

/**
 * Upload multiple files
 */
export const uploadFiles = async (files: UploadedFile[], submissionId: string): Promise<FileUploadResult[]> => {
  const uploadPromises = files.map(file => uploadFile(file, submissionId));
  return Promise.all(uploadPromises);
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (filePath: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) {
    return true; // No-op if not configured
  }

  if (filePath.startsWith('local/')) {
    return true; // Can't delete local base64 files
  }

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('File deletion error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
};

/**
 * Get a signed URL for a private file (valid for 1 hour)
 */
export const getSignedUrl = async (filePath: string): Promise<string | null> => {
  if (!isSupabaseConfigured() || !supabase) {
    return null;
  }

  if (filePath.startsWith('local/')) {
    return null; // Can't generate signed URLs for local files
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Signed URL error:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Signed URL error:', error);
    return null;
  }
};
