import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Avatar, Typography, List, Button, Space, Divider } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  LogoutOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import { history } from 'umi';

const { Title, Text } = Typography;

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
  const handleLogout = () => {
    // Call logout API
    history.push('/user/login');
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

  return (
    <PageContainer>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={120} src={userData.avatar} />
          <Title level={3} style={{ marginTop: 16 }}>{userData.name}</Title>
          <Text type="secondary">{userData.role}</Text>
        </div>

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
              <Text>{userData.email}</Text>
            </Space>
          </Card>
          <Card size="small">
            <Space>
              <PhoneOutlined />
              <Text>{userData.phone}</Text>
            </Space>
          </Card>
          <Card size="small">
            <Space>
              <UserOutlined />
              <Text>{userData.department}</Text>
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
    </PageContainer>
  );
};

export default ProfilePage; 