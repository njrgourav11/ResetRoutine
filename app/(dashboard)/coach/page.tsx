'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Dumbbell, CigaretteOff, Beer, Sparkles, Bot, AlertTriangle, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  { text: 'Suggest a workout plan based on my stats', prompt: 'Based on my height, weight, gender, and age from my profile, please suggest a personalized weekly gym workout routine for muscle building and stamina.', Icon: Dumbbell },
  { text: 'Help, I have a smoking craving right now!', prompt: 'I am experiencing an intense craving to smoke right now. Please give me some immediate, actionable coping mechanisms, breathing exercises, and motivation.', Icon: CigaretteOff },
  { text: 'What happens to my liver after I quit alcohol?', prompt: 'Can you explain the timeline of liver regeneration and overall health benefits when someone quits drinking alcohol?', Icon: Beer },
  { text: 'How should I eat for optimal recovery?', prompt: 'What are some basic dietary guidelines and meal suggestions for someone tracking workouts and sobriety to maximize muscle recovery and energy?', Icon: Sparkles },
];

export default function CoachPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      if (messages.length === 0) {
        setMessages([
          {
            role: 'assistant',
            content: `Hello ${profile?.displayName?.split(' ')[0] ?? 'Champ'}! I am your ResetRoutine AI Coach, powered by NVIDIA AI. I'm here to help you stay consistent with the gym and support you on your smoking and alcohol sobriety journeys. What can I do for you today?`,
          },
        ]);
      }
    });
  }, [profile, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError('');
    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          profile,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        if (errData.error === 'NVIDIA_API_KEY_MISSING') {
          setApiKeyMissing(true);
          throw new Error('NVIDIA AI API Key is missing.');
        } else {
          throw new Error(errData.message || 'Failed to get response from AI coach.');
        }
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'I could not process that request.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold parsing: **bold**
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Check if bullet point
      if (formatted.trim().startsWith('- ')) {
        return <li key={idx} dangerouslySetInnerHTML={{ __html: formatted.replace(/^\s*-\s+/, '') }} style={{ marginLeft: '16px', listStyleType: 'disc', marginTop: '4px' }} />;
      }
      if (formatted.trim().startsWith('* ')) {
        return <li key={idx} dangerouslySetInnerHTML={{ __html: formatted.replace(/^\s*\*\s+/, '') }} style={{ marginLeft: '16px', listStyleType: 'disc', marginTop: '4px' }} />;
      }
      
      return <p key={idx} dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }} style={{ margin: '6px 0' }} />;
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={32} className="text-blue" style={{ color: 'var(--blue)' }} />
            <h1 className="page-title">NVIDIA AI Coach</h1>
          </div>
          <p className="page-sub" style={{ marginTop: '4px' }}>Your personal Sobriety & Fitness trainer, powered by Llama 3.1 NIM.</p>
        </div>
      </div>

      {apiKeyMissing && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--orange)', background: 'rgba(249,115,22,0.05)', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--orange)', marginBottom: '8px' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontWeight: '700' }}>NVIDIA API Key Not Configured</h3>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            The AI Health Coach requires an API key to function. Please:
          </p>
          <ol style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '20px', marginTop: '8px', lineHeight: '1.6' }}>
            <li>Generate a free API key at the <a href="https://build.nvidia.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)', textDecoration: 'underline' }}>NVIDIA Build Catalog</a>.</li>
            <li>Add `NVIDIA_API_KEY=your_key_here` to your <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '4px' }}>.env.local</code> file in the project root.</li>
            <li>Restart your Next.js development server to load the new environment variable.</li>
          </ol>
        </div>
      )}

      {error && <p className="auth-error" style={{ marginBottom: '16px' }}>{error}</p>}

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.role}`}>
              {renderMessageContent(m.content)}
            </div>
          ))}
          {loading && (
            <div className="typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && !loading && (
          <div className="chat-suggestion-grid">
            {SUGGESTIONS.map((s) => (
              <button key={s.text} className="chat-suggestion-card" onClick={() => handleSend(s.prompt)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <s.Icon size={18} className="text-blue" style={{ color: 'var(--blue)' }} />
                <span>{s.text}</span>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="chat-input-wrapper">
          <input
            type="text"
            className="field-input chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI coach about fitness, sobriety, or resisting cravings..."
            disabled={loading}
          />
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} disabled={loading || !input.trim()}>
            <span>Send</span>
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}

