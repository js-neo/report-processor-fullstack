import {useEffect, useState} from "react";
import {IObject} from "shared";
import {objectService} from "@/services/objectService";


export const useObjects = () => {
    const [objects, setObjects] = useState<IObject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await objectService.getObjects();
                setObjects(response.allObjects);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message || 'Ошибка загрузки данных');
                } else {
                    setError('Ошибка загрузки данных');
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { objects, loading, error };
};