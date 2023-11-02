import { request } from '@umijs/max';

export async function fetchGetUserInfo(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/v1/user/current_user_info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** auth登录后的回调地址 get /api/v1/auth/login_callback */
export async function fetchLoginCallback(code: string) {
  const params = { code };
  return request<API.FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
