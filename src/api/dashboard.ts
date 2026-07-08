import { apiClient } from './client';
import type { DashboardResponse } from './types';

const DASHBOARD_PATH = '/api/v1/dashboard';

export async function getDashboard(): Promise<DashboardResponse> {
  const { data } = await apiClient.get<DashboardResponse>(DASHBOARD_PATH);
  return data;
}
