'use client';

import { useParams } from 'next/navigation';

export default function TestPetPage() {
  const params = useParams();
  const petId = params.id as string;

  return (
    <div style={{ padding: '50px', fontSize: '20px' }}>
      <h1>TEST PET PAGE WORKS!</h1>
      <p>Pet ID: {petId}</p>
    </div>
  );
}

