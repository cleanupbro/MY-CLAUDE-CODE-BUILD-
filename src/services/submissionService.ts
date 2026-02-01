import { Submission, SubmissionStatus, SubmissionType, SubmissionData, ServiceType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  logResidentialQuote,
  logCommercialQuote,
  logAirbnbQuote,
  logJobApplication,
  logClientFeedback,
  logLandingLead,
} from './googleSheetsService';
import {
  sendTelegramMessage,
  sendResidentialQuoteNotification,
  sendCommercialQuoteNotification,
  sendAirbnbQuoteNotification,
  sendJobApplicationNotification,
} from './telegramService';
import {
  sendResidentialLeadSMS,
  sendCommercialLeadSMS,
  sendAirbnbLeadSMS,
  sendJobApplicationSMS,
  sendLandingLeadSMS,
  notifyAdminNewLead,
} from './smsService';

const SUBMISSIONS_KEY = 'cleanUpBrosSubmissions';

// ==================== SUPABASE FUNCTIONS ====================

export const getSubmissions = async (): Promise<Submission[]> => {
  // Use Supabase if configured, otherwise fallback to localStorage
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        return getSubmissionsFromLocalStorage();
      }

      // Transform Supabase data to app format
      return data.map(row => ({
        id: row.id,
        timestamp: new Date(row.created_at).getTime(),
        type: row.type as SubmissionType,
        status: row.status as SubmissionStatus,
        data: row.data,
        summary: row.summary || undefined,
        leadScore: row.lead_score || undefined,
        leadReasoning: row.lead_reasoning || undefined,
      }));
    } catch (error) {
      console.error('Failed to fetch from Supabase:', error);
      return getSubmissionsFromLocalStorage();
    }
  }

  // Fallback to localStorage
  return getSubmissionsFromLocalStorage();
};

export const saveSubmission = async (submission: { type: SubmissionType, data: SubmissionData }): Promise<string> => {
  // Use existing referenceId as ID if available, otherwise generate new one
  const existingId = (submission.data as any).referenceId;
  const id = existingId || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  const newSubmission: Submission = {
    ...submission,
    id: id,
    timestamp: Date.now(),
    status: SubmissionStatus.Pending,
  };

  // Log to Google Sheets for backup (async, don't wait)
  try {
    switch (submission.type) {
      case ServiceType.Residential:
        logResidentialQuote(submission.data, id).catch(err => console.warn('Google Sheets logging failed:', err));
        break;
      case ServiceType.Commercial:
        logCommercialQuote(submission.data, id).catch(err => console.warn('Google Sheets logging failed:', err));
        break;
      case ServiceType.Airbnb:
        logAirbnbQuote(submission.data, id).catch(err => console.warn('Google Sheets logging failed:', err));
        break;
      case ServiceType.Jobs:
        logJobApplication(submission.data, id).catch(err => console.warn('Google Sheets logging failed:', err));
        break;
      case 'Client Feedback':
        logClientFeedback(submission.data, id).catch(err => console.warn('Google Sheets logging failed:', err));
        break;
      case 'Landing Lead':
        logLandingLead(submission.data, id).catch(err => console.warn('Google Sheets logging failed:', err));
        break;
    }
  } catch (error) {
    // Don't let Google Sheets logging break the main flow
    console.warn('Google Sheets logging error:', error);
  }

  // Send Telegram notification to team (async, don't wait)
  try {
    const d = submission.data as any;
    switch (submission.type) {
      case ServiceType.Residential:
        sendResidentialQuoteNotification({
          fullName: d.fullName || d.name || 'Unknown',
          phone: d.phone || 'N/A',
          email: d.email || 'N/A',
          suburb: d.suburb || d.address || 'N/A',
          serviceType: d.serviceType || 'Residential',
          bedrooms: d.bedrooms || 0,
          bathrooms: d.bathrooms || 0,
          preferredDate: d.preferredDate,
          priceEstimate: d.estimatedPrice || d.price || d.priceEstimate,
          referenceId: id,
        }).catch(err => console.warn('Telegram notification failed:', err));
        // SMS to admin
        sendResidentialLeadSMS({
          name: d.fullName || d.name || 'Unknown',
          phone: d.phone || 'N/A',
          suburb: d.suburb || d.address || 'N/A',
          bedrooms: d.bedrooms || 0,
          bathrooms: d.bathrooms || 0,
          serviceType: d.serviceType || 'Residential',
          price: d.estimatedPrice || d.price || d.priceEstimate,
          referenceId: id,
        }).catch(err => console.warn('SMS notification failed:', err));
        break;
      case ServiceType.Commercial:
        sendCommercialQuoteNotification({
          companyName: d.companyName || d.company || 'Unknown',
          contactPerson: d.contactPerson || d.fullName || d.name || 'Unknown',
          phone: d.phone || 'N/A',
          email: d.email || 'N/A',
          facilityType: d.facilityType,
          squareMeters: d.squareMeters || d.size,
          cleaningFrequency: d.frequency,
          priceEstimate: d.estimatedPrice || d.price || d.priceEstimate,
          referenceId: id,
        }).catch(err => console.warn('Telegram notification failed:', err));
        // SMS to admin
        sendCommercialLeadSMS({
          company: d.companyName || d.company || 'Unknown',
          contact: d.contactPerson || d.fullName || d.name || 'Unknown',
          phone: d.phone || 'N/A',
          price: d.estimatedPrice || d.price || d.priceEstimate,
          referenceId: id,
        }).catch(err => console.warn('SMS notification failed:', err));
        break;
      case ServiceType.Airbnb:
        sendAirbnbQuoteNotification({
          contactName: d.contactName || d.fullName || d.name || 'Unknown',
          phone: d.phone || 'N/A',
          email: d.email || 'N/A',
          propertyType: d.propertyType,
          bedrooms: d.bedrooms?.toString(),
          bathrooms: d.bathrooms?.toString(),
          cleaningFrequency: d.frequency,
          preferredStartDate: d.startDate || d.preferredDate,
          priceEstimate: d.estimatedPrice || d.price || d.priceEstimate,
          referenceId: id,
        }).catch(err => console.warn('Telegram notification failed:', err));
        // SMS to admin
        sendAirbnbLeadSMS({
          name: d.contactName || d.fullName || d.name || 'Unknown',
          phone: d.phone || 'N/A',
          bedrooms: d.bedrooms?.toString(),
          price: d.estimatedPrice || d.price || d.priceEstimate,
          referenceId: id,
        }).catch(err => console.warn('SMS notification failed:', err));
        break;
      case ServiceType.Jobs:
        sendJobApplicationNotification({
          fullName: d.fullName || d.name || 'Unknown',
          phone: d.phone || 'N/A',
          email: d.email || 'N/A',
          experience: d.experience,
          availability: d.availability,
          serviceSuburbs: d.suburbs,
          referenceId: id,
        }).catch(err => console.warn('Telegram notification failed:', err));
        // SMS to admin
        sendJobApplicationSMS({
          name: d.fullName || d.name || 'Unknown',
          phone: d.phone || 'N/A',
          experience: d.experience,
          referenceId: id,
        }).catch(err => console.warn('SMS notification failed:', err));
        break;
      case 'Landing Lead':
        // Landing page quick quote lead
        sendTelegramMessage(`
🎯 <b>NEW LANDING PAGE LEAD</b>

📍 <b>Suburb:</b> ${d.suburb || 'N/A'}
🏠 <b>Property:</b> ${d.bedrooms || '?'} bed, ${d.bathrooms || '?'} bath
🧹 <b>Service:</b> ${d.serviceType || 'Not specified'}
💰 <b>Est. Price:</b> $${d.priceEstimate || 'Quote needed'}
📱 <b>Phone:</b> ${d.phone || 'N/A'}
🔗 <b>Ref:</b> <code>${id}</code>

⏰ <i>Hot lead - Quote requested on landing page!</i>
        `.trim()).catch(err => console.warn('Telegram notification failed:', err));
        // SMS to admin - HOT LEAD!
        sendLandingLeadSMS({
          phone: d.phone || 'N/A',
          suburb: d.suburb,
          serviceType: d.serviceType,
          price: d.priceEstimate,
          referenceId: id,
        }).catch(err => console.warn('SMS notification failed:', err));
        break;
      case 'Client Feedback':
        sendTelegramMessage(`
⭐ <b>NEW CLIENT FEEDBACK</b>

👤 <b>Name:</b> ${d.name || d.fullName || 'Anonymous'}
📧 <b>Email:</b> ${d.email || 'N/A'}
⭐ <b>Rating:</b> ${'⭐'.repeat(d.rating || 0)} (${d.rating || 0}/5)
📋 <b>Type:</b> ${d.feedbackType || 'General'}

💬 <b>Message:</b>
${d.message || d.feedback || 'No message'}

🔗 <b>Ref:</b> <code>${id}</code>
        `.trim()).catch(err => console.warn('Telegram notification failed:', err));
        break;
      default:
        // Generic notification for other types
        sendTelegramMessage(`
📩 <b>NEW SUBMISSION</b>

📋 <b>Type:</b> ${submission.type}
👤 <b>Name:</b> ${d.fullName || d.name || d.contactName || 'Unknown'}
📱 <b>Phone:</b> ${d.phone || 'N/A'}
📧 <b>Email:</b> ${d.email || 'N/A'}
🔗 <b>Ref:</b> <code>${id}</code>
        `.trim()).catch(err => console.warn('Telegram notification failed:', err));
        // SMS to admin for any submission
        notifyAdminNewLead({
          type: submission.type,
          name: d.fullName || d.name || d.contactName || 'Unknown',
          phone: d.phone || 'N/A',
          suburb: d.suburb,
          price: d.priceEstimate || d.price || d.estimatedPrice,
          referenceId: id,
        }).catch(err => console.warn('SMS notification failed:', err));
    }
  } catch (error) {
    console.warn('Telegram notification error:', error);
  }

  // Save to Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          id: newSubmission.id,
          type: newSubmission.type,
          status: newSubmission.status,
          data: newSubmission.data,
        });

      if (error) {
        console.error('Supabase insert error:', error);
        // Fallback to localStorage
        saveSubmissionToLocalStorage(newSubmission);
      }

      return id;
    } catch (error) {
      console.error('Failed to save to Supabase:', error);
      saveSubmissionToLocalStorage(newSubmission);
      return id;
    }
  }

  // Fallback to localStorage
  saveSubmissionToLocalStorage(newSubmission);
  return id;
};

export const updateSubmissionStatus = async (id: string, status: SubmissionStatus): Promise<Submission[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        return updateSubmissionStatusInLocalStorage(id, status);
      }

      return await getSubmissions();
    } catch (error) {
      console.error('Failed to update in Supabase:', error);
      return updateSubmissionStatusInLocalStorage(id, status);
    }
  }

  return updateSubmissionStatusInLocalStorage(id, status);
};

export const updateSubmissionSummary = async (id: string, summary: string): Promise<Submission[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ summary })
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        return updateSubmissionSummaryInLocalStorage(id, summary);
      }

      return await getSubmissions();
    } catch (error) {
      console.error('Failed to update in Supabase:', error);
      return updateSubmissionSummaryInLocalStorage(id, summary);
    }
  }

  return updateSubmissionSummaryInLocalStorage(id, summary);
};

export const updateSubmissionScore = async (id: string, score: number, reasoning: string): Promise<Submission[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          lead_score: score,
          lead_reasoning: reasoning
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        return updateSubmissionScoreInLocalStorage(id, score, reasoning);
      }

      return await getSubmissions();
    } catch (error) {
      console.error('Failed to update in Supabase:', error);
      return updateSubmissionScoreInLocalStorage(id, score, reasoning);
    }
  }

  return updateSubmissionScoreInLocalStorage(id, score, reasoning);
};

// Update submission data (for editing customer details)
export const updateSubmissionData = async (id: string, data: SubmissionData): Promise<Submission[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ data })
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        return updateSubmissionDataInLocalStorage(id, data);
      }

      return await getSubmissions();
    } catch (error) {
      console.error('Failed to update in Supabase:', error);
      return updateSubmissionDataInLocalStorage(id, data);
    }
  }

  return updateSubmissionDataInLocalStorage(id, data);
};

const updateSubmissionDataInLocalStorage = (id: string, data: SubmissionData): Submission[] => {
  const submissions = getSubmissionsFromLocalStorage();
  const updatedSubmissions = submissions.map(sub => sub.id === id ? { ...sub, data } : sub);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
  return updatedSubmissions;
};

// ==================== LOCALSTORAGE FALLBACK FUNCTIONS ====================

const getSubmissionsFromLocalStorage = (): Submission[] => {
  try {
    const submissionsJson = localStorage.getItem(SUBMISSIONS_KEY);
    if (!submissionsJson) return [];
    const submissions = JSON.parse(submissionsJson);
    return submissions.sort((a: Submission, b: Submission) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to parse submissions from localStorage", error);
    return [];
  }
};

const saveSubmissionToLocalStorage = (newSubmission: Submission): void => {
  const submissions = getSubmissionsFromLocalStorage();
  submissions.push(newSubmission);
  const sortedSubmissions = submissions.sort((a, b) => b.timestamp - a.timestamp);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(sortedSubmissions));
};

const updateSubmissionStatusInLocalStorage = (id: string, status: SubmissionStatus): Submission[] => {
  const submissions = getSubmissionsFromLocalStorage();
  const updatedSubmissions = submissions.map(sub => sub.id === id ? { ...sub, status } : sub);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
  return updatedSubmissions;
};

const updateSubmissionSummaryInLocalStorage = (id: string, summary: string): Submission[] => {
  const submissions = getSubmissionsFromLocalStorage();
  const updatedSubmissions = submissions.map(sub => sub.id === id ? { ...sub, summary } : sub);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
  return updatedSubmissions;
};

const updateSubmissionScoreInLocalStorage = (id: string, score: number, reasoning: string): Submission[] => {
  const submissions = getSubmissionsFromLocalStorage();
  const updatedSubmissions = submissions.map(sub => sub.id === id ? { ...sub, leadScore: score, leadReasoning: reasoning } : sub);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
  return updatedSubmissions;
};
