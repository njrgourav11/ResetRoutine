'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Timestamp } from 'firebase/firestore';
import { type UserProfile } from '@/lib/firestore/user';
import { Activity, CigaretteOff, Beer, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function OnboardingPage() {
  const { user, profile, updateProfileData } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);

  // Step 1: Personal details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Prefer not to say');

  // Step 2: Habit tracking setup
  const [tracksSmoking, setTracksSmoking] = useState(false);
  const [smokeQuitDate, setSmokeQuitDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [cigsPerDay, setCigsPerDay] = useState('10');
  const [costPerCigarette, setCostPerCigarette] = useState('0.60');
  const [cigsPerPack] = useState('20');

  const [tracksAlcohol, setTracksAlcohol] = useState(false);
  const [alcoholQuitDate, setAlcoholQuitDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [drinksPerWeek, setDrinksPerWeek] = useState('8');
  const [costPerDrink, setCostPerDrink] = useState('7');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      Promise.resolve().then(() => {
        setName(profile.displayName || user?.displayName || '');
        setPhone(profile.phone || '');
        setHeight(profile.height ? String(profile.height) : '');
        setWeight(profile.weight ? String(profile.weight) : '');
        setAge(profile.age ? String(profile.age) : '');
        setGender(profile.gender || 'Prefer not to say');
      });
    }
  }, [profile, user]);

  const validateStep1 = () => {
    if (!name.trim()) return 'Name is required';
    if (!phone.trim()) return 'Phone number is required';
    if (!height.trim() || isNaN(Number(height)) || Number(height) <= 0) return 'Please enter a valid height';
    if (!weight.trim() || isNaN(Number(weight)) || Number(weight) <= 0) return 'Please enter a valid weight';
    if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) return 'Please enter a valid age';
    return '';
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const personalData: Partial<UserProfile> = {
        displayName: name,
        phone,
        height: Number(height),
        weight: Number(weight),
        age: Number(age),
        gender,
        onboarded: true,
      };

      if (tracksSmoking) {
        personalData.smokeQuitDate = Timestamp.fromDate(new Date(smokeQuitDate));
        personalData.smokeSettings = {
          cigsPerDay: Number(cigsPerDay),
          costPerCigarette: Number(costPerCigarette),
          costPerPack: Number(costPerCigarette) * 20,
          cigsPerPack: Number(cigsPerPack),
        };
      } else {
        personalData.smokeQuitDate = Timestamp.now();
        personalData.smokeSettings = {
          cigsPerDay: 0,
          costPerCigarette: 0,
          costPerPack: 0,
          cigsPerPack: 20,
        };
      }

      if (tracksAlcohol) {
        personalData.alcoholQuitDate = Timestamp.fromDate(new Date(alcoholQuitDate));
        personalData.alcoholSettings = {
          drinksPerWeek: Number(drinksPerWeek),
          costPerDrink: Number(costPerDrink),
        };
      } else {
        personalData.alcoholQuitDate = Timestamp.now();
        personalData.alcoholSettings = {
          drinksPerWeek: 0,
          costPerDrink: 0,
        };
      }

      await updateProfileData(personalData);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="auth-page">
        <div className="auth-card" style={{ maxWidth: '540px' }}>
          <div className="auth-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            <Activity size={24} style={{ color: 'var(--blue)' }} />
            <span className="logo-text">ResetRoutine Onboarding</span>
          </div>

          <div className="step-indicator" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: step === 1 ? 'var(--blue)' : 'var(--border)',
              transition: 'var(--transition)'
            }} />
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: step === 2 ? 'var(--blue)' : 'var(--border)',
              transition: 'var(--transition)'
            }} />
          </div>

          <h1 className="auth-title">{step === 1 ? 'Tell us about yourself' : 'Customize your goals'}</h1>
          <p className="auth-sub" style={{ marginBottom: '20px' }}>
            {step === 1 ? 'We use these details to personalize your stats and AI coach recommendations.' : 'Select what you want to track and set your parameters.'}
          </p>

          {error && <p className="auth-error" style={{ marginBottom: '16px' }}>{error}</p>}

          {step === 1 ? (
            <div className="auth-form">
              <label className="field-label">
                Full Name
                <input
                  type="text" className="field-input" value={name} required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                />
              </label>

              <label className="field-label">
                Phone Number
                <input
                  type="tel" className="field-input" value={phone} required
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 000-0000"
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label className="field-label">
                  Height (cm)
                  <input
                    type="number" className="field-input" value={height} required
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    min="1"
                  />
                </label>

                <label className="field-label">
                  Weight (kg)
                  <input
                    type="number" className="field-input" value={weight} required
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    min="1"
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label className="field-label">
                  Age (years)
                  <input
                    type="number" className="field-input" value={age} required
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 28"
                    min="1"
                  />
                </label>

                <label className="field-label">
                  Gender
                  <select
                    className="field-input" value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)' }}
                  >
                    <option value="Male" style={{ background: 'var(--bg-surface)' }}>Male</option>
                    <option value="Female" style={{ background: 'var(--bg-surface)' }}>Female</option>
                    <option value="Non-binary" style={{ background: 'var(--bg-surface)' }}>Non-binary</option>
                    <option value="Other" style={{ background: 'var(--bg-surface)' }}>Other</option>
                    <option value="Prefer not to say" style={{ background: 'var(--bg-surface)' }}>Prefer not to say</option>
                  </select>
                </label>
              </div>

              <button type="button" className="btn-primary btn-full" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={handleNext}>
                <span>Next Step</span>
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {/* Smoking Tracking */}
              <div style={{
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                padding: '16px', background: 'rgba(255, 255, 255, 0.01)',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CigaretteOff size={18} className="text-green" style={{ color: 'var(--green)' }} />
                    <span>Track Smoking Journey</span>
                  </span>
                  <input
                    type="checkbox" checked={tracksSmoking}
                    onChange={(e) => setTracksSmoking(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--green)' }}
                  />
                </div>

                {tracksSmoking && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', animation: 'fadeIn 0.2s' }}>
                    <label className="field-label">
                      Quit Date
                      <input
                        type="date" className="field-input" value={smokeQuitDate} required
                        onChange={(e) => setSmokeQuitDate(e.target.value)}
                      />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <label className="field-label">
                        Cigarettes / Day
                        <input
                          type="number" className="field-input" value={cigsPerDay} required
                          onChange={(e) => setCigsPerDay(e.target.value)}
                          min="1"
                        />
                      </label>
                      <label className="field-label">
                        Price per Cigarette ($)
                        <input
                          type="number" className="field-input" value={costPerCigarette} required
                          onChange={(e) => setCostPerCigarette(e.target.value)}
                          min="0.01" step="0.01"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Alcohol Tracking */}
              <div style={{
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                padding: '16px', background: 'rgba(255, 255, 255, 0.01)',
                display: 'flex', flexDirection: 'column', gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Beer size={18} className="text-orange" style={{ color: 'var(--orange)' }} />
                    <span>Track Quit Alcohol</span>
                  </span>
                  <input
                    type="checkbox" checked={tracksAlcohol}
                    onChange={(e) => setTracksAlcohol(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--orange)' }}
                  />
                </div>

                {tracksAlcohol && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', animation: 'fadeIn 0.2s' }}>
                    <label className="field-label">
                      Quit Date
                      <input
                        type="date" className="field-input" value={alcoholQuitDate} required
                        onChange={(e) => setAlcoholQuitDate(e.target.value)}
                      />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <label className="field-label">
                        Drinks / Week
                        <input
                          type="number" className="field-input" value={drinksPerWeek} required
                          onChange={(e) => setDrinksPerWeek(e.target.value)}
                          min="1"
                        />
                      </label>
                      <label className="field-label">
                        Avg Cost / Drink ($)
                        <input
                          type="number" className="field-input" value={costPerDrink} required
                          onChange={(e) => setCostPerDrink(e.target.value)}
                          min="0.01" step="0.01"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }} onClick={handleBack}>
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} disabled={loading}>
                  <span>Complete Onboarding</span>
                  <Check size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
