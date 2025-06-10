import React from 'react';
import { Card, Row, Col, Button, Typography } from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  CalendarOutlined,
    AppstoreOutlined,
} from '@ant-design/icons';
import { history, useDispatch } from 'umi';

const { Title, Paragraph } = Typography;

const AdminDevicesDashboard: React.FC = () => {
  return (
    <div style={{ background: '#f5f8ff', minHeight: '100vh', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <Title level={3} style={{ margin: 0 }}>Hệ Thống Quản Lý Thiết Bị</Title>
        <Button type="primary" onClick={() => history.push('/admin/statistics')} size="large">Xem Thống Kê</Button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ color: '#3b5cff', marginBottom: 8 }}>
          Chào Mừng Đến Với Hệ Thống Quản Lý
        </Title>
        <Paragraph style={{ fontSize: 16, color: '#555' }}>
          Theo dõi và phân tích việc sử dụng thiết bị một cách hiệu quả với các báo cáo chi tiết<br />
          và trực quan theo thời gian thực
        </Paragraph>
      </div>
      <Row gutter={24} justify="center" style={{ marginBottom: 40 }}>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12, minHeight: 180 }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <BarChartOutlined style={{ fontSize: 36, color: '#3b5cff', marginBottom: 16 }} />
            <Title level={4}>Thống Kê Chi Tiết</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              Xem báo cáo thiết bị được mượn nhiều nhất theo tuần, tháng, năm
            </Paragraph>
            <Button type="primary" style={{ marginTop: 8 }}>Xem Thống Kê</Button>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12, minHeight: 180 }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <LineChartOutlined style={{ fontSize: 36, color: '#00c292', marginBottom: 16 }} />
            <Title level={4}>Phân Tích Xu Hướng</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              Biểu đồ trực quan giúp hiểu rõ xu hướng sử dụng thiết bị
            </Paragraph>
            <Button type="default" style={{ borderColor: '#00c292', color: '#00c292', marginTop: 8 }}>
              Xem Biểu Đồ
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12, minHeight: 180 }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <CalendarOutlined style={{ fontSize: 36, color: '#a259ff', marginBottom: 16 }} />
            <Title level={4}>Lọc Theo Thời Gian</Title>
            <Paragraph style={{ textAlign: 'center' }}>
              Tuỳ chỉnh khoảng thời gian xem báo cáo một cách linh hoạt
            </Paragraph>
            <Button type="default" style={{ borderColor: '#a259ff', color: '#a259ff', marginTop: 8 }}>
              Chọn Thời Gian
            </Button>
          </Card>
        </Col>
      </Row>
      <div style={{ marginTop: 48 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>Tính Năng Nổi Bật</Title>
        <Row gutter={24} justify="center">
          <Col xs={24} md={6}>
            <Card bordered={false} style={{ textAlign: 'center', minHeight: 140 }}>
              <BarChartOutlined style={{ fontSize: 32, color: '#3b5cff', marginBottom: 12 }} />
              <Title level={5}>Báo Cáo Thời Gian Thực</Title>
              <Paragraph>Cập nhật dữ liệu liên tục và chính xác</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bordered={false} style={{ textAlign: 'center', minHeight: 140 }}>
              <LineChartOutlined style={{ fontSize: 32, color: '#00c292', marginBottom: 12 }} />
              <Title level={5}>Phân Tích Xu Hướng</Title>
              <Paragraph>Hiểu rõ mô hình sử dụng thiết bị</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bordered={false} style={{ textAlign: 'center', minHeight: 140 }}>
              <CalendarOutlined style={{ fontSize: 32, color: '#a259ff', marginBottom: 12 }} />
              <Title level={5}>Lọc Linh Hoạt</Title>
              <Paragraph>Tùy chỉnh theo tuần, tháng, năm</Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bordered={false} style={{ textAlign: 'center', minHeight: 140 }}>
              <AppstoreOutlined style={{ fontSize: 32, color: '#ff9900', marginBottom: 12 }} />
              <Title level={5}>Giao Diện Trực Quan</Title>
              <Paragraph>Dễ sử dụng và thân thiện</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDevicesDashboard;