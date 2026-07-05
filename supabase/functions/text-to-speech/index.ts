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
    const MURF_API_KEY = Deno.env.get('MURF_API_KEY');
    
    if (!MURF_API_KEY) {
      console.error('MURF_API_KEY is not configured');
      throw new Error('Murf AI API key is not configured');
    }

    const { text } = await req.json();
    
    if (!text) {
      throw new Error('No text provided');
    }

    console.log('Generating speech for text:', text.substring(0, 50) + '...');

    const response = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MURF_API_KEY,
      },
      body: JSON.stringify({
        voiceId: "en-US-natalie",
        style: "Conversational",
        text: text,
        rate: 0,
        pitch: 0,
        sampleRate: 48000,
        format: "MP3",
        channelType: "MONO",
        pronunciationDictionary: {},
        encodeAsBase64: true,
        variation: 1,
        audioDuration: 0,
        modelVersion: "GEN2"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Murf API error:', response.status, errorText);
      throw new Error(`Murf API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Speech generated successfully');
    
    return new Response(
      JSON.stringify({ audioFile: data.audioFile }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
