"use client";

import * as React from "react";
import { Check } from "lucide-react"; // أيقونة "صح"
import { cn } from "@/lib/utils";

// مكون Checkbox مخصص يقبل الـ styling بتاعنا
const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative flex items-center">
      {/* الـ Input الحقيقي (مخفي بس شغال) */}
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "peer h-3 w-3 shrink-0 appearance-none rounded-sm border border-black shadow-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mintgreen checked:bg-mintgreen checked:border-mintgreen disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          className
        )}
        {...props}
      />
      {/* أيقونة "صح" بتظهر بس لما الـ Input يكون checked */}
      <Check className="absolute top-0.5 left-0.5 h-2 w-2 text-white hidden peer-checked:block pointer-events-none" />
    </div>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };