import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Card, Avatar, Typography, List, Button, Space, Divider, Descriptions, Row, Col, Spin, message, Input, DatePicker, Select, Form } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LogoutOutlined,
  SettingOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { history, useModel } from 'umi';
import { logoutUser, getUserProfile, updateUserProfile } from '@/services/user';
import dayjs from 'dayjs';
// import styles from './index.less';

const { Title, Text } = Typography;
const { Content } = Layout;

// Mock user data
const userData = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0123 456 789',
  role: 'Sinh viên',
  department: 'Khoa Công nghệ thông tin',
  avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
};

const ProfilePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      console.log('API Response:', response); // Debug log
      // Handle different response structures
      if (response?.data?.data) {
        setUserData(response.data.data);
      } else if (response?.data) {
        setUserData(response.data);
      } else if (response) {
        setUserData(response);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      message.error('Không thể tải thông tin người dùng');
      // Set empty object to prevent map errors
      setUserData({});
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || '',
      dob: userData?.dob ? dayjs(userData.dob) : null,
      gender: userData?.gender || '',
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updateData = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined,
      };

      const response = await updateUserProfile(updateData);
      if (response) {
        message.success('Cập nhật thông tin thành công');
        setUserData({ ...userData, ...updateData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      message.error('Không thể cập nhật thông tin');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const menuItems = [
    {
      title: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      description: 'Xem và cập nhật thông tin cá nhân',
    },
    {
      title: 'Đổi mật khẩu',
      icon: <SettingOutlined />,
      description: 'Thay đổi mật khẩu tài khoản',
    },
    {
      title: 'Cài đặt thông báo',
      icon: <SettingOutlined />,
      description: 'Quản lý cài đặt thông báo',
    },
  ];

  if (loading) {
    return (
      <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
          <Spin size="large" />
        </div>
      </Content>
    );
  }

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={100} src={userData?.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} />
              <Title level={3} style={{ marginTop: 16 }}>{userData?.name || 'Chưa cập nhật'}</Title>
              <Text type="secondary">Sinh viên</Text>
            </div>

            <Space style={{ width: '100%', justifyContent: 'center' }}>
              {!isEditing ? (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  Chỉnh sửa thông tin
                </Button>
              ) : (
                <Space>
                  <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                    Lưu
                  </Button>
                  <Button icon={<CloseOutlined />} onClick={handleCancel}>
                    Hủy
                  </Button>
                </Space>
              )}
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Thông tin cá nhân">
            {!isEditing ? (
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Họ và tên">
                  {userData?.name || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {userData?.email || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {userData?.phone || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {userData?.address || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {userData?.dob ? new Date(userData.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {userData?.gender || 'Chưa cập nhật'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Form form={form} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Số điện thoại" name="phone">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Giới tính" name="gender">
                      <Select placeholder="Chọn giới tính">
                        <Select.Option value="Nam">Nam</Select.Option>
                        <Select.Option value="Nữ">Nữ</Select.Option>
                        <Select.Option value="Khác">Khác</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Ngày sinh" name="dob">
                      <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Địa chỉ" name="address">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )}
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Thống kê hoạt động">
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>0</div>
                  <div>Thiết bị đang mượn</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>0</div>
                  <div>Lần mượn thành công</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>0</div>
                  <div>Lần trả muộn</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Divider />
            <List
              itemLayout="horizontal"
              dataSource={menuItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Card size="small">
                <Space>
                  <MailOutlined />
                  <Text>{userData?.email || 'Chưa cập nhật'}</Text>
                </Space>
              </Card>
              <Card size="small">
                <Space>
                  <PhoneOutlined />
                  <Text>{userData?.phone || 'Chưa cập nhật'}</Text>
                </Space>
              </Card>
              <Card size="small">
                <Space>
                  <UserOutlined />
                  <Text>Khoa Công nghệ thông tin</Text>
                </Space>
              </Card>
            </Space>

            <Divider />

            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
            >
              Đăng xuất
            </Button>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default ProfilePage;
