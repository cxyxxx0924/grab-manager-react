// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取抓取资源 GET /api/v1/resource/search_resource */
export async function fetchSearchResource(
  search: RCC_API.FormSearchModal,
  pagination: RCC_API.PaginationModal,
) {
  const params = { ...search, ...pagination };
  return request<RCC_API.RccPagination<RCC_API.ManagerItemModal>>(
    '/api/v1/resource/search_resource',
    {
      method: 'GET',
      params,
    },
  );
}
