import React, { useState } from 'react';
import { message } from 'antd';
import { history, useDispatch } from 'umi';
import LoginForm from '@/components/AuthForm/LoginForm';

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
      // Sử dụng phương thức loginUnified từ model user
      const response = await dispatch({
        type: 'user/loginUnified',
        payload: values,
      }) as LoginResponse;

      if (response?.role === 'admin') {
        message.success('Đăng nhập thành công với quyền Admin!');
        history.push('/admin/devices');
      } else {
        message.success('Đăng nhập thành công!');
        history.push('/user/devices');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err?.message || 'Tài khoản hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm loading={loading} onFinish={onFinish} />;
};

export default Login;
