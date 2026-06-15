import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface GymCheckin {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  wentToGym: boolean;
  notes: string;
  exercises: string[];
  createdAt: Timestamp;
}

export async function logGymDay(
  userId: string,
  data: Omit<GymCheckin, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  const ref = collection(db, 'users', userId, 'gymCheckins');
  const docRef = await addDoc(ref, {
    userId,
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getGymCheckins(userId: string): Promise<GymCheckin[]> {
  const ref = collection(db, 'users', userId, 'gymCheckins');
  const q = query(ref, orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GymCheckin));
}

export async function getCheckinByDate(
  userId: string,
  date: string
): Promise<GymCheckin | null> {
  const ref = collection(db, 'users', userId, 'gymCheckins');
  const q = query(ref, where('date', '==', date));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as GymCheckin;
}

export async function updateCheckin(
  userId: string,
  checkinId: string,
  data: Partial<Omit<GymCheckin, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const ref = doc(db, 'users', userId, 'gymCheckins', checkinId);
  await updateDoc(ref, data as DocumentData);
}
