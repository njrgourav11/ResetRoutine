'use client';
import { useState, useEffect, useCallback } from 'react';
import { getGymCheckins, GymCheckin } from '@/lib/firestore/gym';
import { useAuth } from './useAuth';

export function useWorkouts() {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<GymCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getGymCheckins(user.uid);
      setCheckins(data);
    } catch (err) {
      console.error('Failed to refresh workouts:', err);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!user) return;
      try {
        const data = await getGymCheckins(user.uid);
        if (!active) return;
        setCheckins(data);
      } catch (err) {
        console.error('Failed to load workouts:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [user]);

  const gymDates = new Set(checkins.filter((c) => c.wentToGym).map((c) => c.date));

  const currentStreak = (() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (gymDates.has(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  })();

  return { checkins, gymDates, currentStreak, loading, refresh };
}
