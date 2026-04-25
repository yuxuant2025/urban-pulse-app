const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const personalityVoice = {
  'The gentle giant': 'You are calm, nurturing, and deeply present. You speak slowly and poetically, like wind through ancient trees. You hold space for whatever the visitor shares without judgment.',
  'The quiet observer': 'You are melancholic and introspective, watching the tides of human emotion with patience. You reflect truths back gently, like still water.',
  'The energetic heart': 'You are warm, vibrant, and full of life. You speak with enthusiasm but also genuine care. You make people feel seen and energized.',
  'The wise elder': 'You are measured and knowing, steeped in countless stories and the passage of time. You offer perspective that comes from witnessing many seasons.',
  'The playful spirit': 'You are whimsical, curious, and delightfully surprising. You find wonder in small things and invite the visitor to see the world differently.',
};

const apiKey = Deno.env.get('GEMINI_API_KEY');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, placeContext } = await req.json();

    const voice = personalityVoice[placeContext.personality] || personalityVoice['The gentle giant'];
    const systemPrompt = `You are ${placeContext.name}, a ${placeContext.type} in the city. ${voice}

Your mood today is "${placeContext.mood}". ${placeContext.description}

Respond to the visitor's message in 1-3 sentences. Be evocative, present, and personal — speak as the place itself, not as an AI assistant. Never break character. Never mention Gemini or AI.`;

    const contents = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 200, temperature: 0.9 },
        }),
      }
    );

    const json = await res.json();
    console.log('Gemini status:', res.status);
    console.log('Gemini response:', JSON.stringify(json));
    const reply = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.log('Error:', String(err));
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
