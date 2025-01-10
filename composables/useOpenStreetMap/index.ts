import type { Geo } from './types';
import useOpenStreetMapApi from './hooks';


export function useOpenStreetMap() {
  const {
    GET_CITY_BY_GEO,
    SEARCH_CITY,
  } = useOpenStreetMapApi();

  const getCityByGeo = async (params: Geo) => GET_CITY_BY_GEO(params);

  const searchCity = async (query: string) => SEARCH_CITY(query);

  return {
    getCityByGeo,
    searchCity,
  };
}
