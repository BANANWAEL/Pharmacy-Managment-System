import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the types of buttons we have
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", loading, children, ...props }, ref) => {
    
    // 1. Base Styles (Applied to all buttons)
    const baseStyles = "inline-flex items-center justify-center rounded-md text-1xl font-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mintgreen disabled:pointer-events-none disabled:opacity-50";
    
    // 2. Variants (Your specific design system)
    const variants = {
      primary: "bg-mintgreen text-white hover:bg-mintgreen/90 shadow-sm",
      outline: "border border-secondary bg-background hover:bg-secondary hover:text-primary-text",
      ghost: "hover:bg-secondary hover:text-primary-text",
      link: "text-mintgreen underline-offset-4 hover:underline",
    };

    // 3. Sizes
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {/* Automatically show spinner if loading */}
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };