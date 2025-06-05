import React, { useState } from 'react';
import { message, Button } from 'antd';
import { history, useDispatch } from 'umi';
import LoginForm from '@/components/AuthForm/LoginForm';
import { request } from 'umi';

interface LoginResponse {
  role?: string;
  access_token?: string;
  [key: string]: any;
}

const Login: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Thử đăng nhập với tư cách admin trước
      try {
        const adminResponse = await request('/admin/login', {
          method: 'POST',
          data: {
            phone: values.username,
            password: values.password,
          },
        });

        if (adminResponse?.access_token) {
          // Lưu token admin
          localStorage.setItem('admin_token', adminResponse.access_token);
          message.success('Đăng nhập thành công với quyền Admin!');
          history.push('/admin/devices');
          if (onSuccess) onSuccess();
          return;
        }
      } catch (adminError) {
        // Nếu đăng nhập admin thất bại, thử đăng nhập user thường
        const response = await dispatch({
          type: 'user/login',
          payload: values,
        }) as LoginResponse;

        const userRole = response?.role;
        if (userRole === 'admin') {
          message.success('Đăng nhập thành công với quyền Admin!');
          history.push('/admin/devices');
        } else {
          message.success('Đăng nhập thành công!');
          history.push('/user/devices');
        }

        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!');
    }
    setLoading(false);
  };

  return <LoginForm loading={loading} onFinish={onFinish} />;
};

export default Login;
