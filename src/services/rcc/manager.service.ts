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
/**
 * @Author: draven.chen draven.chen@rccchina.com
 * @description: 创建抓取资源
 * @param {RCC_API} createForm
 * @return {*}
 */
export async function fetchCreateResource(createForm: RCC_API.ManagerItemModal) {
  return request('/api/v1/resource/create_resource', {
    method: 'post',
    data: {
      ...createForm,
    },
  });
}
/**
 * @Author: draven.chen draven.chen@rccchina.com
 * @description: 更新抓取资源信息
 * @param {RCC_API} updateForm
 * @return {*}
 */
export async function fetchUpdateResource(updateForm: RCC_API.ManagerItemModal) {
  return request('/api/v1/resource/update_resource', {
    method: 'post',
    data: {
      ...updateForm,
    },
  });
}
