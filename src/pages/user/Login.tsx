import React, { useState } from 'react';
import { message } from 'antd';
import { history, useDispatch } from 'umi';
import LoginForm from '@/components/AuthForm/LoginForm';

interface LoginResponse {
  role_ids?: string[];
  [key: string]: any;
}

const Login: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await dispatch({
        type: 'admin/login',
        payload: {
          email: values.username,
          password: values.password
        },
      }) as LoginResponse;

      // Kiểm tra role_ids từ response
      const roleIds = response?.role_ids || [];
      const isAdmin = roleIds.includes('6839fe6bccd38e4b214bca7f');

      if (isAdmin) {
        message.success('Đăng nhập thành công với quyền Admin!');
        history.push('/admin');
      } else {
        message.success('Đăng nhập thành công!');
        history.push('/');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!');
    }
    setLoading(false);
  };

  return <LoginForm loading={loading} onFinish={onFinish} />;
};

export default Login;
