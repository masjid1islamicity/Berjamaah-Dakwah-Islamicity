import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserProfile = {
  name: string;
  city: string;
  masjid: string;
};

type AppContextType = {
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  registeredEventIds: string[];
  toggleEventRegistration: (id: string) => void;
  isRegistered: (id: string) => boolean;
  sedekahTotal: number;
  addSedekah: (amount: number) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'abdi_profile',
  BOOKMARKS: 'abdi_bookmarks',
  EVENTS: 'abdi_events',
  SEDEKAH: 'abdi_sedekah',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Hamba Allah',
    city: 'Jakarta',
    masjid: '',
  });
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [sedekahTotal, setSedekahTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, b, e, s] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
          AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS),
          AsyncStorage.getItem(STORAGE_KEYS.EVENTS),
          AsyncStorage.getItem(STORAGE_KEYS.SEDEKAH),
        ]);
        if (p) setProfile(JSON.parse(p));
        if (b) setBookmarkedIds(JSON.parse(b));
        if (e) setRegisteredEventIds(JSON.parse(e));
        if (s) setSedekahTotal(JSON.parse(s));
      } catch (_) {}
    };
    load();
  }, []);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => bookmarkedIds.includes(id), [bookmarkedIds]);

  const toggleEventRegistration = useCallback((id: string) => {
    setRegisteredEventIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isRegistered = useCallback((id: string) => registeredEventIds.includes(id), [registeredEventIds]);

  const addSedekah = useCallback((amount: number) => {
    setSedekahTotal((prev) => {
      const next = prev + amount;
      AsyncStorage.setItem(STORAGE_KEYS.SEDEKAH, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        bookmarkedIds,
        toggleBookmark,
        isBookmarked,
        registeredEventIds,
        toggleEventRegistration,
        isRegistered,
        sedekahTotal,
        addSedekah,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
