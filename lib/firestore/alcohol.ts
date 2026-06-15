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

export interface AlcoholSettings {
  drinksPerWeek: number;
  costPerDrink: number;
}

export interface AlcoholCraving {
  id?: string;
  userId: string;
  timestamp: Timestamp;
  intensity: number; // 1-10
  trigger: string;
  resisted: boolean;
}

export async function getAlcoholSettings(userId: string): Promise<AlcoholSettings | null> {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return data?.alcoholSettings ?? null;
}

export async function saveAlcoholSettings(
  userId: string,
  settings: AlcoholSettings
): Promise<void> {
  const ref = doc(db, 'users', userId);
  await setDoc(ref, { alcoholSettings: settings }, { merge: true });
}

export async function logAlcoholCraving(
  userId: string,
  data: Omit<AlcoholCraving, 'id' | 'userId' | 'timestamp'>
): Promise<string> {
  const ref = collection(db, 'users', userId, 'alcoholCravings');
  const docRef = await addDoc(ref, {
    userId,
    ...data,
    timestamp: Timestamp.now(),
  });
  return docRef.id;
}

export async function getAlcoholCravings(userId: string): Promise<AlcoholCraving[]> {
  const ref = collection(db, 'users', userId, 'alcoholCravings');
  const q = query(ref, orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AlcoholCraving));
}
