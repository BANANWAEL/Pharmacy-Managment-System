import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          
"flex h-[50px] w-full max-w-[435px] rounded-md border border-secondary shadow-md  px-3  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-darkgray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mintgreen disabled:cursor-not-allowed disabled:opacity-50",className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
