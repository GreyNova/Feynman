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
    const ASSEMBLYAI_API_KEY = Deno.env.get('ASSEMBLYAI_API_KEY');
    
    if (!ASSEMBLYAI_API_KEY) {
      console.error('ASSEMBLYAI_API_KEY is not configured');
      throw new Error('AssemblyAI API key is not configured');
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      throw new Error('No audio file provided');
    }

    console.log('Received audio file:', audioFile.name, 'size:', audioFile.size);

    // Upload audio to AssemblyAI
    const audioBuffer = await audioFile.arrayBuffer();
    console.log('Uploading audio to AssemblyAI...');
    
    const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        "content-type": "application/octet-stream",
      },
      body: audioBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Upload failed:', uploadResponse.status, errorText);
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    const { upload_url } = await uploadResponse.json();
    console.log('Audio uploaded successfully, URL:', upload_url);

    // Request transcription
    console.log('Requesting transcription...');
    const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({ audio_url: upload_url }),
    });

    if (!transcriptResponse.ok) {
      const errorText = await transcriptResponse.text();
      console.error('Transcription request failed:', transcriptResponse.status, errorText);
      throw new Error(`Transcription request failed: ${transcriptResponse.status}`);
    }

    const { id } = await transcriptResponse.json();
    console.log('Transcription started, ID:', id);

    // Poll for result
    let transcriptResult;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds max wait
    
    while (attempts < maxAttempts) {
      const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      });
      
      transcriptResult = await pollingResponse.json();
      console.log('Polling attempt', attempts + 1, 'status:', transcriptResult.status);

      if (transcriptResult.status === "completed") {
        console.log('Transcription completed:', transcriptResult.text);
        break;
      }
      if (transcriptResult.status === "error") {
        console.error('Transcription error:', transcriptResult.error);
        throw new Error(`Transcription failed: ${transcriptResult.error}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Transcription timed out');
    }

    return new Response(
      JSON.stringify({ text: transcriptResult.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in speech-to-text function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
