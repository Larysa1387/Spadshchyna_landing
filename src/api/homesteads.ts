import { apiClient } from './client';
import type {
  CheckAvailabilityRequest,
  CheckAvailabilityResponse,
  HomesteadDetail,
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

export async function getHomestead(
  homesteadId: number,
): Promise<HomesteadDetail> {
  const { data } = await apiClient.get<HomesteadDetail>(
    `${HOMESTEADS_PATH}/${homesteadId}`,
  );
  return data;
}

export async function checkAvailability(
  homesteadId: number,
  payload: CheckAvailabilityRequest,
): Promise<CheckAvailabilityResponse> {
  const { data } = await apiClient.post<CheckAvailabilityResponse>(
    `${HOMESTEADS_PATH}/${homesteadId}/check-availability`,
    payload,
  );
  return data;
}
