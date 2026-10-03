import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = "AQ.Ab8RN6JrClYK9qh5nb5tvVZiwr8tDnhY3_gNu4VTVjYZYFii1g";
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface EstimateRequest {
  description: string;
  categoryName: string;
  categoryBase: number;
  locationCountry: string;
  locationCurrency: string;
  sizeName: string;
  qualityName: string;
}

interface GeminiEstimateResponse {
  projectTitle: string;
  items: Array<{
    name: string;
    detail: string;
    quantity: number;
    rate: number;
  }>;
  subtotal: number;
  contingency: number;
  taxes: number;
  total: number;
  low: number;
  high: number;
  confidence: number;
  durationMin: number;
  durationMax: number;
}

function buildPrompt(input: EstimateRequest): string {
  return `You are a senior project estimator and market analyst for a digital agency. Analyze the project description and generate a realistic, market-aware cost estimate.

## Project Details
- Description: "${input.description}"
- Category: ${input.categoryName} (typical base range: $${input.categoryBase.toLocaleString()} USD)
- Location: ${input.locationCountry} (currency: ${input.locationCurrency})
- Project size: ${input.sizeName}
- Quality level: ${input.qualityName}

## Instructions
1. Analyze the project description carefully to understand scope, complexity, and requirements
2. Consider current market rates for ${input.locationCountry} and the ${input.categoryName} industry
3. Factor in the project size (${input.sizeName}) and quality level (${input.qualityName})
4. Generate a detailed line-item breakdown with realistic quantities and rates
5. All monetary values should be in ${input.locationCurrency}
6. Include a 5% contingency on subtotal
7. Apply appropriate taxes for ${input.locationCountry}
8. Provide a confidence score (60-95) based on description clarity
9. Provide a realistic duration range in weeks

## Response Format
Respond with ONLY valid JSON (no markdown, no code blocks) in this exact structure:
{
  "projectTitle": "A concise project title (max 76 chars)",
  "items": [
    {
      "name": "Phase name",
      "detail": "Brief description of deliverables",
      "quantity": <number>,
      "rate": <number in ${input.locationCurrency}>
    }
  ],
  "subtotal": <number>,
  "contingency": <number>,
  "taxes": <number>,
  "total": <number>,
  "low": <number - about 12% below total>,
  "high": <number - about 17% above total>,
  "confidence": <number between 60-95>,
  "durationMin": <number of weeks>,
  "durationMax": <number of weeks>
}

Generate 5 line items covering: Discovery & Strategy, Design, Development, Quality Assurance, and Project Management.
Make the estimate realistic and market-competitive for ${input.locationCountry}.`;
}

function parseGeminiResponse(text: string): GeminiEstimateResponse | null {
  try {
    // Remove markdown code block if present
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned) as GeminiEstimateResponse;

    // Validate required fields
    if (
      !parsed.projectTitle ||
      !Array.isArray(parsed.items) ||
      parsed.items.length === 0 ||
      typeof parsed.total !== "number" ||
      parsed.total <= 0
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as EstimateRequest;

    if (!body.description || body.description.trim().length < 12) {
      return NextResponse.json(
        { error: "Description must be at least 12 characters" },
        { status: 400 },
      );
    }

    const prompt = buildPrompt(body);

    const geminiResponse = await fetch(
      `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      return NextResponse.json(
        { error: `Gemini API error ${geminiResponse.status}: ${errorText}` },
        { status: 502 },
      );
    }

    const geminiData = await geminiResponse.json();
    const responseText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!responseText) {
      return NextResponse.json(
        { error: "Empty response from Gemini" },
        { status: 502 },
      );
    }

    const estimate = parseGeminiResponse(responseText);

    if (!estimate) {
      return NextResponse.json(
        { error: "Failed to parse Gemini response" },
        { status: 502 },
      );
    }

    return NextResponse.json(estimate);
  } catch (error) {
    console.error("Estimate API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
