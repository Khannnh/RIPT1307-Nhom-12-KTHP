import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { registerUser } from '@/services/user';
import { history } from 'umi';

const { Title, Text } = Typography;

const Register: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: values.name,
        username: values.username,
        password: values.password,
      });
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      if (onSuccess) onSuccess();
      // Chuyển về trang đăng nhập sau khi đăng ký thành công
      history.push('/login');
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Đăng ký thất bại!');
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
        <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
          <Input prefix={<IdcardOutlined />} placeholder="ex: Nguyễn Văn A" size="large" />
        </Form.Item>
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
        <Form.Item label="Mật khẩu" name="password" rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' },
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
        ]}>
          <Input.Password prefix={<LockOutlined />} placeholder="ex:123" size="large" />
        </Form.Item>
        <Form.Item label="Xác nhận mật khẩu" name="confirmPassword" rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
            },
          }),
        ]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ background: '#FF3B00', border: 'none', borderRadius: 24, marginTop: 8 }}>
            Đăng ký
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <Text>Đã có tài khoản? </Text>
          <a onClick={() => history.push('/login')}>Đăng nhập</a>
        </div>
      </Form>
    </div>
  );
};

export default Register;
