'use client';

export default function DebugPage() {
  const testDirectFetch = async () => {
    try {
      const response = await fetch('https://api.zoion.biz/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': 'gnBzeSdjwrVzgWkL',
        },
        body: JSON.stringify({
          query: 'query { pets(limit: 3) { id name breed sex } }'
        }),
      });
      const result = await response.json();
      console.log('Direct fetch result:', result);
      alert('Check console for direct fetch result');
    } catch (err) {
      console.error('Direct fetch error:', err);
      alert('Direct fetch error: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Environment Variables:</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify({
            GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL,
            HASURA_SECRET: process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET ? 'SET' : 'NOT SET',
          }, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Test Direct Fetch:</h2>
        <button 
          onClick={testDirectFetch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Direct Fetch
        </button>
      </div>
    </div>
  );
}