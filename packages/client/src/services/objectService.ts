import {objectAPI} from "@/lib/api";

export const objectService = {
    async getObjects() {
        const {data} = await objectAPI.fetchObjects();
        return {allObjects: data};
    },
    async createObject(objectData: {
        name: string;
        address: string;
    }) {
        return await objectAPI.createObject(objectData);
    }
}