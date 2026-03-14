import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import supabase from '../../supabaseClient';

export interface UserProfile {
  id: string;
  email: string | null;
  name: string;
  degree: string;
  field_of_study: string;
  xp: number;
  level: number;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'email'>>) => Promise<void>;
  addXP: (xpGained: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, session }: { children: ReactNode; session: Session | null }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, email: string | null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({ ...data, email });
      } else {
        // Profile doesn't exist yet (e.g., OAuth first login before completing setup)
        setProfile({
          id: userId,
          email,
          name: '',
          degree: '',
          field_of_study: '',
          xp: 0,
          level: 1,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchProfile(session.user.id, session.user.email ?? null);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [session]);

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'email'>>) => {
    if (!profile) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profile.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addXP = async (xpGained: number) => {
    if (!profile) return;
    const newXp = profile.xp + xpGained;
    const newLevel = Math.floor(newXp / 500) + 1; // 500 XP per level
    await updateProfile({ xp: newXp, level: newLevel });
  };

  const refreshProfile = async () => {
    if (!session?.user) return;
    await fetchProfile(session.user.id, session.user.email ?? null);
  };

  return (
    <UserContext.Provider value={{
      user: session?.user ?? null,
      profile,
      loading,
      updateProfile,
      addXP,
      refreshProfile,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}