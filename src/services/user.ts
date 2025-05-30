import axios from '@/utils/axios';

export async function registerUser(data: {
  name: string;
  username: string; // username có thể là email hoặc số điện thoại
  password: string
}) {
  return axios('http://localhost:3456/user/auth/register', {
    method: 'POST',
    data,
  });
}

export async function loginUser(data: { username: string; password: string }) {
  return axios('http://localhost:3456/user/auth/login', {
    method: 'POST',
    data,
  });
}

export async function logoutUser() {
  return axios('http://localhost:3456/user/auth/logout', {
    method: 'POST',
  });
}
