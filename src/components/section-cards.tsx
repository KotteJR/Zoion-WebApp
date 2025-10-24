'use client';

import { useQuery } from '@apollo/client';
import { READY_TO_BREED_FEED } from '@/lib/graphql/queries';

export function SectionCards() {
  const { data } = useQuery(READY_TO_BREED_FEED, { variables: { limit: 10 } });
  const readyCount = data?.pets?.length ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 md:grid-cols-2 xl:grid-cols-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">Ready to Breed</div>
        <div className="mt-2 text-3xl font-semibold">{readyCount}</div>
        <div className="text-xs text-gray-400 mt-1">Top 10 recent</div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">Suggested Males</div>
        <div className="mt-2 text-3xl font-semibold">—</div>
        <div className="text-xs text-gray-400 mt-1">Based on preferences</div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">Suggested Females</div>
        <div className="mt-2 text-3xl font-semibold">—</div>
        <div className="text-xs text-gray-400 mt-1">Based on preferences</div>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">New Pets</div>
        <div className="mt-2 text-3xl font-semibold">—</div>
        <div className="text-xs text-gray-400 mt-1">Recent additions</div>
      </div>
    </div>
  );
}


