import { apiClient } from './client';
import type {
  ListHomesteadsParams,
  PaginatedHomesteadsResponse,
} from './types';

const HOMESTEADS_PATH = '/api/v1/homesteads';

function buildHomesteadsQuery(params: ListHomesteadsParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== null && value !== undefined,
    ),
  );
}

export async function listHomesteads(
  params: ListHomesteadsParams = {},
): Promise<PaginatedHomesteadsResponse> {
  const { data } = await apiClient.get<PaginatedHomesteadsResponse>(
    HOMESTEADS_PATH,
    {
      params: buildHomesteadsQuery(params),
    },
  );

  return data;
}

export async function getHomestead(homesteadId: number) {
  const { data } = await apiClient.get(`/api/v1/homesteads/${homesteadId}`);
  return data;
}
