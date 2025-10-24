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
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Fetching the good boys & girls...</EmptyTitle>
        <EmptyDescription>
          Hold tight! We're rounding up the pack for you.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}


