import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Fast‑fail if no API key is configured to avoid long hanging requests
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 503 }
      );
    }

    // Use OpenAI to analyze the natural language query and extract structured filters
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a pet search assistant for a dogs platform.
Return ONLY a compact JSON object that maps directly to our Advanced Filters UI and GraphQL where clause.

Strict output schema (keys and values are CASE-SENSITIVE):
{
  "breeds": string[] | undefined,       // breed names as displayed in UI (exact names from user text)
  "sex": "male" | "female" | null | undefined,
  "readyToBreed": boolean | undefined,
  "pregnant": boolean | undefined,
  "hasFrozenSperm": boolean | undefined,
  "vaccinated": boolean | undefined,
  "inbreedRate": { "operator": "less" | "greater" | "equal", "value": number } | undefined,
  "ageRange": { "min"?: number, "max"?: number } | undefined,
  "weight": { "operator": "less" | "greater" | "equal", "value": number } | undefined
}

Mapping rules to our filters (exact database column names):
- sex -> maps to GraphQL 'sex' with values 'male' or 'female'
- readyToBreed -> GraphQL 'ready_to_breed' boolean
- pregnant -> GraphQL 'pregnant' boolean
- hasFrozenSperm -> GraphQL 'has_frozen_sperm' boolean
- vaccinated -> GraphQL 'vaccinated' boolean
- breeds -> GraphQL 'breed' with {_in: breeds}
- inbreedRate.value is PERCENT (number). Use operator (<, >, =) semantics.
- age expressions ("under 3 years" / "over 2" / "2-4 years") -> fill ageRange with MIN/MAX in YEARS.
- weight in kg (same operator mapping) -> fill weight with number (kg).
- color -> GraphQL 'colour' (note: 'colour' with 'u', not 'color')

Normalization:
- Accept typos or variants (e.g., 'bichon frise', 'bichon frisè') and keep the cleaned breed name string provided by user; do NOT fabricate unknown breed names.
- If no info for a field, omit the key entirely (do NOT return null except for sex if explicitly unspecified).

Examples (exact outputs expected):
User: "female golden retrievers under 3 years ready to breed"
Output: {"breeds":["Golden Retriever"],"sex":"female","ageRange":{"max":3},"readyToBreed":true}

User: "inbreed rate less than 2%"
Output: {"inbreedRate":{"operator":"less","value":2}}

Return ONLY the JSON object with no text around it.`
        },
        { role: "user", content: query }
      ],
      temperature: 0.1,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let filters;
    try {
      filters = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response);
      throw new Error('Invalid response format from OpenAI');
    }

    return NextResponse.json({ filters });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process search query' }, 
      { status: 500 }
    );
  }
}
