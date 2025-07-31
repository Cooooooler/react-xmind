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
  // 将data转换为json字符串
  const data = JSON.stringify(params.data);
  return post<CreateMindMapResult>('/mindmap/create', {
    ...params,
    data,
  });
}

export async function getMindMapList(params?: { title?: string }) {
  const res = await get<GetMindMapListResult>('/mindmap/list', params);
  res.list.forEach((element) => {
    element.data = JSON.parse(element.data as unknown as string);
  });
  return res;
}
