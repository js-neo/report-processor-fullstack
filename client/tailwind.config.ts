import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "../shared/**/*.ts"
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background) / <alpha-value>)",
                foreground: "rgb(var(--foreground) / <alpha-value>)"
            },
            fontFamily: {
                sans: ["Arial", "Helvetica", "sans-serif"]
            }
        },
    },
    plugins: [],
} satisfies Config;