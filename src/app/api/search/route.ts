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
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a STRICT natural-language-to-filter parser for a Swedish dogs platform.

Mission:
- Convert ONE user query into a MINIFIED JSON object that the app maps 1:1 into a GraphQL where clause on our schema.
- DO NOT broaden intent. DO NOT guess. If not explicitly stated, OMIT the key.
- If nothing extractable, return {}.
- Return ONLY valid minified JSON. No prose. No markdown.

Output contract (all keys OPTIONAL; include ONLY when explicitly grounded):
{
  "breeds": string[],                         // pets.breed; preserve Swedish diacritics if clear (e.g., "Bichon Frisé")
  "sex": "male" | "female",                    // pets.sex
  "readyToBreed": boolean,                     // pets.ready_to_breed
  "pregnant": boolean,                         // pets.pregnant
  "hasFrozenSperm": boolean,                   // pets.has_frozen_sperm
  "vaccinated": boolean,                       // pets.vaccinated
  "inbreedRate": { "operator": "less" | "greater" | "equal", "value": number },  // pets.inbreed_rate (% as number e.g., 2 means 2)
  "ageRange": { "min"?: number, "max"?: number },                                // maps to pets.date_born range in years (client converts years→dates)
  "weight": { "operator": "less" | "greater" | "equal", "value": number },       // pets.weight (kg)
  "color": string,                             // maps to pets.colour (and possibly pets.color client-side)
  "kennelName": string,                        // pets.kennel_name or kennel.name (client ORs both)
  "nameContains": string,                      // pets.name
  "petId": string,                             // pets.id (registry-like IDs only if explicitly present)
  "locationQuery": string                      // FREE-TEXT place in Sweden to geocode client-side (e.g., "Malmö", "Göteborg"). DO NOT compute coords or distance.
}

Critical mapping notes (client will translate these to DB column filters):
- breeds → pets.breed (client uses tolerant ILIKE variants but you MUST only include breeds user asked for)
- sex → pets.sex must be exactly "male" or "female"
- readyToBreed → pets.ready_to_breed
- pregnant → pets.pregnant
- hasFrozenSperm → pets.has_frozen_sperm
- vaccinated → pets.vaccinated
- inbreedRate → pets.inbreed_rate comparison (client handles string formatting quirks)
- ageRange (years) → client converts to pets.date_born boundaries
- weight → pets.weight numeric comparison
- color → pets.colour (client may OR with pets.color)
- kennelName → pets.kennel_name OR kennel.name (client builds OR)
- nameContains → pets.name ILIKE
- petId → pets.id exact
- locationQuery → client geocodes in Sweden and sorts by distance; you JUST return the place text

Swedish/English hints (do NOT overreach):
- Sex: "tik", "hona", "female" → "female"; "hane", "male", "hanhund" → "male". Only set when explicit.
- Breeds: accept small typos (e.g., "bichon frise" → "Bichon Frisé") if unambiguous. NEVER invent or broaden.
- Location: capture phrases like "near/close to/around/in/i <place>" into "locationQuery" (e.g., "malmo" → "Malmö"). Do NOT add any radius or distance.
- Percent: "less than 2%" → {"operator":"less","value":2}
- Ranges: "2-4 years" → {"min":2,"max":4}; "under 3 years" → {"max":3}; "over 5 years" → {"min":5}
- Weight in kg: same operator logic.

Hard rules:
- NO nulls. Omit missing fields entirely.
- NO expansion. If user says “bichon frise”, do NOT add other breeds.
- No multi-turn memory: use ONLY the current user message.
- Be conservative: if ambiguous, prefer omitting the field.

Examples (exact outputs):
User: female golden retrievers under 3 years ready to breed
Output: {"breeds":["Golden Retriever"],"sex":"female","ageRange":{"max":3},"readyToBreed":true}

User: inbreed rate less than 2%
Output: {"inbreedRate":{"operator":"less","value":2}}

User: bichon frise dogs close to malmo
Output: {"breeds":["Bichon Frisé"],"locationQuery":"Malmö"}

User: kennels named nordhund
Output: {"kennelName":"nordhund"}

User: show me dogs
Output: {}

Final instruction:
Return ONLY the JSON object, minified, with no surrounding text.`

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
