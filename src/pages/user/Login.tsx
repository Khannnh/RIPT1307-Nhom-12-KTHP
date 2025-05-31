import React, { useState } from 'react';
import { message } from 'antd';
import { history, useDispatch } from 'umi';
import LoginForm from '@/components/AuthForm/LoginForm';

const Login: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await dispatch({
        type: 'user/login',
        payload: values,
      });
      message.success('Đăng nhập thành công!');
      if (onSuccess) onSuccess();
      history.push('/');
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!');
    }
    setLoading(false);
  };

  return <LoginForm loading={loading} onFinish={onFinish} />;
};

export default Login;
