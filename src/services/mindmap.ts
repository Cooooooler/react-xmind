import { post, get, del, put } from '@/utils/request';
import type { MindElixirData } from 'mind-elixir';

export interface MindMap {
  id: string;
  title: string;
  data: MindElixirData;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMindMapParams {
  data: MindElixirData;
  title: string;
}

export interface CreateMindMapResult {
  id: string;
}

export interface GetMindMapListResult {
  list: MindMap[];
  total: number;
}

export async function createMindMap(params: CreateMindMapParams) {
  return post<CreateMindMapResult>('/mindmap/create', params);
}

export async function getMindMapList(params?: { title?: string }) {
  return get<GetMindMapListResult>('/mindmap/list', params);
}

export async function deleteMindMap(id: string) {
  return del<{ success: boolean }>('/mindmap/delete', { id });
}

export async function updateMindMap(
  id: string,
  params: { data: MindElixirData; title: string },
) {
  return put<{ success: boolean }>('/mindmap/update', { id, ...params });
}
