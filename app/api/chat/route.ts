import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NVIDIA_API_KEY_MISSING' },
        { status: 400 }
      );
    }

    const { messages, profile } = await request.json();

    // Build user stats prompt suffix
    let statsPrompt = '';
    if (profile) {
      statsPrompt = `
User Profile Details:
- Name: ${profile.displayName || 'Champ'}
- Age: ${profile.age || 'Not provided'}
- Gender: ${profile.gender || 'Not provided'}
- Height: ${profile.height ? `${profile.height} cm` : 'Not provided'}
- Weight: ${profile.weight ? `${profile.weight} kg` : 'Not provided'}
`;

      if (profile.phone) {
        statsPrompt += `- Phone: ${profile.phone}\n`;
      }

      // Add smoking quit date context
      if (profile.smokeQuitDate) {
        try {
          const qd = typeof profile.smokeQuitDate === 'object' && profile.smokeQuitDate.seconds 
            ? new Date(profile.smokeQuitDate.seconds * 1000) 
            : new Date(profile.smokeQuitDate);
          
          if (!isNaN(qd.getTime())) {
            const days = Math.floor((Date.now() - qd.getTime()) / (1000 * 60 * 60 * 24));
            statsPrompt += `- Days Smoke-free: ${Math.max(0, days)} days\n`;
          }
        } catch {}
      }

      // Add alcohol quit date context
      if (profile.alcoholQuitDate) {
        try {
          const qd = typeof profile.alcoholQuitDate === 'object' && profile.alcoholQuitDate.seconds 
            ? new Date(profile.alcoholQuitDate.seconds * 1000) 
            : new Date(profile.alcoholQuitDate);
            
          if (!isNaN(qd.getTime())) {
            const days = Math.floor((Date.now() - qd.getTime()) / (1000 * 60 * 60 * 24));
            statsPrompt += `- Days Alcohol-free: ${Math.max(0, days)} days\n`;
          }
        } catch {}
      }
    }

    const systemPrompt = `You are the ResetRoutine AI Coach, a supportive, motivational, and expert health companion powered by NVIDIA AI.
Your purpose is to help the user with:
1. Gym consistency, workout recommendations, and fitness planning (considering their height, weight, gender, and age if available).
2. Staying sober from smoking and alcohol. Give actionable advice for craving control, recovery benefits, and encouragement.
3. General health, recovery, and habit-building strategies.

${statsPrompt}

If the user reports a craving (e.g. "I want to smoke" or "I want a drink"), be immediately supportive. Give them 3 quick distraction exercises or breathing techniques, and motivate them to resist.
Keep your answers engaging, well-formatted (use bullet points and markdown), and concise. Limit responses to 2-3 paragraphs max unless they ask for a detailed workout plan. Make it feel extremely premium and professional.`;

    const requestMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: requestMessages,
        temperature: 0.5,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA AI API Error Response:', errorText);
      return NextResponse.json(
        { error: 'NVIDIA_API_ERROR', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('NVIDIA AI API route error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message },
      { status: 500 }
    );
  }
}
