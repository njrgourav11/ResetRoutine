'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Settings, Save, Check, ShieldAlert, Sparkles, User, Flag, Coins, LayoutGrid } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'Pound Sterling (£)' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (C$)' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (A$)' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)' },
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Germany', 'France',
  'Japan', 'Brazil', 'South Africa', 'Singapore', 'Other'
];

export default function SettingsPage() {
  const { profile, updateProfileData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Profile fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Configuration fields
  const [country, setCountry] = useState('United States');
  const [currency, setCurrency] = useState('$');

  // Enabled modules
  const [gymEnabled, setGymEnabled] = useState(true);
  const [smokeEnabled, setSmokeEnabled] = useState(true);
  const [alcoholEnabled, setAlcoholEnabled] = useState(true);
  const [coachEnabled, setCoachEnabled] = useState(true);

  // Smoking config
  const [cigsPerDay, setCigsPerDay] = useState('10');
  const [costPerCigarette, setCostPerCigarette] = useState('0.60');

  // Alcohol config
  const [drinksPerWeek, setDrinksPerWeek] = useState('8');
  const [costPerDrink, setCostPerDrink] = useState('7');

  useEffect(() => {
    if (profile) {
      Promise.resolve().then(() => {
        setName(profile.displayName || '');
        setPhone(profile.phone || '');
        setAge(profile.age ? String(profile.age) : '');
        setGender(profile.gender || 'Prefer not to say');
        setHeight(profile.height ? String(profile.height) : '');
        setWeight(profile.weight ? String(profile.weight) : '');
        setCountry(profile.country || 'United States');
        setCurrency(profile.currency || '$');

        if (profile.enabledModules) {
          setGymEnabled(profile.enabledModules.gym !== false);
          setSmokeEnabled(profile.enabledModules.smoke !== false);
          setAlcoholEnabled(profile.enabledModules.alcohol !== false);
          setCoachEnabled(profile.enabledModules.coach !== false);
        }

        if (profile.smokeSettings) {
          setCigsPerDay(String(profile.smokeSettings.cigsPerDay ?? '10'));
          setCostPerCigarette(String(profile.smokeSettings.costPerCigarette ?? '0.60'));
        }

        if (profile.alcoholSettings) {
          setDrinksPerWeek(String(profile.alcoholSettings.drinksPerWeek ?? '8'));
          setCostPerDrink(String(profile.alcoholSettings.costPerDrink ?? '7'));
        }
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      if (!name.trim()) throw new Error('Name is required');

      const enabledModules = {
        gym: gymEnabled,
        smoke: smokeEnabled,
        alcohol: alcoholEnabled,
        coach: coachEnabled,
      };

      const smokeSettings = {
        cigsPerDay: Number(cigsPerDay) || 0,
        costPerCigarette: Number(costPerCigarette) || 0,
        costPerPack: (Number(costPerCigarette) || 0) * 20,
        cigsPerPack: 20,
      };

      const alcoholSettings = {
        drinksPerWeek: Number(drinksPerWeek) || 0,
        costPerDrink: Number(costPerDrink) || 0,
      };

      await updateProfileData({
        displayName: name,
        phone,
        age: Number(age) || 0,
        gender,
        height: Number(height) || 0,
        weight: Number(weight) || 0,
        country,
        currency,
        enabledModules,
        smokeSettings,
        alcoholSettings,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={32} className="text-blue" style={{ color: 'var(--blue)' }} />
            <h1 className="page-title">Configuration Settings</h1>
          </div>
          <p className="page-sub" style={{ marginTop: '4px' }}>Manage country, currency, modules toggles, and profile preferences.</p>
        </div>
      </div>

      {success && (
        <div className="glass-card" style={{ borderLeft: '3px solid var(--green)', background: 'rgba(16,185,129,0.03)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green)', fontSize: '14px' }}>
          <Check size={16} />
          <span><strong>Settings Saved</strong> — Profile configuration updated successfully.</span>
        </div>
      )}

      {error && (
        <div className="glass-card" style={{ borderLeft: '3px solid var(--red)', background: 'rgba(239,68,68,0.03)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--red)', fontSize: '14px' }}>
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Section 1: Profile Details */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
            <User size={18} className="text-blue" style={{ color: 'var(--blue)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Profile Information</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label className="field-label">
              Full Name
              <input type="text" className="field-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="field-label">
              Phone Number
              <input type="tel" className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <label className="field-label">
              Age (Years)
              <input type="number" className="field-input" value={age} onChange={(e) => setAge(e.target.value)} min={1} />
            </label>
            <label className="field-label">
              Height (cm)
              <input type="number" className="field-input" value={height} onChange={(e) => setHeight(e.target.value)} min={1} />
            </label>
            <label className="field-label">
              Weight (kg)
              <input type="number" className="field-input" value={weight} onChange={(e) => setWeight(e.target.value)} min={1} />
            </label>
          </div>

          <label className="field-label">
            Gender
            <select className="field-input" value={gender} onChange={(e) => setGender(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
              <option value="Male" style={{ background: 'var(--bg-surface)' }}>Male</option>
              <option value="Female" style={{ background: 'var(--bg-surface)' }}>Female</option>
              <option value="Non-binary" style={{ background: 'var(--bg-surface)' }}>Non-binary</option>
              <option value="Other" style={{ background: 'var(--bg-surface)' }}>Other</option>
              <option value="Prefer not to say" style={{ background: 'var(--bg-surface)' }}>Prefer not to say</option>
            </select>
          </label>
        </div>

        {/* Section 2: Localization */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
            <Flag size={18} className="text-blue" style={{ color: 'var(--blue)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Localization & Currency</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label className="field-label">
              Country
              <select className="field-input" value={country} onChange={(e) => setCountry(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} style={{ background: 'var(--bg-surface)' }}>{c}</option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Preferred Currency
              <select className="field-input" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
                {CURRENCIES.map((curr) => (
                  <option key={curr.symbol} value={curr.symbol} style={{ background: 'var(--bg-surface)' }}>{curr.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Section 3: Modules Selector */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
            <LayoutGrid size={18} className="text-blue" style={{ color: 'var(--blue)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Active Trackers & Modules</h3>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Toggle modules below. Unchecked modules will be hidden from the navigation sidebar, bottom bars, and dashboard trackers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', margin: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Gym Tracker</span>
              <input type="checkbox" checked={gymEnabled} onChange={(e) => setGymEnabled(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--blue)' }} />
            </label>
            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', margin: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Quit Smoking</span>
              <input type="checkbox" checked={smokeEnabled} onChange={(e) => setSmokeEnabled(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--green)' }} />
            </label>
            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', margin: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Quit Alcohol</span>
              <input type="checkbox" checked={alcoholEnabled} onChange={(e) => setAlcoholEnabled(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--orange)' }} />
            </label>
            <label className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', cursor: 'pointer', margin: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>AI Coach support</span>
              <input type="checkbox" checked={coachEnabled} onChange={(e) => setCoachEnabled(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--purple)' }} />
            </label>
          </div>
        </div>

        {/* Section 4: Advanced Track Parameters */}
        {(smokeEnabled || alcoholEnabled) && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '4px' }}>
              <Coins size={18} className="text-blue" style={{ color: 'var(--blue)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Sobriety Pricing Configurations</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {smokeEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green)' }}>Quit Smoking (Single Cigarette Mode)</span>
                  <label className="field-label">
                    Cigarettes smoked per day
                    <input type="number" className="field-input" value={cigsPerDay} onChange={(e) => setCigsPerDay(e.target.value)} min={1} />
                  </label>
                  <label className="field-label">
                    Price per single Cigarette ({currency})
                    <input type="number" className="field-input" value={costPerCigarette} onChange={(e) => setCostPerCigarette(e.target.value)} min={0.01} step={0.01} />
                  </label>
                </div>
              )}

              {alcoholEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--orange)' }}>Quit Alcohol Configuration</span>
                  <label className="field-label">
                    Drinks consumed per week
                    <input type="number" className="field-input" value={drinksPerWeek} onChange={(e) => setDrinksPerWeek(e.target.value)} min={1} />
                  </label>
                  <label className="field-label">
                    Average cost per drink ({currency})
                    <input type="number" className="field-input" value={costPerDrink} onChange={(e) => setCostPerDrink(e.target.value)} min={0.01} step={0.01} />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }} disabled={loading}>
          <Save size={16} />
          <span>{loading ? 'Saving Settings...' : 'Save Configuration'}</span>
        </button>

      </form>
    </div>
  );
}
