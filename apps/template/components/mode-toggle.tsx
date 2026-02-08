"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@stackpage/ui"

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => setMounted(true), [])

    if (!mounted) {
        return <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" disabled />
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
            className="h-9 w-9 rounded-full"
        >
            {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
