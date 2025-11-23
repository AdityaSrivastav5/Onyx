"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useKeyboardShortcuts() {
    const router = useRouter();
    const pathname = usePathname();
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Command Palette: Cmd+K or Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsCommandPaletteOpen(true);
                return;
            }

            // Only allow single-key shortcuts when not in input fields
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            // Navigation shortcuts (single keys)
            switch (e.key.toLowerCase()) {
                case "d":
                    router.push("/dashboard");
                    break;
                case "t":
                    router.push("/dashboard/tasks");
                    break;
                case "h":
                    router.push("/dashboard/habits");
                    break;
                case "z":
                    router.push("/dashboard/zen");
                    break;
                case "c":
                    router.push("/dashboard/calendar");
                    break;
                case "n":
                    router.push("/dashboard/notes");
                    break;
                case "e":
                    router.push("/dashboard/expenses");
                    break;
                case "s":
                    if (e.shiftKey) {
                        router.push("/dashboard/settings");
                    }
                    break;
                case "?":
                    // Show keyboard shortcuts help
                    setIsCommandPaletteOpen(true);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router, pathname]);

    return { isCommandPaletteOpen, setIsCommandPaletteOpen };
}
