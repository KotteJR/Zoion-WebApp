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
          <Spinner className="text-white" />
        </EmptyMedia>
        <EmptyTitle className="text-white">Fetching the good boys & girls...</EmptyTitle>
        <EmptyDescription className="text-white/80">
          Hold tight! We're rounding up the pack for you.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}


