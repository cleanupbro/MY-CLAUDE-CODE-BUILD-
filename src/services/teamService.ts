/**
 * Team Member Service
 * Handles CRUD operations for cleaners, supervisors, and admin staff
 */

import { supabase, isSupabaseConfigured, TeamMember, Database } from '../lib/supabaseClient';

type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update'];

const TEAM_STORAGE_KEY = 'cleanUpBrosTeamMembers';

// ==================== MAIN FUNCTIONS ====================

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        return getFromLocalStorage();
      }

      return data as TeamMember[];
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      return getFromLocalStorage();
    }
  }
  return getFromLocalStorage();
};

export const getActiveTeamMembers = async (): Promise<TeamMember[]> => {
  const members = await getTeamMembers();
  return members.filter(m => m.status === 'active');
};

export const getTeamMemberById = async (id: string): Promise<TeamMember | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase fetch error:', error);
        return null;
      }

      return data as TeamMember;
    } catch (error) {
      console.error('Failed to fetch team member:', error);
      return null;
    }
  }

  const members = getFromLocalStorage();
  return members.find(m => m.id === id) || null;
};

export const createTeamMember = async (member: TeamMemberInsert): Promise<TeamMember | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert(member)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        return null;
      }

      return data as TeamMember;
    } catch (error) {
      console.error('Failed to create team member:', error);
      return null;
    }
  }

  // localStorage fallback
  const newMember: TeamMember = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    full_name: member.full_name,
    email: member.email || null,
    phone: member.phone,
    role: member.role || 'cleaner',
    status: member.status || 'active',
    hourly_rate: member.hourly_rate || null,
    skills: member.skills || [],
    availability: member.availability || null,
    photo_url: member.photo_url || null,
    notes: member.notes || null,
  };

  const members = getFromLocalStorage();
  members.push(newMember);
  saveToLocalStorage(members);
  return newMember;
};

export const updateTeamMember = async (id: string, updates: TeamMemberUpdate): Promise<TeamMember | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        return null;
      }

      return data as TeamMember;
    } catch (error) {
      console.error('Failed to update team member:', error);
      return null;
    }
  }

  // localStorage fallback
  const members = getFromLocalStorage();
  const index = members.findIndex(m => m.id === id);
  if (index === -1) return null;

  members[index] = { ...members[index], ...updates };
  saveToLocalStorage(members);
  return members[index];
};

export const deleteTeamMember = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete team member:', error);
      return false;
    }
  }

  // localStorage fallback
  const members = getFromLocalStorage();
  const filtered = members.filter(m => m.id !== id);
  saveToLocalStorage(filtered);
  return true;
};

// ==================== HELPER FUNCTIONS ====================

export const getCleanersBySkill = async (skill: string): Promise<TeamMember[]> => {
  const members = await getActiveTeamMembers();
  return members.filter(m => m.skills.includes(skill));
};

export const getAvailableCleaners = async (day: string): Promise<TeamMember[]> => {
  const members = await getActiveTeamMembers();
  return members.filter(m => {
    if (!m.availability) return true; // Assume available if no schedule set
    const dayAvailability = m.availability[day.toLowerCase()];
    return dayAvailability && dayAvailability.length > 0;
  });
};

// ==================== LOCAL STORAGE FALLBACK ====================

const getFromLocalStorage = (): TeamMember[] => {
  try {
    const data = localStorage.getItem(TEAM_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (members: TeamMember[]): void => {
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members));
};
