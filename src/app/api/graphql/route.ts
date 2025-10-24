import { NextRequest, NextResponse } from 'next/server';

const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_ENDPOINT;
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET;

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!HASURA_ENDPOINT || !HASURA_ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'GraphQL endpoint not configured' }, 
        { status: 500 }
      );
    }

    const response = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify({
        query,
        variables: variables || {},
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('GraphQL API error:', error);
    return NextResponse.json(
      { error: 'Failed to execute GraphQL query' }, 
      { status: 500 }
    );
  }
}
