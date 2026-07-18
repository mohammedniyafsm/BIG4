"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecRow {
  label: string;
  value: string;
}

interface ProductSpecsAccordionProps {
  specs: SpecRow[];
}

export function ProductSpecsAccordion({ specs }: ProductSpecsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-12 border border-border/50 rounded-xl overflow-hidden bg-background">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-muted/5 hover:bg-muted/10 transition-colors"
      >
        <span className="text-xl font-semibold">Specifications</span>
        <ChevronDown
          className={cn("w-5 h-5 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>
      
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <dl className="divide-y divide-border/50 border-t border-border/50">
            {specs.map((spec, index) => (
              <div 
                key={spec.label} 
                className={cn(
                  "flex justify-between p-4",
                  index % 2 === 0 ? "bg-muted/10" : "bg-transparent"
                )}
              >
                <dt className="font-medium text-muted-foreground">{spec.label}</dt>
                <dd className="font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
