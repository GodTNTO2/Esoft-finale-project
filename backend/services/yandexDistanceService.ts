import axios from 'axios';
import { injectable, inject } from 'inversify';
import { TYPES } from '../inversify/types';
import { ConfigService } from './ConfigService';

interface Coordinates {
  lon: number
  lat: number
}

interface DistanceResult {
  distance: number
  origin: Coordinates;
  destination: Coordinates;
}


@injectable()
export class YandexDistanceService {
    private readonly GEOCODE_URL = 'https://geocode-maps.yandex.ru/1.x'
    private readonly DISTANCE_URL = 'https://api.routing.yandex.net/v2/distancematrix'
    private cache = new Map<string, Promise<Coordinates>>()
    private apiKey: string
    private cacheEnabled = true;

    constructor(
        @inject(TYPES.ConfigService) private configService: ConfigService
    ) {
        this.apiKey = this.configService.get('YANDEX_MAPS_API_KEY')
    }

    public async calculateDistance(
        originAddress: string,
        destinationAddress: string
    ): Promise<DistanceResult> {
        try {
            const [origin, destination] = await Promise.all([
                this.geocodeAddress(originAddress),
                this.geocodeAddress(destinationAddress)
            ]);

            const { distance } = await this.calculateYandexDistance(
                origin,
                destination
            );

            return {
                distance,
                origin,
                destination
        }
        } catch (error) {
            throw new Error(`Failed to calculate distance: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private async geocodeAddress(address: string): Promise<Coordinates> {
        if (this.cacheEnabled && this.cache.has(address)) {
            return this.cache.get(address)!
        }

        const geocodePromise = this.fetchGeocode(address)

        if (this.cacheEnabled) {
            this.cache.set(address, geocodePromise)
        }

        return geocodePromise
    }

    private async fetchGeocode(address: string): Promise<Coordinates> {
        const response = await axios.get(this.GEOCODE_URL, {
            params: {
                geocode: address,
                apikey: this.apiKey,
                format: 'json'
            }
        })

        const featureMember = response.data.response.GeoObjectCollection.featureMember;
        if (!featureMember || featureMember.length === 0) {
            throw new Error('Address not found')
        }

        const [lon, lat] = featureMember[0].GeoObject.Point.pos
        .split(' ')
        .map(parseFloat)

        return { lon, lat }
    }

    private async calculateYandexDistance(
        origin: Coordinates,
        destination: Coordinates
    ): Promise<{ distance: number; duration: number }> {
        const response = await axios.get(this.DISTANCE_URL, {
        params: {
            origins: `${origin.lat},${origin.lon}`,
            destinations: `${destination.lon},${destination.lon}`,
            apikey: this.apiKey
        }
        })

        if (response.data.rows[0].elements[0].status !== 'OK') {
            throw new Error('Distance calculation failed')
        }

        return {
            distance: response.data.rows[0].elements[0].distance.value,
            duration: response.data.rows[0].elements[0].duration.value
        }
    }
}