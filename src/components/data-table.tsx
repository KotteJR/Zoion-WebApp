'use client';

import { useQuery } from '@apollo/client';
import { SEARCH_PETS } from '../lib/graphql/queries';
import Link from 'next/link';

export function DataTable({ data }: { data?: any }) {
  const { data: petsData, loading } = useQuery(SEARCH_PETS, { variables: { limit: 20 } });
  const pets = petsData?.pets ?? [];

  return (
    <div className="px-4 lg:px-6">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="border-b px-4 py-3 font-medium">Pets</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Breed</th>
                <th className="text-left px-4 py-2">Sex</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-4" colSpan={4}>Loading...</td></tr>
              ) : pets.length === 0 ? (
                <tr><td className="px-4 py-4" colSpan={4}>No pets found</td></tr>
              ) : (
                pets.map((p: any) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.breed}</td>
                    <td className="px-4 py-2 capitalize">{p.sex}</td>
                    <td className="px-4 py-2">
                      <Link href={`/pet/${p.id}`} className="text-primary hover:underline">Open</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


