import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SmokeSettings {
  cigsPerDay: number;
  costPerPack: number;
  cigsPerPack: number;
  costPerCigarette?: number;
}

export interface Craving {
  id?: string;
  userId: string;
  timestamp: Timestamp;
  intensity: number; // 1-10
  trigger: string;
  resisted: boolean;
}

export async function getSmokeSettings(userId: string): Promise<SmokeSettings | null> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return data?.smokeSettings ?? null;
}

export async function saveSmokeSettings(
  userId: string,
  settings: SmokeSettings
): Promise<void> {
  const ref = doc(db, 'users', userId);
  await setDoc(ref, { smokeSettings: settings }, { merge: true });
}

export async function logCraving(
  userId: string,
  data: Omit<Craving, 'id' | 'userId' | 'timestamp'>
): Promise<string> {
  const ref = collection(db, 'users', userId, 'cravings');
  const docRef = await addDoc(ref, {
    userId,
    ...data,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
}

export async function getCravings(userId: string): Promise<Craving[]> {
  const ref = collection(db, 'users', userId, 'cravings');
  const q = query(ref, orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Craving));
}
