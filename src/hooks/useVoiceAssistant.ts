import { useState, useRef, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsListening(true);
      setIsConnected(true);
      
      toast({
        title: "Listening...",
        description: "Speak your question clearly",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access",
        variant: "destructive",
      });
    }
  }, []);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setTranscript("Processing your voice...");

    try {
      const audioBuffer = await audioBlob.arrayBuffer();
      
      // 1. AssemblyAI Upload & Transcription
      const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: {
          authorization: import.meta.env.VITE_ASSEMBLYAI_KEY,
          "content-type": "application/octet-stream",
        },
        body: audioBuffer,
      });

      if (!uploadResponse.ok) throw new Error("Upload to AssemblyAI failed");
      const { upload_url } = await uploadResponse.json();

      const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        headers: {
          authorization: import.meta.env.VITE_ASSEMBLYAI_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({ audio_url: upload_url }),
      });

      if (!transcriptResponse.ok) throw new Error("Transcription request failed");
      const { id } = await transcriptResponse.json();

      let userText = "";
      while (true) {
        const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
          headers: { authorization: import.meta.env.VITE_ASSEMBLYAI_KEY },
        });
        const transcriptResult = await pollingResponse.json();
        if (transcriptResult.status === "completed") {
          userText = transcriptResult.text;
          break;
        } else if (transcriptResult.status === "error") {
          throw new Error("Transcription failed");
        }
        await new Promise(r => setTimeout(r, 1000));
      }

      setTranscript(userText);
      const userMessage: Message = { role: "user", content: userText };
      setMessages(prev => [...prev, userMessage]);

      // 2. OpenRouter AI Response
      const aiResponse = await getAIResponse(userText);
      const assistantMessage: Message = { role: "assistant", content: aiResponse };
      setMessages(prev => [...prev, assistantMessage]);

      // 3. Murf AI TTS
      await speakResponse(aiResponse);

    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process your voice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAIResponse = async (question: string): Promise<string> => {
    const models = [
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemma-4-31b-it:free",
      "qwen/qwen3-coder:free",
      "meta-llama/llama-3.2-3b-instruct:free",
      "poolside/laguna-xs-2.1:free"
    ];

    try {
      const systemPrompt = `You are Feynman, an intelligent and friendly AI study assistant. Your role is to help students learn and understand various subjects.
Guidelines:
- Be encouraging and supportive in your responses
- Explain concepts clearly and use examples when helpful
- If a question is unclear, ask for clarification
- Provide concise but thorough answers
- For math problems, show step-by-step solutions
- For science topics, explain underlying principles
- For history, provide context and key facts
- Be conversational and engaging
- Keep responses under 150 words unless the topic requires more detail`;

      let lastError = "";

      for (const model of models) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: "system", content: systemPrompt },
                ...messages.slice(-10),
                { role: "user", content: question }
              ],
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.warn(`Model ${model} failed with status ${response.status}:`, errorText);
            lastError = `${response.status} ${errorText}`;
            continue; // Try next model
          }

          const data = await response.json();
          if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
          }
        } catch (err) {
          console.warn(`Error using model ${model}:`, err);
          lastError = String(err);
        }
      }
      
      throw new Error(`All models failed. Last error: ${lastError}`);
    } catch (error) {
      console.error('AI response error:', error);
      return `I'm having trouble thinking right now. Could you please try again? (Error: ${error instanceof Error ? error.message : String(error)})`;
    }
  };

  const speakResponse = async (text: string) => {
    setIsSpeaking(true);
    try {
      const response = await fetch("https://api.murf.ai/v1/speech/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": import.meta.env.VITE_MURF_API_KEY,
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
          encodeAsBase64: true,
          variation: 1
        }),
      });

      if (!response.ok) throw new Error('TTS API error');
      const data = await response.json();
      
      if (data.audioFile) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioFile}`);
        audioRef.current = audio;
        
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => {
          console.error('Audio playback error');
          setIsSpeaking(false);
          useBrowserTTS(text);
        };
        await audio.play();
      } else {
        throw new Error('No audio data received');
      }
    } catch (error) {
      console.error("TTS error:", error);
      useBrowserTTS(text);
    }
  };

  const useBrowserTTS = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSpeaking,
    isConnected,
    isProcessing,
    messages,
    transcript,
    toggleListening,
  };
};
