import { extend } from 'umi-request';
import { message } from 'antd';

// 与后端约定的响应数据格式
export interface ResponseStructure {
  code: number;
  message: string;
  data: any;
}

// 配置request请求时的默认参数
const request = extend({
  prefix: '/api', // 默认请求前缀
  timeout: 5000, // 超时时间
  headers: {
    'Content-Type': 'application/json',
  },
  errorHandler: (error: any) => {
    if (error.response) {
      // 请求已发送但服务端返回状态码非2xx的响应
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.data);
      console.log(error.request);
      message.error(`请求错误 ${error.response.status}: ${error.data.message}`);
    } else {
      // 请求初始化时出错或者没有响应返回的异常
      console.log(error.message);
      message.error('网络异常，请稍后重试');
    }
    throw error; // 如果throw. 错误将继续抛出.
  },
});

// 请求拦截器
request.interceptors.request.use((url, options) => {
  // 获取token
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    // 如果有token，带上token
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return {
    url,
    options: { ...options, headers },
  };
});

// 响应拦截器
request.interceptors.response.use(async (response) => {
  const res = await response?.clone()?.json();
  if (res && res.code !== 0) {
    // 业务错误处理
    message.error(res.message || '请求失败');
  }
  return res.data || res;
});

// 导出通用请求方法
export const get = <T = any>(url: string, params?: object) => {
  return request<T>(url, { method: 'GET', params });
};

export const post = <T = any>(url: string, data?: object) => {
  return request<T>(url, { method: 'POST', data });
};

export const put = <T = any>(url: string, data?: object) => {
  return request<T>(url, { method: 'PUT', data });
};

export const del = <T = any>(url: string, data?: object) => {
  return request<T>(url, { method: 'DELETE', data });
};

export default request;
