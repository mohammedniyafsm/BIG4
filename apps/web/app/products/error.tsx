"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 bg-background">
      <div className="bg-muted/50 p-8 rounded-[var(--radius-lg)] max-w-md w-full text-center border border-border">
        <h2 className="text-2xl font-bold font-heading mb-4 text-destructive">Something went wrong!</h2>
        <p className="text-muted-foreground mb-8">
          We couldn't load the products at this time. Please try again.
        </p>
        <Button onClick={() => reset()} className="w-full">
          Try again
        </Button>
      </div>
    </div>
  );
}
