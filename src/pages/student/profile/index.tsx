import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Avatar,
  Typography,
  Divider,
  Space,
  Statistic
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EditOutlined,
  SaveOutlined,
  HistoryOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useModel } from 'umi';
import styles from './index.less';

const { Title, Text } = Typography;

const StudentProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { initialState, refresh } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        studentId: currentUser.studentId,
      });
    }
  }, [currentUser, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      // TODO: Call API to update user profile
      // await updateProfile(values);
      message.success('Cập nhật thông tin thành công');
      setEditing(false);
      // Refresh user data
      await refresh();
    } catch (error) {
      message.error('Cập nhật thông tin thất bại');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Tổng số lần mượn',
      value: 12,
      icon: <HistoryOutlined />,
    },
    {
      title: 'Đang mượn',
      value: 2,
      icon: <ClockCircleOutlined />,
    },
  ];

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]}>
        {/* Profile Information */}
        <Col xs={24} md={16}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Thông tin cá nhân</span>
              </Space>
            }
            extra={
              <Button
                type={editing ? 'primary' : 'default'}
                icon={editing ? <SaveOutlined /> : <EditOutlined />}
                onClick={() => {
                  if (editing) {
                    form.submit();
                  } else {
                    setEditing(true);
                  }
                }}
                loading={loading}
              >
                {editing ? 'Lưu' : 'Chỉnh sửa'}
              </Button>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={!editing}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                  >
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="studentId"
                    label="Mã sinh viên"
                    rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
                  >
                    <Input prefix={<IdcardOutlined />} disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* Profile Stats */}
        <Col xs={24} md={8}>
          <Card className={styles.statsCard}>
            <div className={styles.avatarContainer}>
              <Avatar size={100} icon={<UserOutlined />} />
              <Title level={4} className={styles.userName}>
                {currentUser?.name}
              </Title>
              <Text type="secondary">{currentUser?.email}</Text>
            </div>
            <Divider />
            <Row gutter={[16, 16]}>
              {stats.map((stat, index) => (
                <Col span={12} key={index}>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentProfile;
