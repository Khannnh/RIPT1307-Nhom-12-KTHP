import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { registerUser } from '@/services/user';

const { Title, Text } = Typography;

const Register: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      message.success('Đăng ký thành công!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err?.data?.message || 'Đăng ký thất bại!');
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      maxWidth: 450,
      margin: '40px auto',
      padding: 32,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    }}>
      <Title level={2} style={{ textAlign: 'center' }}>Đăng kí</Title>
      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
       Đăng kí tài khoản của bạn tại đây
      </Text>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input prefix={<UserOutlined />} placeholder="ex: NN Linh" size="large" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
          <Input prefix={<MailOutlined />} placeholder="ex: abc@gmail.com" size="large" />
        </Form.Item>
        <Form.Item label="password" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="ex:123" size="large" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ background: '#FF3B00', border: 'none', borderRadius: 24, marginTop: 8 }}>
            Đăng ký
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <Text>Already have an account? </Text>
          <a onClick={onSuccess}>Sign in</a>
        </div>
      </Form>
    </div>
  );
};

export default Register;
