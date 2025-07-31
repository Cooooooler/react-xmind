import { post, get } from '@/utils/request';
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
