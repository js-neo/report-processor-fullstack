// packages/server/src/services/objectService.ts
import { Types } from 'mongoose';
import Object from '../models/Object.js';
import { generateBaseId, getUniqueId } from 'shared';
import axios from 'axios';

export interface IObjectCreateParams {
    name: string;
    address: string;
    coordinates?: string;
}

export interface IObjectResponse {
    _id: Types.ObjectId;
    objectId: string;
    name: string;
    address: string;
    coordinates: string;
    created_at: Date;
}

async function geocodeAddress(address: string): Promise<string> {
    try {
        const apiKey = process.env.YANDEX_MAPS_API_KEY;
        if (!apiKey) {
            console.log('Yandex Maps API key is not configured - returning empty coordinates');
            return '';
        }

        const response = await axios.get(
            `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&format=json&geocode=${encodeURIComponent(address)}`
        );

        const featureMember = response.data.response.GeoObjectCollection.featureMember;
        if (!featureMember || featureMember.length === 0) {
            console.log('Address not found in Yandex Maps - returning empty coordinates');
            return '';
        }

        const pos = featureMember[0].GeoObject.Point.pos;
        const [lon, lat] = pos.split(' ');
        return `${lat},${lon}`;
    } catch (error) {
        console.error('Geocoding error:', error);
        return '';
    }
}

export const getAllObjects = async (): Promise<IObjectResponse[]> => {
    const objects = await Object.find().lean();
    return objects.map(obj => ({
        _id: obj._id,
        objectId: obj.objectId,
        name: obj.name,
        address: obj.address,
        coordinates: obj.coordinates || "",
        created_at: obj.created_at
    }));
};

export const createObject = async (params: IObjectCreateParams): Promise<IObjectResponse> => {
    const { name, address } = params;

    const baseId = generateBaseId(name);
    const objectId = await getUniqueId(baseId, Object, "objectId");

    const coordinates = params.coordinates || await geocodeAddress(address);

    const newObject = new Object({
        objectId,
        name,
        address,
        coordinates
    });

    await newObject.save();

    return {
        _id: newObject._id,
        objectId: newObject.objectId,
        name: newObject.name,
        address: newObject.address,
        coordinates: newObject.coordinates || "",
        created_at: newObject.created_at
    };
};