import { getCityIdByName } from '~/constants/cities';


interface Response {
  address?: {
    city?: string;
    town?: string;
  };
  display_name?: string;
  lat?: string;
  lon?: string;
}

interface CityInfo {
  cityId: string | undefined;
  city: string;
  displayName: string;
  lat: number | null;
  lon: number | null;
}

export default function parseResponse(response: Response): CityInfo {
  const cityName = response.address?.city || '';
  const townName = response.address?.town || '';
  const name = cityName || townName;

  return {
    cityId: getCityIdByName(name),
    city: name,
    displayName: name || response.display_name || '',
    lat: response.lat ? parseFloat(response.lat) : null,
    lon: response.lon ? parseFloat(response.lon) : null,
  };
}
