import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: "default" | "outline" | "ghost" | "link"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", ...props }, ref) => {
        const variants = {
            default: "bg-gray-900 text-white hover:bg-gray-800",
            outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900",
            ghost: "hover:bg-gray-100 text-gray-900",
            link: "text-gray-900 underline-offset-4 hover:underline",
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2",
                    variants[variant],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
