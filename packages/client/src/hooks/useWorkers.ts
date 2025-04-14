// packages/client/src/hooks/useWorkers.ts

"use client"

import {useCallback, useEffect, useState} from "react";
import {IWorker} from "shared";
import {workerService} from "@/services/workerService";

export const useWorkers = (userObjectId?: string) => {
    console.log('useWorkers', userObjectId);
    const [workers, setWorkers] = useState<{
        allWorkers: IWorker[];
        assignedToThisObject: IWorker[];
        assignedToOtherObjects: IWorker[];
        unassigned: IWorker[];
    }>({allWorkers: [], assignedToThisObject: [], assignedToOtherObjects: [], unassigned: []});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        console.log('refresh');
        try {
            console.log('refresh_2');
            setLoading(true);
            const data = await workerService.getWorkers(userObjectId);
            console.log("data_useWorkers: ", data);
            setWorkers(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
        } finally {
            setLoading(false);
        }
    }, [userObjectId]);

    useEffect(() => {
        refresh()
    },[refresh]);

    // Назначение работника
    const assignWorker = async (workerId: string, userObjectId: string) => {
        console.log('assignWorker', userObjectId);
        console.log('assigned_workerId', workerId);
        if (!userObjectId) return;
        try {
            await workerService.assign(workerId, userObjectId);
            await refresh(); // Обновляем данные
        } catch (err) {
            throw err instanceof Error ? err : new Error('Ошибка назначения');
        }
    };

    // Открепление работника
    const unassignWorker = async (workerId: string) => {
        try {
            await workerService.unassign(workerId);
            await refresh();
        } catch (err) {
            throw err instanceof Error ? err : new Error('Ошибка открепления');
        }
    };

    return {
        workers,
        loading,
        error,
        refresh,
        assignWorker,
        unassignWorker,
    };
};