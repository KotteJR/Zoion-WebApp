"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Kennel {
  id: string;
  name: string;
  address?: string | null;
  post_number?: string | null;
  phone_number?: string | null;
  website?: string | null;
  email?: string | null;
}

export default function KennelCard({ kennel }: { kennel: Kennel }) {
  const router = useRouter();
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{kennel.name}</h3>
            {kennel.address && (
              <p className="text-sm text-muted-foreground">
                {kennel.address} {kennel.post_number ? `, ${kennel.post_number}` : ""}
              </p>
            )}
            {kennel.phone_number && (
              <p className="text-sm text-muted-foreground">{kennel.phone_number}</p>
            )}
            {kennel.email && (
              <p className="text-sm text-muted-foreground">{kennel.email}</p>
            )}
          </div>
          <Button variant="outline" onClick={() => router.push(`/kennel/${kennel.id}`)}>
            Visa kennel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


