import type { Config } from "tailwindcss";

export default {
    darkMode: 'class',
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "../shared/**/*.{js,ts}"
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Arial", "Helvetica", "sans-serif"]
            }
        },
    },
    plugins: [],
} satisfies Config;