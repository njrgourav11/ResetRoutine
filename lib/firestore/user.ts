import { doc, setDoc, getDoc, Timestamp, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Timestamp;
  onboarded: boolean;
  phone?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  planType?: 'free' | 'premium';
  country?: string;
  currency?: string;
  enabledModules?: {
    gym: boolean;
    smoke: boolean;
    alcohol: boolean;
    coach: boolean;
  };

  // Smoke details
  smokeQuitDate: Timestamp;
  smokeSettings?: {
    cigsPerDay: number;
    costPerPack: number;
    cigsPerPack: number;
    costPerCigarette?: number;
  };

  // Alcohol details
  alcoholQuitDate?: Timestamp;
  alcoholSettings?: {
    drinksPerWeek: number;
    costPerDrink: number;
  };
}

export async function createUserProfile(
  uid: string,
  displayName: string,
  email: string
): Promise<void> {
  const ref = doc(db, 'users', uid);
  const existing = await getDoc(ref);
  if (!existing.exists()) {
    await setDoc(ref, {
      uid,
      displayName,
      email,
      createdAt: Timestamp.now(),
      smokeQuitDate: Timestamp.now(),
      onboarded: false,
      planType: 'free',
    });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, data, { merge: true });
}

export interface PremiumRequest {
  id?: string;
  uid: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}

export async function createPremiumRequest(
  uid: string,
  requestData: { name: string; email: string; phone?: string; message: string }
): Promise<void> {
  const ref = collection(db, 'users', uid, 'premiumRequests');
  const newDoc = doc(ref);
  await setDoc(newDoc, {
    uid,
    name: requestData.name,
    email: requestData.email,
    phone: requestData.phone || '',
    message: requestData.message,
    status: 'pending',
    createdAt: Timestamp.now(),
  });
}

export async function getPendingPremiumRequest(uid: string): Promise<PremiumRequest | null> {
  const ref = collection(db, 'users', uid, 'premiumRequests');
  const q = query(ref, where('status', '==', 'pending'), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as PremiumRequest;
}

