import { request } from 'umi';

export async function registerUser(data: { name: string; email: string; password: string }) {
  return request('/api/register', {
    method: 'POST',
    data,
  });
}

export async function loginUser(data: { email: string; password: string }) {
  return request('/api/login', {
    method: 'POST',
    data,
  });
}
