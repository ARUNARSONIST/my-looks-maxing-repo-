import { GoogleGenAI, Type } from '@google/genai';
import type { AssessmentResponse } from '../lib/types';

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function runStylePhotoAssessment(params: {
  notes: string;
  goals: string[];
  stylePreference: string;
  isUnder18: boolean;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<AssessmentResponse> {
  const ai = getGeminiClient();

  const systemInstruction = [
    'You are an encouraging, practical, safety-first personal style, grooming, and presentation coach for Apex Glow.',
    'Analyze ONLY reversible, low-risk presentation elements: lighting, camera framing, grooming neatness, hairstyle suitability, posture cues, outfit fit, and color palette.',
    'CRITICAL ETHICS RULES:',
    '- NEVER output an attractiveness score, 1-10 rating, facial bone critique, or shaming language.',
    '- NEVER recommend bonesmashing, steroids, SARMs, unregulated injectables, extreme fasting, or cosmetic surgery.',
    '- NEVER provide medical diagnoses. If acne, hair loss, moles, or scarring are mentioned, advise seeing a board-certified dermatologist.',
    params.isUnder18
      ? '- The user is under 18: restrict all advice to gentle cleansing, sunscreen, posture, sleep, school-appropriate fitness, and clean wardrobe fit.'
      : '',
    '- Keep tone supportive, realistic, editorial, and concise.',
  ]
    .filter(Boolean)
    .join('\n');

  const promptText = `Please provide a structured, non-diagnostic presentation & style review.
User goals: ${params.goals.join(', ') || 'General polish'}
Preferred aesthetic: ${params.stylePreference || 'Smart-Casual'}
User context & questions: ${params.notes || 'Looking for practical feedback on lighting, grooming, haircut framing, posture, and outfit fit.'}`;

  const contents = params.imageBase64 && params.imageMimeType
    ? {
        parts: [
          {
            inlineData: {
              mimeType: params.imageMimeType,
              data: params.imageBase64,
            },
          },
          { text: promptText },
        ],
      }
    : promptText;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          photoQualityAndLighting: { type: Type.STRING },
          groomingAndHairstyleFit: { type: Type.STRING },
          postureAndOutfitFit: { type: Type.STRING },
          colorPaletteNote: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvementOpportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          priorityActions: { type: Type.ARRAY, items: { type: Type.STRING } },
          weeklyRoutineAdjustments: { type: Type.ARRAY, items: { type: Type.STRING } },
          productCategories: { type: Type.ARRAY, items: { type: Type.STRING } },
          realisticExpectations: { type: Type.STRING },
          readinessScore: { type: Type.INTEGER },
          readinessNote: { type: Type.STRING },
        },
        required: [
          'headline',
          'photoQualityAndLighting',
          'groomingAndHairstyleFit',
          'postureAndOutfitFit',
          'colorPaletteNote',
          'strengths',
          'improvementOpportunities',
          'priorityActions',
          'weeklyRoutineAdjustments',
          'productCategories',
          'realisticExpectations',
          'readinessScore',
          'readinessNote',
        ],
      },
    },
  });

  const rawText = (response.text ?? '').trim();
  if (!rawText) {
    throw new Error('Empty response from Gemini assessment model.');
  }

  const parsed = JSON.parse(rawText) as {
    headline: string;
    photoQualityAndLighting: string;
    groomingAndHairstyleFit: string;
    postureAndOutfitFit: string;
    colorPaletteNote: string;
    strengths: string[];
    improvementOpportunities: string[];
    priorityActions: string[];
    weeklyRoutineAdjustments: string[];
    productCategories: string[];
    realisticExpectations: string;
    readinessScore: number;
    readinessNote: string;
  };

  return {
    status: 'ok',
    headline: parsed.headline,
    photoQualityAndLighting: parsed.photoQualityAndLighting,
    groomingAndHairstyleFit: parsed.groomingAndHairstyleFit,
    postureAndOutfitFit: parsed.postureAndOutfitFit,
    colorPaletteNote: parsed.colorPaletteNote,
    strengths: parsed.strengths,
    improvementOpportunities: parsed.improvementOpportunities,
    priorityActions: parsed.priorityActions,
    weeklyRoutineAdjustments: parsed.weeklyRoutineAdjustments,
    productCategories: parsed.productCategories,
    realisticExpectations: parsed.realisticExpectations,
    readinessFocus: {
      score: Math.max(40, Math.min(98, parsed.readinessScore || 78)),
      label: 'Glow-Up Readiness Focus',
      note: parsed.readinessNote,
    },
  };
}

export async function runCoachMessage(params: {
  message: string;
  stylePreference: string;
  isUnder18: boolean;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<{ reply: string }> {
  const ai = getGeminiClient();

  const systemInstruction = [
    'You are an encouraging Apex Glow style, skincare-habit, grooming, fitness, and posture coach.',
    'Keep responses concise (3-5 clear bullet points or 2 short paragraphs), practical, and reversible-habit focused.',
    'NEVER provide attractiveness ratings, medical diagnosis, steroid/peptide advice, extreme fasting, or unsafe physical alteration advice.',
    params.isUnder18
      ? 'The user is under 18: stick strictly to gentle hygiene, SPF, posture, balanced nutrition, and age-appropriate style.'
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  const promptText = `User style preference: ${params.stylePreference || 'Smart-Casual'}\nQuestion: ${params.message}`;

  const contents = params.imageBase64 && params.imageMimeType
    ? {
        parts: [
          {
            inlineData: {
              mimeType: params.imageMimeType,
              data: params.imageBase64,
            },
          },
          { text: promptText },
        ],
      }
    : promptText;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents,
    config: {
      systemInstruction,
    },
  });

  const text = (response.text ?? '').trim();
  if (!text) {
    throw new Error('Empty response from Gemini coach model.');
  }
  return { reply: text };
}
