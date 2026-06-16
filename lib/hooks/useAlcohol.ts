'use client';
import { useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '@/lib/firestore/user';
import { getAlcoholSettings, getAlcoholCravings, AlcoholSettings, AlcoholCraving } from '@/lib/firestore/alcohol';
import { useAuth } from './useAuth';
import { Timestamp } from 'firebase/firestore';

export function useAlcohol() {
  const { user } = useAuth();
  const [quitDate, setQuitDate] = useState<Date | null>(null);
  const [streakStartDate, setStreakStartDate] = useState<Date | null>(null);
  const [settings, setSettings] = useState<AlcoholSettings | null>(null);
  const [cravings, setCravings] = useState<AlcoholCraving[]>([]);
  const [moneySaved, setMoneySaved] = useState(0);
  const [drinksSaved, setDrinksSaved] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateStats = (qDate: Date, s: AlcoholSettings) => {
    const days = Math.max(0, (Date.now() - qDate.getTime()) / (1000 * 60 * 60 * 24));
    const drSaved = (days / 7) * s.drinksPerWeek;
    const moSaved = drSaved * s.costPerDrink;
    return { moneySaved: moSaved, drinksSaved: drSaved };
  };

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const [profile, alcoholSettings, cravingData] = await Promise.all([
        getUserProfile(user.uid),
        getAlcoholSettings(user.uid),
        getAlcoholCravings(user.uid),
      ]);
      let qd: Date | null = null;
      if (profile?.alcoholQuitDate) {
        qd = (profile.alcoholQuitDate as Timestamp).toDate();
        setQuitDate(qd);
      }
      setSettings(alcoholSettings);
      setCravings(cravingData);

      const lastLapse = cravingData.find((c) => !c.resisted);
      const streakStart = lastLapse ? lastLapse.timestamp.toDate() : qd;
      setStreakStartDate(streakStart);

      if (qd && alcoholSettings) {
        const stats = calculateStats(qd, alcoholSettings);
        setMoneySaved(stats.moneySaved);
        setDrinksSaved(stats.drinksSaved);
      } else {
        setMoneySaved(0);
        setDrinksSaved(0);
      }
    } catch (err) {
      console.error('Failed to load alcohol data:', err);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!user) return;
      try {
        const [profile, alcoholSettings, cravingData] = await Promise.all([
          getUserProfile(user.uid),
          getAlcoholSettings(user.uid),
          getAlcoholCravings(user.uid),
        ]);
        if (!active) return;
        let qd: Date | null = null;
        if (profile?.alcoholQuitDate) {
          qd = (profile.alcoholQuitDate as Timestamp).toDate();
          setQuitDate(qd);
        }
        setSettings(alcoholSettings);
        setCravings(cravingData);

        const lastLapse = cravingData.find((c) => !c.resisted);
        const streakStart = lastLapse ? lastLapse.timestamp.toDate() : qd;
        setStreakStartDate(streakStart);

        if (qd && alcoholSettings) {
          const stats = calculateStats(qd, alcoholSettings);
          setMoneySaved(stats.moneySaved);
          setDrinksSaved(stats.drinksSaved);
        } else {
          setMoneySaved(0);
          setDrinksSaved(0);
        }
      } catch (err) {
        console.error('Failed to load alcohol data:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [user]);

  return {
    quitDate,
    streakStartDate,
    settings,
    cravings,
    moneySaved,
    drinksSaved,
    loading,
    refresh,
  };
}
