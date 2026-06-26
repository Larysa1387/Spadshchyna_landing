import { apiClient } from './client';
import type { RegionResponse } from './types';

const REGIONS_PATH = '/api/v1/regions';

export async function listRegions(): Promise<RegionResponse[]> {
  const { data } = await apiClient.get<RegionResponse[]>(REGIONS_PATH);
  return data;
}
