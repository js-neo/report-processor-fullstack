// packages/client/tailwind.config.ts

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
            },
            animation: {
                'error-pulse': 'error-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) 2'
            },
            keyframes: {
                'error-pulse': {
                    '0%, 100%': {
                        'border-color': 'rgb(239 68 68)', // red-500
                        'box-shadow': '0 0 0 0 rgb(239 68 68 / 45%)'
                    },
                    '50%': {
                        'border-color': 'rgb(185 28 28)', // red-700
                        'box-shadow': '0 0 0 4px rgb(239 68 68 / 10%)'
                    }
                }
            }
        },
    },
    plugins: [],
} satisfies Config;