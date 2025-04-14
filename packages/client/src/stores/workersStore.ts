// packages/client/src/stores/workersStore.ts

import { create } from 'zustand';
import { IWorker } from 'shared';
import {workerAPI} from "@/lib/api";


interface WorkersState {
    workers: IWorker[];
    loading: boolean;
    error: string | null;
    loadWorkers: () => Promise<void>;
}

export const useWorkersStore = create<WorkersState>((set) => ({
    workers: [],
    loading: false,
    error: null,
    loadWorkers: async () => {
        set({ loading: true, error: null });
        try {
            const response = await workerAPI.getAllWorkers();
            set({ workers: response.data, loading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Ошибка',
                loading: false
            });
        }
    }
}));