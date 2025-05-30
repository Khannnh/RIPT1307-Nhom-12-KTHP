import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '@/services/user';
import { history } from 'umi';

const { Title, Text } = Typography;

const Login: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await loginUser({ username: values.username, password: values.password });
      // Lưu token vào localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      message.success('Đăng nhập thành công!');
      if (onSuccess) onSuccess();
      // Chuyển hướng về trang chủ sau khi đăng nhập thành công
      history.push('/');
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!');
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      maxWidth: 400,
      margin: '40px auto',
      padding: 32,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    }}>
      <Title level={2} style={{ textAlign: 'center' }}>Đăng nhập</Title>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item label="Email hoặc số điện thoại" name="username" rules={[
          { required: true, message: 'Vui lòng nhập email hoặc số điện thoại!' },
          {
            validator: (_, value) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const phoneRegex = /^[0-9]{10}$/;
              if (emailRegex.test(value) || phoneRegex.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Vui lòng nhập email hoặc số điện thoại hợp lệ!'));
            }
          }
        ]}>
          <Input prefix={<UserOutlined />} placeholder="ex: example@gmail.com hoặc 0123456789" size="large" />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="ex:123" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ background: '#FF3B00', border: 'none', borderRadius: 24, marginTop: 8 }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
