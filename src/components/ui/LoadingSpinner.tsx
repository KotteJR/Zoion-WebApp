import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingSpinner() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Spinner className="text-gray-900" />
        </EmptyMedia>
        <EmptyTitle className="text-gray-900">Hämtar de snälla hundarna...</EmptyTitle>
        <EmptyDescription className="text-gray-600/90">
          Vänta lite! Vi samlar ihop flocken åt dig.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}


