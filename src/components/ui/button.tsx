import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-accent-blue text-white rounded-xl shadow-sm hover:bg-accent-blue-subtle hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 text-hierarchy-primary",
        destructive:
          "bg-state-negative text-white rounded-xl shadow-sm hover:bg-state-negative/90 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 text-hierarchy-primary",
        outline:
          "border border-border-line bg-bg-base/50 backdrop-blur-sm rounded-xl text-text-primary hover:bg-bg-panel/80 hover:border-border-subtle hover:shadow-md hover:scale-[1.01] active:scale-98 transition-all duration-200 text-hierarchy-secondary",
        secondary:
          "bg-bg-panel/80 backdrop-blur-sm text-text-primary rounded-xl shadow-sm hover:bg-bg-elevated/90 hover:shadow-md hover:scale-[1.01] active:scale-98 transition-all duration-200 text-hierarchy-secondary",
        ghost: "rounded-xl text-text-secondary hover:bg-bg-panel/60 hover:text-text-primary hover:scale-[1.01] active:scale-98 transition-all duration-200 backdrop-blur-sm text-hierarchy-secondary",
        link: "text-accent-blue underline-offset-4 hover:underline hover:text-accent-blue-subtle transition-all duration-200 text-hierarchy-secondary",
      },
      size: {
        default: "h-11 px-5 py-2.5 text-sm font-medium letter-spacing-tight",
        sm: "h-8 px-3.5 py-2 text-xs font-medium",
        lg: "h-14 px-7 py-4 text-base font-semibold letter-spacing-tight",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
