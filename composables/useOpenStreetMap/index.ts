import type { Geo } from './types';
import useOpenStreetMapApi from './hooks';


export function useOpenStreetMap() {
  const {
    GET_CITY_BY_GEO,
    SEARCH_CITY,
    SEARCH_CITIES,
  } = useOpenStreetMapApi();

  const getCityByGeo = async (params: Geo) => await GET_CITY_BY_GEO(params);

  const searchCity = async (query: string) => await SEARCH_CITY(query);

  const searchCities = async (query: string) => await SEARCH_CITIES(query);

  return {
    getCityByGeo,
    searchCity,
    searchCities,
  };
}
