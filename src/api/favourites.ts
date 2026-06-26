import { apiClient } from './client';
import type { ApiHomesteadCard, MessageResponse } from './types';

const FAVOURITES_PATH = '/api/v1/favourites';

export async function listFavourites(): Promise<ApiHomesteadCard[]> {
  const { data } = await apiClient.get<ApiHomesteadCard[]>(FAVOURITES_PATH);
  return data;
}

export async function addFavourite(
  homesteadId: number,
): Promise<MessageResponse> {
  const { data } = await apiClient.post<MessageResponse>(
    `${FAVOURITES_PATH}/${homesteadId}`,
  );
  return data;
}

export async function removeFavourite(
  homesteadId: number,
): Promise<MessageResponse> {
  const { data } = await apiClient.delete<MessageResponse>(
    `${FAVOURITES_PATH}/${homesteadId}`,
  );
  return data;
}
