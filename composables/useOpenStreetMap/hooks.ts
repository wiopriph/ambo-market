import type { Geo } from './types';
import parseGeoResponse from './parseGeoResponse';


export default function useOpenStreetMapApi() {
  const GET_CITY_BY_GEO = async (params: Geo) => {
    try {
      const response = await $fetch('https://nominatim.openstreetmap.org/reverse', {
        method: 'GET',
        params: {
          lat: params.latitude,
          lon: params.longitude,
          format: 'json',
          countrycodes: 'AO',
          'accept-language': 'en',
        },
      });

      return parseGeoResponse(response || {});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const SEARCH_CITY = async (query: string) => {
    try {
      const response = await $fetch('https://nominatim.openstreetmap.org/search', {
        method: 'GET',
        params: {
          q: query,
          format: 'json',
          addressdetails: 1,
          limit: 10,
          countrycodes: 'AO',
          'accept-language': 'en',
        },
      });

      let firstCity = null;

      if (Array.isArray(response)) {
        firstCity = response[0];
      }

      if (!firstCity) {
        throw new Error('City not found');
      }

      return parseGeoResponse(firstCity);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return {
    GET_CITY_BY_GEO,
    SEARCH_CITY,
  };
}
