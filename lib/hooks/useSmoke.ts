'use client';
import { useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '@/lib/firestore/user';
import { getSmokeSettings, getCravings, SmokeSettings, Craving } from '@/lib/firestore/smoke';
import { useAuth } from './useAuth';
import { Timestamp } from 'firebase/firestore';

export function useSmoke() {
  const { user } = useAuth();
  const [quitDate, setQuitDate] = useState<Date | null>(null);
  const [streakStartDate, setStreakStartDate] = useState<Date | null>(null);
  const [settings, setSettings] = useState<SmokeSettings | null>(null);
  const [cravings, setCravings] = useState<Craving[]>([]);
  const [moneySaved, setMoneySaved] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateMoneySaved = (qDate: Date, s: SmokeSettings) => {
    const days = Math.max(0, (Date.now() - qDate.getTime()) / (1000 * 60 * 60 * 24));
    const cigsNotSmoked = days * s.cigsPerDay;
    if (s.costPerCigarette !== undefined && s.costPerCigarette > 0) {
      return cigsNotSmoked * s.costPerCigarette;
    }
    const packsNotBought = cigsNotSmoked / (s.cigsPerPack || 20);
    return packsNotBought * s.costPerPack;
  };

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const [profile, smokeSettings, cravingData] = await Promise.all([
        getUserProfile(user.uid),
        getSmokeSettings(user.uid),
        getCravings(user.uid),
      ]);
      let qd: Date | null = null;
      if (profile?.smokeQuitDate) {
        qd = (profile.smokeQuitDate as Timestamp).toDate();
        setQuitDate(qd);
      }
      setSettings(smokeSettings);
      setCravings(cravingData);
      
      const lastLapse = cravingData.find((c) => !c.resisted);
      const streakStart = lastLapse ? lastLapse.timestamp.toDate() : qd;
      setStreakStartDate(streakStart);
      
      if (qd && smokeSettings) {
        setMoneySaved(calculateMoneySaved(qd, smokeSettings));
      } else {
        setMoneySaved(0);
      }
    } catch (err) {
      console.error('Failed to refresh smoke:', err);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!user) return;
      try {
        const [profile, smokeSettings, cravingData] = await Promise.all([
          getUserProfile(user.uid),
          getSmokeSettings(user.uid),
          getCravings(user.uid),
        ]);
        if (!active) return;
        let qd: Date | null = null;
        if (profile?.smokeQuitDate) {
          qd = (profile.smokeQuitDate as Timestamp).toDate();
          setQuitDate(qd);
        }
        setSettings(smokeSettings);
        setCravings(cravingData);

        const lastLapse = cravingData.find((c) => !c.resisted);
        const streakStart = lastLapse ? lastLapse.timestamp.toDate() : qd;
        setStreakStartDate(streakStart);

        if (qd && smokeSettings) {
          setMoneySaved(calculateMoneySaved(qd, smokeSettings));
        } else {
          setMoneySaved(0);
        }
      } catch (err) {
        console.error('Failed to load smoke data:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [user]);

  return { quitDate, streakStartDate, settings, cravings, moneySaved, loading, refresh };
}
