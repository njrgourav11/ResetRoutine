'use client';
import React, { createContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile, getUserProfile, updateUserProfile, type UserProfile } from '@/lib/firestore/user';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);  const refreshProfile = useCallback(async (uid?: string) => {
    const currentUid = uid || user?.uid;
    if (!currentUid) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      const prof = await getUserProfile(currentUid);
      setProfile(prof);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      setProfileLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        await refreshProfile(u.uid);
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    });
    return unsub;
  }, [user?.uid, refreshProfile]);
  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await createUserProfile(cred.user.uid, name, email);
    await refreshProfile(cred.user.uid);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await createUserProfile(
      cred.user.uid,
      cred.user.displayName ?? 'User',
      cred.user.email ?? ''
    );
    await refreshProfile(cred.user.uid);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    setProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        updateProfileData,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

