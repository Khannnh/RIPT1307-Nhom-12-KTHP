import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { history } from 'umi';
import './basicLayout.less';

const { Header, Content, Sider } = Layout;

const BasicLayout: React.FC = (props) => {
  const navigateToThongKe = () => {
    history.push('/thongke?tab=columnChart');
  };

  const navigateToHome = () => {
    history.push('/');
  };

  return (
    <Layout>
      {/* Sidebar cố định bên trái */}
      <Sider width={200} className="site-sider" />

      <Layout style={{ marginLeft: 200 }}>
        {/* Header cố định bên trên */}
        <Header className="site-header">
          <div className="logo" onClick={navigateToHome}>
            <span className="app-title">Hệ Thống Quản Lý Thiết Bị</span>
          </div>
          <div className="header-actions">
            <Button type="primary" onClick={navigateToThongKe}>
              Xem Thống Kê
            </Button>
          </div>
        </Header>

        {/* Phần nội dung chính */}
        <Content style={{ marginTop: 64, padding: '24px 16px 0' }}>
          <div className="site-layout-background">{props.children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
