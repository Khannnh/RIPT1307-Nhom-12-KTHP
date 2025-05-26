import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { loginUser } from '@/services/user';

const { Title, Text } = Typography;

const Login: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await loginUser({ email: values.email, password: values.password });
      message.success('Đăng nhập thành công!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err?.data?.message || 'Sai email hoặc mật khẩu!');
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
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
          <Input prefix={<MailOutlined />} placeholder="ex: abc@gmail.com" size="large" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
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
