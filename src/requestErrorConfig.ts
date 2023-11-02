import type { AxiosResponse, RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import cookie from 'react-cookies';

// 与后端约定的响应数据格式
interface ResponseStructure {
  data?: any;
  code: number;
  message: string;
}

const FETCH_SUCCESS_CODES = [200, 201, 204];
const FETCH_NEED_LOGIN = [2];
// const

function fetchSuccess(code: number) {
  return FETCH_SUCCESS_CODES.includes(code);
}

function fetchRequestSuccess(data: ResponseStructure) {
  if (data.code === 10000) {
    return true;
  }
  return false;
}

function fetchNeedLogin(status: number, data: any) {
  if (fetchSuccess(status) && FETCH_NEED_LOGIN.includes(data.code)) {
    return true;
  }
  return false;
}

function getSessions() {
  return cookie.load('_dev_grab_manager_session') || '';
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      config.headers = {
        'Grab-Manager-Authorization': getSessions(),
      };
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: AxiosResponse) => {
      // 拦截响应数据，进行个性化处理
      // const { data, status } = response.data as unknown as ResponseStructure;
      const { status } = response;
      const { data } = response.data as unknown as ResponseStructure;
      if (fetchNeedLogin(status, data)) {
        window.location.href = data.path;
      } else if (!fetchRequestSuccess(response.data)) {
        return Promise.reject(data);
      } else {
        return response.data;
      }
    },
  ],
};
