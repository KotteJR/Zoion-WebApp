import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      {/* Zoion Logo at the top */}
      <div className="mb-12">
        <Image 
          src="/assets/images/png/zoionplatform.png" 
          alt="Zoion" 
          width={120} 
          height={40}
          className="h-10 w-auto"
        />
      </div>

      {/* Loading Content */}
      <div className="text-center space-y-8 max-w-md">
        <h1 className="text-xl font-semibold text-gray-900">Processing your request</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          Please wait while we process your request. Do not refresh the page.
        </p>
        <div className="flex justify-center pt-6">
          <div className="w-8 h-8">
            <Spinner />
          </div>
        </div>
      </div>
    </div>
  );
}
