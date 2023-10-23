import type { AxiosResponse, RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';

// 与后端约定的响应数据格式
interface ResponseStructure {
  data: any;
  code: number;
  message: string;
  timestamps: number;
}

const FETCH_SUCCESS_CODES = [200, 201, 204];
const FETCH_NEED_LOGIN = [2]
// const

function fetchSuccess(code: number) {
  return FETCH_SUCCESS_CODES.includes(code);
}

function fetchNeedLogin(code: number) {
  return FETCH_NEED_LOGIN.includes(code);
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
      const url = config?.url?.concat('?token = 123');
      return { ...config, url };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: AxiosResponse<ResponseStructure, any>) => {
      // 拦截响应数据，进行个性化处理
      // const { data, status } = response.data as unknown as ResponseStructure;
      const { data, status } = response;
      console.log('response', response);
      if(fetchSuccess(status)) {
        return data
      }

      return {
        data: null
      };
    },
  ],
};
