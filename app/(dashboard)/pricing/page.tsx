'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Sparkles } from 'lucide-react';
import { createPremiumRequest, getPendingPremiumRequest, type PremiumRequest } from '@/lib/firestore/user';

export default function PricingPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [daysLeft, setDaysLeft] = useState(30);
  const [isExpired, setIsExpired] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<PremiumRequest | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(true);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('Hi! I would like to upgrade my ResetRoutine account to Premium Pro. Please contact me with details.');

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      if (profile?.createdAt) {
        const createdTime = profile.createdAt.toDate().getTime();
        const diffMs = Date.now() - createdTime;
        const days = 30 - Math.floor(diffMs / (1000 * 60 * 60 * 24));
        setDaysLeft(Math.max(0, days));
        setIsExpired(diffMs > 30 * 24 * 60 * 60 * 1000);
      }
    });
  }, [profile]);

  useEffect(() => {
    if (profile?.uid) {
      setLoadingRequest(true);
      getPendingPremiumRequest(profile.uid)
        .then((req) => {
          setPendingRequest(req);
        })
        .catch((err) => {
          console.error('Error fetching pending request:', err);
        })
        .finally(() => {
          setLoadingRequest(false);
        });
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setFormName(profile.displayName || '');
      setFormEmail(profile.email || '');
      setFormPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createPremiumRequest(profile.uid, {
        name: formName,
        email: formEmail,
        phone: formPhone,
        message: formMessage,
      });
      setSubmitSuccess(true);
      const req = await getPendingPremiumRequest(profile.uid);
      setPendingRequest(req);
    } catch (err: any) {
      console.error('Failed to submit upgrade request:', err);
      setSubmitError(err.message || 'An error occurred while submitting your request.');
    } finally {
      setSubmitting(false);
    }
  };

  const isPremium = profile?.planType === 'premium';

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      <div className="page-header" style={{ textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="page-title">Reset Your Routine</h1>
        <p className="page-sub" style={{ marginTop: '8px' }}>Select the ideal plan to lock in your habits and sobriety.</p>
      </div>

      {isExpired && !isPremium && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--red)', background: 'rgba(239,68,68,0.05)', textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: 'var(--red)', fontWeight: '700', marginBottom: '6px' }}>Trial Expired 🛑</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Your 30-day free trial has expired. To resume tracking your consistency and chatting with your AI Coach, please upgrade to Premium.
          </p>
        </div>
      )}

      {!isExpired && !isPremium && profile && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--blue)', background: 'rgba(79,142,247,0.05)', textAlign: 'center', padding: '16px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            You are currently on a <strong>Free Trial</strong> with <strong>{daysLeft} days remaining</strong>. Upgrade early to secure full features!
          </p>
        </div>
      )}

      {isPremium && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--green)', background: 'rgba(16,185,129,0.05)', textAlign: 'center', padding: '16px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            🌟 <strong>Premium Plan Active!</strong> Thank you for supporting ResetRoutine. You have unlimited access to all features.
          </p>
        </div>
      )}

      <div className="two-col" style={{ marginTop: '24px' }}>
        {/* Free Trial Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', opacity: isPremium ? 0.6 : 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Outfit' }}>30-Day Free Trial</h3>
            {!isPremium && !isExpired && <span className="hero-badge" style={{ margin: 0, fontSize: '11px' }}>Current</span>}
          </div>
          <div>
            <span style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit' }}>$0</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}> / 30 days</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Get started resetting your lifestyle. Track your progress for a full month.
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <li>✓ Gym Streak Tracker</li>
            <li>✓ Quit Smoking logs</li>
            <li>✓ Quit Alcohol logs</li>
            <li>❌ NVIDIA AI Coach</li>
            <li>❌ Detailed Health timelines</li>
          </ul>
          <button className="btn-secondary" style={{ marginTop: 'auto', pointerEvents: 'none', opacity: 0.7 }}>
            {isExpired ? 'Expired' : 'Trial Active'}
          </button>
        </div>

        {/* Premium Plan Card */}
        <div className="glass-card" style={{
          display: 'flex', flexDirection: 'column', gap: '16px',
          border: '1px solid var(--blue)',
          background: 'rgba(79, 142, 247, 0.02)',
          boxShadow: isPremium ? 'none' : '0 10px 30px rgba(79,142,247,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Outfit', color: 'var(--blue)' }}>Premium Pro</h3>
            {isPremium && <span className="hero-badge" style={{ margin: 0, fontSize: '11px', background: 'var(--green-dim)', borderColor: 'var(--green)', color: 'var(--green)' }}>Active</span>}
          </div>
          <div>
            <span style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit', color: 'var(--blue)' }}>$9.99</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}> / month</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Unlock the ultimate habit and sobriety builder. Total access to the AI Coach and advanced tracking tools.
          </p>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <li>✓ <strong>All Habit Trackers</strong> (Gym, Smoke, Alcohol)</li>
            <li>✓ <strong>NVIDIA AI Coach</strong> (Unlimited Chat Support)</li>
            <li>✓ <strong>Detailed Health Timelines</strong> & Milestones</li>
            <li>✓ Premium Discord & Community support</li>
            <li>✓ Lifetime data export & statistics</li>
          </ul>

          {isPremium ? (
            <button className="btn-secondary" style={{ marginTop: 'auto' }} onClick={() => router.push('/dashboard')}>
              Go to Dashboard →
            </button>
          ) : loadingRequest ? (
            <button className="btn-secondary" style={{ marginTop: 'auto' }} disabled>
              Loading...
            </button>
          ) : pendingRequest ? (
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="btn-secondary" style={{ width: '100%', borderColor: 'var(--orange)', color: 'var(--orange)', background: 'rgba(249,115,22,0.02)', cursor: 'default' }}>
                Upgrade Request Pending ⏳
              </button>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.4' }}>
                We received your request on {pendingRequest.createdAt?.toDate?.().toLocaleDateString() ?? 'recently'}. We will reach out shortly.
              </p>
            </div>
          ) : (
            <button className="btn-primary" style={{ marginTop: 'auto', background: 'linear-gradient(135deg, var(--blue), #2563eb)' }} onClick={() => setShowModal(true)}>
              Upgrade to Premium 🌟
            </button>
          )}
        </div>
      </div>

      {/* Contact Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { if (!submitting) setShowModal(false); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--blue)' }}>
                <Sparkles size={20} />
                <span>Request Premium Pro</span>
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)} disabled={submitting}>&times;</button>
            </div>
            <div className="modal-body">
              {submitSuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: '28px'
                  }}>
                    ✓
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>Request Submitted!</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      Your request has been sent to the creator. We will contact you at <strong>{formEmail}</strong> with payment details and activation instructions.
                    </p>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => { setShowModal(false); setSubmitSuccess(false); }}>
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '4px' }}>
                    Fill out this quick form to request an upgrade to Premium Pro. The creator will get in touch with you shortly.
                  </p>

                  {submitError && (
                    <div className="auth-error">
                      {submitError}
                    </div>
                  )}

                  <label className="field-label">
                    Name
                    <input
                      type="text"
                      required
                      className="field-input"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Your Full Name"
                      disabled={submitting}
                    />
                  </label>

                  <label className="field-label">
                    Email Address
                    <input
                      type="email"
                      required
                      className="field-input"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      disabled={submitting}
                    />
                  </label>

                  <label className="field-label">
                    Phone Number (Optional)
                    <input
                      type="tel"
                      className="field-input"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      disabled={submitting}
                    />
                  </label>

                  <label className="field-label">
                    Message / Notes
                    <textarea
                      className="field-input field-textarea"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Any specific instructions or comments..."
                      disabled={submitting}
                      required
                      style={{ minHeight: '100px' }}
                    />
                  </label>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => setShowModal(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ flex: 2, background: 'linear-gradient(135deg, var(--blue), #2563eb)' }}
                      disabled={submitting}
                    >
                      {submitting ? 'Sending...' : 'Submit Request 🚀'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
