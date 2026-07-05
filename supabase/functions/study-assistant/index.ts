import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not configured');
      throw new Error('OpenRouter API key is not configured');
    }

    const { question, conversationHistory } = await req.json();
    
    if (!question) {
      throw new Error('No question provided');
    }

    console.log('Generating AI response for:', question.substring(0, 50) + '...');

    const systemPrompt = `You are Kiro, an intelligent and friendly AI study assistant. Your role is to help students learn and understand various subjects.

Guidelines:
- Be encouraging and supportive in your responses
- Explain concepts clearly and use examples when helpful
- If a question is unclear, ask for clarification
- Provide concise but thorough answers
- For math problems, show step-by-step solutions
- For science topics, explain underlying principles
- For history, provide context and key facts
- Be conversational and engaging
- Keep responses under 150 words unless the topic requires more detail

You can help with subjects like:
- Mathematics (algebra, calculus, geometry, statistics)
- Science (physics, chemistry, biology)
- History and social studies
- Language arts and literature
- General study tips and techniques`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: question }
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI response generated:', aiResponse.substring(0, 50) + '...');
    
    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in study-assistant function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
