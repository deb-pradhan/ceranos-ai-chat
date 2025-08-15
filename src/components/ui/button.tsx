import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-accent-blue text-white rounded-lg shadow-sm hover:bg-accent-blue-subtle hover:shadow-md active:shadow-sm",
        destructive:
          "bg-state-negative text-white rounded-lg shadow-sm hover:bg-state-negative/90 hover:shadow-md active:shadow-sm",
        outline:
          "border border-border-line bg-bg-base rounded-lg text-text-primary hover:bg-bg-panel hover:border-border-subtle hover:shadow-sm active:shadow-none",
        secondary:
          "bg-bg-panel text-text-primary rounded-lg shadow-sm hover:bg-bg-elevated hover:shadow-md active:shadow-sm",
        ghost: "rounded-lg text-text-secondary hover:bg-bg-panel hover:text-text-primary",
        link: "text-accent-blue underline-offset-4 hover:underline hover:text-accent-blue-subtle",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-lg",
        sm: "h-8 px-3 py-1.5 rounded-md text-xs",
        lg: "h-12 px-6 py-3 rounded-xl text-base",
        icon: "h-10 w-10 rounded-lg",
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
