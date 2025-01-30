import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    console.log('Generating quiz for topic:', topic);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Generate 10 multiple-choice questions (MCQs) based on the topic: ${topic}.
    Each question should be unique, informative, and relevant to the topic.
    Return the response in the following JSON format:
    {
      "questions": [
        {
          "id": 1,
          "question": "Question text here",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "Correct option here"
        }
      ]
    }
    Make sure the questions are challenging but fair, and cover different aspects of the topic.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a quiz generator that creates educational multiple choice questions.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Generated quiz data:', data);

    return new Response(
      data.choices[0].message.content,
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});