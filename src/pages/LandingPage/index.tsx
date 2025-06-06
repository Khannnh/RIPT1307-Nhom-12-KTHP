import React from 'react';
import { Button, Card, Col, Row, Typography, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  AppstoreOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  MailOutlined,
  BellOutlined
} from '@ant-design/icons';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const history = useHistory();

  const features = [
    {
      icon: <AppstoreOutlined className={styles.featureIcon} />,
      title: 'Quản lý thiết bị',
      description: 'Hệ thống quản lý thiết bị thông minh, dễ dàng theo dõi và kiểm soát',
    },
    {
      icon: <TeamOutlined className={styles.featureIcon} />,
      title: 'Đăng ký mượn trực tuyến',
      description: 'Sinh viên có thể đăng ký mượn thiết bị trực tuyến, tiết kiệm thời gian',
    },
    {
      icon: <SafetyCertificateOutlined className={styles.featureIcon} />,
      title: 'Bảo mật thông tin',
      description: 'Hệ thống bảo mật cao, đảm bảo an toàn thông tin người dùng',
    },
    {
      icon: <ClockCircleOutlined className={styles.featureIcon} />,
      title: 'Theo dõi thời gian',
      description: 'Tự động theo dõi thời gian mượn và gửi thông báo khi đến hạn',
    },
    {
      icon: <MailOutlined className={styles.featureIcon} />,
      title: 'Thông báo qua email',
      description: 'Nhận thông báo qua email khi yêu cầu được duyệt hoặc từ chối',
    },
    {
      icon: <BellOutlined className={styles.featureIcon} />,
      title: 'Cảnh báo tự động',
      description: 'Hệ thống tự động gửi cảnh báo khi thiết bị quá hạn trả',
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <Title level={1} className={styles.heroTitle}>
            Hệ Thống Quản Lý Mượn Thiết Bị
          </Title>
          <Paragraph className={styles.heroDescription}>
            Giải pháp quản lý thiết bị thông minh cho sinh viên và quản trị viên
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              onClick={() => history.push('/auth/login')}
            >
              Đăng nhập
            </Button>
            <Button
              size="large"
              onClick={() => history.push('/auth/register')}
            >
              Đăng ký
            </Button>
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.features}>
        <Title level={2} className={styles.sectionTitle}>
          Tính năng nổi bật
        </Title>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card className={styles.featureCard}>
                {feature.icon}
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <Paragraph>
          © 2024 Hệ Thống Quản Lý Mượn Thiết Bị. All rights reserved.
        </Paragraph>
      </footer>
    </div>
  );
};

export default LandingPage;
