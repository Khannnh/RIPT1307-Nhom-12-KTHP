import React from 'react';
import { Layout, Menu, Button, Avatar, Space, Typography } from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Link, useLocation, history } from 'umi';
import './BasicLayout.less';

const { Header, Content } = Layout;
const { Text } = Typography;

const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/dashboard">Trang chủ</Link>,
    },
    {
      key: '/devices',
      icon: <AppstoreOutlined />,
      label: <Link to="/devices">Quản lý thiết bị</Link>,
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: <Link to="/statistics">Thống kê</Link>,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    history.push('/user/login');
  };

  return (
    <Layout className="main-layout">
      <Header className="navbar">
        <div className="navbar__container">
          {/* Logo */}
          <div className="navbar__logo">
            <Link to="/dashboard" className="navbar__logo-link">
              <div className="navbar__logo-circle">
                <AppstoreOutlined className="navbar__logo-icon" />
              </div>
              <Text className="navbar__logo-text">
                DeviceHub
              </Text>
            </Link>
          </div>

          {/* Menu */}
          <div className="navbar__menu">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              className="navbar__menu-items"
            />
          </div>

          {/* User Actions */}
          <div className="navbar__actions">
            <Space>
              <Avatar size="small" icon={<UserOutlined />} />
              <Text className="navbar__user-name">
                {localStorage.getItem('userName') || 'User'}
              </Text>
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                className="navbar__logout-btn"
              />
            </Space>
          </div>
        </div>
      </Header>

      {/* Content */}
      <Content className="main-content">
        {children}
      </Content>
    </Layout>
  );
};

export default BasicLayout;
