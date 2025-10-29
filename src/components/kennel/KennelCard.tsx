"use client";

import { Card, CardContent } from "@/components/ui/card";
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
  const handleClick = () => router.push(`/kennel/${kennel.id}`);

  return (
    <div onClick={handleClick} className="block cursor-pointer h-full">
      <Card className="overflow-hidden pet-card-hover h-full transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Left placeholder circle to align visually with PetCard image area */}
            <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#3d7c6f] font-semibold">
              K
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {kennel.name}
              </h3>
              <div className="mt-1 space-y-1">
                {kennel.address && (
                  <p className="text-sm text-muted-foreground leading-snug break-words">
                    {kennel.address}{kennel.post_number ? `, ${kennel.post_number}` : ""}
                  </p>
                )}
                {kennel.phone_number && (
                  <p className="text-sm text-muted-foreground leading-snug">{kennel.phone_number}</p>
                )}
                {kennel.email && (
                  <p className="text-sm text-muted-foreground leading-snug truncate">{kennel.email}</p>
                )}
                {kennel.website && (
                  <p className="text-sm text-muted-foreground leading-snug truncate">{kennel.website}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


