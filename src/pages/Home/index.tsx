import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Statistic, Spin, message, Layout, Tag } from 'antd';
import {
  LaptopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  RightOutlined,
  HistoryOutlined,
  UserOutlined,
  CameraOutlined,
  AudioOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { Link, history } from 'umi';
import './index.less';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

interface Device {
  id: string;
  name: string;
  status: string;
  description: string;
  icon: React.ReactNode;
  rating: number;
  borrowCount: number;
}

interface Statistics {
  availableCount: number;
  borrowedCount: number;
  maintenanceCount: number;
  totalDevices: number;
}

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Laptop Dell', status: 'available', description: 'Laptop cho sinh viên', icon: <LaptopOutlined style={{ fontSize: 32, color: '#1890ff' }} />, rating: 4.6, borrowCount: 156 },
    { id: '2', name: 'Máy chiếu', status: 'borrowed', description: 'Máy chiếu phòng học', icon: <VideoCameraOutlined style={{ fontSize: 32, color: '#722ed1' }} />, rating: 4.4, borrowCount: 98 },
    { id: '3', name: 'Máy tính bảng', status: 'maintenance', description: 'iPad cho thuyết trình', icon: <AudioOutlined style={{ fontSize: 32, color: '#52c41a' }} />, rating: 4.8, borrowCount: 203 },
    { id: '4', name: 'Camera', status: 'available', description: 'Camera quay phim', icon: <CameraOutlined style={{ fontSize: 32, color: '#1890ff' }} />, rating: 4.6, borrowCount: 156 }
  ]);
  const [statistics, setStatistics] = useState<Statistics>({
    availableCount: 15,
    borrowedCount: 8,
    maintenanceCount: 3,
    totalDevices: 26
  });

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'available':
        return <Tag color="success">Có sẵn</Tag>;
      case 'borrowed':
        return <Tag color="processing">Đang mượn</Tag>;
      case 'maintenance':
        return <Tag color="warning">Bảo trì</Tag>;
      default:
        return null;
    }
  };

  const handleBorrowClick = (deviceId: string) => {
    history.push(`/devices/borrow?id=${deviceId}`);
  };

  return (
    <Content style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
        {/* Welcome Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
          padding: '48px 24px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}>
          <Title level={2}>Chào mừng đến với Hệ thống Mượn Thiết bị</Title>
          <Paragraph style={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.65)', marginTop: '16px' }}>
            Hệ thống quản lý mượn trả thiết bị học tập và nghiên cứu của trường
          </Paragraph>
        </div>

        {/* Quick Stats */}
        <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
          <Col xs={24} sm={8}>
            <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
              <Statistic
                title="Thiết bị có sẵn"
                value={statistics.availableCount}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
              <Statistic
                title="Đang được mượn"
                value={statistics.borrowedCount}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
              <Statistic
                title="Đang bảo trì"
                value={statistics.maintenanceCount}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
          <Col xs={24} sm={8}>
            <Card hoverable style={{ textAlign: 'center', padding: '24px' }}>
              <Link to="/devices">
                <LaptopOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
                <Title level={4}>Danh sách thiết bị</Title>
                <Paragraph>Xem và mượn các thiết bị có sẵn</Paragraph>
              </Link>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable style={{ textAlign: 'center', padding: '24px' }}>
              <Link to="/devices/history">
                <HistoryOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
                <Title level={4}>Lịch sử mượn trả</Title>
                <Paragraph>Theo dõi lịch sử mượn trả thiết bị</Paragraph>
              </Link>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable style={{ textAlign: 'center', padding: '24px' }}>
              <Link to="/profile">
                <UserOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
                <Title level={4}>Thông tin cá nhân</Title>
                <Paragraph>Quản lý thông tin và cài đặt tài khoản</Paragraph>
              </Link>
            </Card>
          </Col>
        </Row>

        {/* Devices Grid */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={3}>Thiết bị có sẵn</Title>
            <Link to="/devices">
              <Button type="primary" icon={<RightOutlined />}>
                Xem tất cả
              </Button>
            </Link>
          </div>

          <Spin spinning={loading}>
            <Row gutter={[24, 24]}>
              {devices.map(device => (
                <Col xs={24} sm={12} md={6} key={device.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '120px',
                        fontSize: '48px',
                        color: '#1890ff',
                        background: '#f5f5f5'
                      }}>
                        {device.icon}
                      </div>
                    }
                  >
                    <Card.Meta
                      title={device.name}
                      description={
                        <div>
                          <div style={{ marginBottom: '8px' }}>
                            {getStatusTag(device.status)}
                          </div>
                          <div style={{ marginBottom: '16px' }}>
                            {device.description}
                          </div>
                          <Button
                            type="primary"
                            block
                            disabled={device.status !== 'available'}
                            onClick={() => handleBorrowClick(device.id)}
                          >
                            Mượn ngay
                          </Button>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>
        </div>

        {/* About Section */}
        <div>
          <Title level={3}>Về hệ thống</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card style={{ height: '100%' }}>
                <Title level={4}>Quy trình mượn</Title>
                <Paragraph>
                  1. Đăng nhập vào hệ thống<br />
                  2. Chọn thiết bị cần mượn<br />
                  3. Điền thông tin mượn<br />
                  4. Chờ xác nhận từ quản trị viên<br />
                  5. Nhận thiết bị và sử dụng
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card style={{ height: '100%' }}>
                <Title level={4}>Quy định sử dụng</Title>
                <Paragraph>
                  - Mỗi người chỉ được mượn tối đa 2 thiết bị cùng lúc<br />
                  - Thời gian mượn tối đa là 7 ngày<br />
                  - Cần bảo quản và sử dụng thiết bị cẩn thận<br />
                  - Trả thiết bị đúng hạn và đúng tình trạng
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Content>
  );
};

export default HomePage;
