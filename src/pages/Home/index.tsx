import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Statistic, Spin, message } from 'antd';
import { 
  LaptopOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  RightOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';

const { Title, Paragraph } = Typography;

interface Device {
  id: string;
  name: string;
  status: 'available' | 'borrowed' | 'maintenance';
  quantity: number;
  image: string;
}

// Mock data for devices
const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Laptop Dell XPS 13',
    status: 'available',
    quantity: 5,
    image: 'https://example.com/laptop.jpg',
  },
  {
    id: '2',
    name: 'Máy chiếu Epson',
    status: 'borrowed',
    quantity: 2,
    image: 'https://example.com/projector.jpg',
  },
  {
    id: '3',
    name: 'Máy ảnh Canon EOS',
    status: 'maintenance',
    quantity: 1,
    image: 'https://example.com/camera.jpg',
  },
];

const getStatusTag = (status: string) => {
  switch (status) {
    case 'available':
      return <span className={styles.statusAvailable}>Có sẵn</span>;
    case 'borrowed':
      return <span className={styles.statusBorrowed}>Đang mượn</span>;
    case 'maintenance':
      return <span className={styles.statusMaintenance}>Bảo trì</span>;
    default:
      return null;
  }
};

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchDevices = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDevices(mockDevices);
      } catch (error) {
        message.error('Không thể tải danh sách thiết bị');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const availableCount = devices.filter(d => d.status === 'available').length;
  const borrowedCount = devices.filter(d => d.status === 'borrowed').length;
  const maintenanceCount = devices.filter(d => d.status === 'maintenance').length;

  return (
    <PageContainer>
      <div className={styles.container}>
        {/* Welcome Section */}
        <div className={styles.welcomeSection}>
          <Title level={2}>Chào mừng đến với Hệ thống Mượn Thiết bị</Title>
          <Paragraph className={styles.welcomeText}>
            Hệ thống quản lý mượn trả thiết bị học tập và nghiên cứu của trường
          </Paragraph>
        </div>

        {/* Quick Stats */}
        <Row gutter={[24, 24]} className={styles.statsRow}>
          <Col xs={24} sm={8}>
            <Card className={styles.statsCard}>
              <Statistic
                title="Thiết bị có sẵn"
                value={availableCount}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={styles.statsCard}>
              <Statistic
                title="Đang được mượn"
                value={borrowedCount}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className={styles.statsCard}>
              <Statistic
                title="Đang bảo trì"
                value={maintenanceCount}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Devices Grid */}
        <div className={styles.devicesSection}>
          <div className={styles.sectionHeader}>
            <Title level={3}>Thiết bị có sẵn</Title>
            <Button type="primary" icon={<RightOutlined />}>
              Xem tất cả
            </Button>
          </div>

          <Spin spinning={loading}>
            <Row gutter={[24, 24]} className={styles.devicesGrid}>
              {devices.map(device => (
                <Col xs={24} sm={12} md={8} lg={6} key={device.id}>
                  <Card
                    hoverable
                    className={styles.deviceCard}
                    cover={
                      <div className={styles.deviceImage}>
                        <LaptopOutlined />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={device.name}
                      description={
                        <div className={styles.deviceInfo}>
                          <div className={styles.deviceStatus}>
                            {getStatusTag(device.status)}
                          </div>
                          <div className={styles.deviceQuantity}>
                            Số lượng: {device.quantity}
                          </div>
                          <Button 
                            type="primary" 
                            block
                            disabled={device.status !== 'available'}
                            onClick={() => message.info('Chức năng đang được phát triển')}
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
        <div className={styles.aboutSection}>
          <Title level={3}>Về hệ thống</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card className={styles.aboutCard}>
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
              <Card className={styles.aboutCard}>
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
    </PageContainer>
  );
};

export default HomePage;
