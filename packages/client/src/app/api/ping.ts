// packages/client/src/app/api/ping.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        const response = await fetch('https://report-processor-fullstack.onrender.com/health');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        console.log('✅ Ping successful:', await response.json());
        res.status(200).end();
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ Ping failed:', error.message);
            res.status(500).end();
        }
    }
};