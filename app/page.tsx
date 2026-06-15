import Link from 'next/link';
import { Dumbbell, CigaretteOff, Beer, Bot, Sparkles, Activity, Check, X, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-nav" id="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} id="logo-container">
          <Activity size={24} style={{ color: 'var(--blue)' }} />
          <span className="logo-text">ResetRoutine</span>
        </div>
        <nav className="landing-nav-links" id="nav-actions">
          <Link href="/login" className="btn-secondary" id="link-signin">Sign In</Link>
          <Link href="/signup" className="btn-primary" id="link-signup">Get Started</Link>
        </nav>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="hero" id="hero-section">
          <div className="hero-badge" id="hero-alert-badge">
            <Sparkles size={14} style={{ marginRight: '6px', color: 'var(--blue)' }} />
            <span>30-Day Free Trial Available</span>
          </div>
          <h1 className="hero-title" id="hero-main-title">
            Reset your routine.<br />
            <span className="hero-accent">Rebuild your life.</span>
          </h1>
          <p className="hero-sub" id="hero-description">
            ResetRoutine combines a gym consistency tracker, nicotine sobriety counters,
            and alcohol abstinence logging with a custom NVIDIA AI Health Coach. Reclaim your strength today.
          </p>
          <div className="hero-ctas" id="hero-cta-buttons">
            <Link href="/signup" className="btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }} id="btn-start-trial">
              <span>Start Your Free Trial</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn-ghost btn-lg" id="btn-hero-signin">Sign In</Link>
          </div>
        </section>

        {/* Core Pillars / Features */}
        <section className="features" id="pillars-section" style={{ paddingBottom: '40px' }}>
          <div className="feature-card" id="pillar-gym">
            <span className="stat-icon-wrapper" style={{ color: 'var(--blue)', background: 'var(--blue-dim)', marginBottom: '16px' }}>
              <Dumbbell size={22} />
            </span>
            <h3>Gym Consistency</h3>
            <p>Log workout check-ins, build streak milestones, and visualize your weekly consistency. Strengthen your body as the foundation of recovery.</p>
          </div>
          <div className="feature-card" id="pillar-smoke">
            <span className="stat-icon-wrapper" style={{ color: 'var(--green)', background: 'var(--green-dim)', marginBottom: '16px' }}>
              <CigaretteOff size={22} />
            </span>
            <h3>Nicotine Sobriety</h3>
            <p>Monitor your smoke-free days, hours, and seconds. View aggregate money saved, trigger cravings logs, and celebrate clean lungs.</p>
          </div>
          <div className="feature-card" id="pillar-alcohol">
            <span className="stat-icon-wrapper" style={{ color: 'var(--orange)', background: 'var(--orange-dim)', marginBottom: '16px' }}>
              <Beer size={22} />
            </span>
            <h3>Alcohol Abstinence</h3>
            <p>Track your alcohol-free progress, drinks avoided, and total money saved. Monitor vital liver and heart health detox milestones.</p>
          </div>
        </section>

        {/* NVIDIA AI Coach Feature Spotlight */}
        <section className="page-container" id="ai-spotlight-section" style={{ maxWidth: '1000px', paddingBottom: '60px' }}>
          <div className="glass-card spotlight-card" style={{ background: 'rgba(79,142,247,0.02)', border: '1px solid rgba(79,142,247,0.15)' }}>
            <div>
              <span className="stat-icon-wrapper" style={{ color: 'var(--blue)', background: 'var(--blue-dim)', marginBottom: '16px', width: '48px', height: '48px' }}>
                <Bot size={26} />
              </span>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '24px', marginBottom: '12px' }}>Personalized NVIDIA AI Coach</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                Powered by Llama 3.1 NIM, your ResetRoutine AI Coach tailors physical training and craving-rescue strategies based directly on your age, weight, height, and sobriety stats.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span>Instant craving rescue exercises & breathing tips</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span>Workout splits designed around your body stats</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span>Recovery advice & detox timeline explanations</span>
                </li>
              </ul>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--blue-dim)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '8px 8px 0 8px', padding: '10px 14px', fontSize: '13px', alignSelf: 'flex-end', maxWidth: '85%' }}>
                I am having a drink craving after a stressful day. Help!
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px 8px 8px 0', padding: '10px 14px', fontSize: '13px', alignSelf: 'flex-start', maxWidth: '85%', color: 'var(--text-secondary)', borderLeft: '3px solid var(--blue)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Let&apos;s breathe. Take 3 deep breaths right now. I suggest a 5-minute cold shower or a walk. Stress is temporary, your consistency is permanent!</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing SaaS Section */}
        <section className="page-container" id="pricing-section" style={{ maxWidth: '1000px', paddingBottom: '60px' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', marginBottom: '10px' }}>Simple, Transparent SaaS Pricing</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px' }}>Start completely free. Upgrade when you are ready to unlock full potential.</p>
          
          <div className="two-col">
            {/* Trial Plan */}
            <div className="glass-card pricing-card">
              <h3 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Outfit' }}>30-Day Free Trial</h3>
              <div>
                <span style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'Outfit' }}>$0</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}> / 30 days</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Test drive the ResetRoutine dashboards and establish your starting streak.
              </p>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span>Full Gym consistency tracker</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span>Smoking sobriety analytics</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span>Alcohol sobriety analytics</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <X size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>Personal NVIDIA AI coach</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <X size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>Advanced detox timelines</span>
                </li>
              </ul>
              <Link href="/signup" className="btn-secondary" style={{ marginTop: 'auto', textAlign: 'center' }}>Start Trial</Link>
            </div>

            {/* Premium Plan */}
            <div className="glass-card pricing-card pricing-premium">
              <h3 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'Outfit', color: 'var(--blue)' }}>Premium Pro</h3>
              <div>
                <span style={{ fontSize: '36px', fontWeight: '800', fontFamily: 'Outfit', color: 'var(--blue)' }}>$9.99</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}> / month</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Unlimited tracking, live countdown widgets, and full chat with the NVIDIA AI Coach.
              </p>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span><strong>All Habit Trackers</strong></span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span><strong>NVIDIA AI Coach</strong> (Unlimited Chat Support)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span><strong>Detailed Health Timelines</strong> & timeline logs</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span>Community Discord access</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} className="text-green" style={{ color: 'var(--green)' }} />
                  <span>Cancel anytime</span>
                </li>
              </ul>
              <Link href="/signup" className="btn-primary" style={{ marginTop: 'auto', textAlign: 'center', background: 'linear-gradient(135deg, var(--blue), #2563eb)' }}>Upgrade to Pro</Link>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="page-container" id="faq-section" style={{ maxWidth: '800px', paddingBottom: '80px' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'Outfit', fontWeight: 800, fontSize: '28px', marginBottom: '32px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-card" id="faq-1">
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Why combine fitness tracking with sobriety tracking?</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Physical exercise triggers natural endorphin releases that directly mitigate withdrawal stress, anxiety, and cravings. Combining them reinforces your progress and accelerates biological recovery.
              </p>
            </div>
            <div className="glass-card" id="faq-2">
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>How does the 30-day trial work?</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                When you create an account, you get 30 days of full dashboard access completely free. After 30 days, you will be prompted to subscribe to Premium Pro to continue logging and chatting with the AI Coach.
              </p>
            </div>
            <div className="glass-card" id="faq-3">
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Is my health data private and secure?</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Yes. ResetRoutine uses secure Firebase security rules which prevent unauthorized read/write access. Only you can view or write to your tracking dashboard and chatbot histories.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="page-container" id="landing-footer" style={{ borderTop: '1px solid var(--border)', padding: '30px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} ResetRoutine. Built for consistency and recovery. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
