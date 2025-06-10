import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Typography, Button, message, Drawer } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuOutlined, // Import icon cho nút mobile
} from '@ant-design/icons';
import { Link, useLocation, history } from 'umi';
import styles from './BasicLayout.less';
import { logoutUser } from '@/services/user';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const BasicLayout: React.FC = ({ children }) => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({
    name: localStorage.getItem('userName') || 'User',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  });

  // State để quản lý menu mobile
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Effect để theo dõi và cập nhật state khi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      message.success('Đăng xuất thành công');
      history.push('/user/auth/login');
    } catch (error) {
      message.error('Đăng xuất thất bại');
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Thông tin cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/profile">Cài đặt</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const navItems = [
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
      label: <Link to="/statistics">Lịch sử mượn trả</Link>,
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/dashboard">
            <img src="/logo.png" alt="Logo" />
            <span>Hệ thống mượn thiết bị</span>
          </Link>
        </div>

        {/* --- Phần Menu được render có điều kiện --- */}
        
        {/* Nếu không phải mobile, render menu ngang cho desktop */}
        {!isMobile && (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={navItems}
            className={styles.menu}
          />
        )}
        
        {/* --- Phần nội dung bên phải Header --- */}
        <div className={styles.userInfo}>
          <Dropdown overlay={userMenu} placement="bottomRight">
            <Space className={styles.userDropdown}>
              <Avatar src={currentUser.avatar} />
              {/* Chỉ hiển thị tên người dùng trên desktop */}
              {!isMobile && <Text style={{ color: 'white' }}>Xin chào, {currentUser.name}</Text>}
            </Space>
          </Dropdown>
        </div>

        {/* Nếu là mobile, render nút hamburger */}
        {isMobile && (
          <Button
            className={styles.mobileMenuButton}
            type="text"
            icon={<MenuOutlined style={{ color: 'white' }} />}
            onClick={() => setDrawerVisible(true)}
          />
        )}
      </Header>

      {/* Drawer cho menu mobile */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={() => setDrawerVisible(false)}
        />
      </Drawer>

      <Content className={styles.content}>
        {children}
      </Content>

      <Footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>Hệ thống mượn thiết bị</h3>
            <p>Giải pháp quản lý thiết bị thông minh</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Liên hệ</h4>
            <p>Email: support@example.com</p>
            <p>Hotline: 0123 456 789</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Liên kết</h4>
            <Link to="/about">Giới thiệu</Link>
            <Link to="/terms">Điều khoản sử dụng</Link>
            <Link to="/privacy">Chính sách bảo mật</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2024 Hệ thống mượn thiết bị. All rights reserved.</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default BasicLayout;