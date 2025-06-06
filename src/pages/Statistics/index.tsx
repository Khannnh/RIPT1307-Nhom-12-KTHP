import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  LaptopOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Column } from '@ant-design/plots';

const { Title } = Typography;

// Mock data for statistics
const deviceUsageData = [
  { type: 'Laptop', value: 38 },
  { type: 'Máy chiếu', value: 25 },
  { type: 'Máy in', value: 15 },
  { type: 'Màn hình', value: 12 },
  { type: 'Khác', value: 10 },
];

const StatisticsPage: React.FC = () => {
  const config = {
    data: deviceUsageData,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      type: { alias: 'Loại thiết bị' },
      value: { alias: 'Số lần mượn' },
    },
    color: ({ type }: { type: string }) => {
      return '#1890ff';
    },
  };

  return (
    <PageContainer>
      <Title level={2}>Thống kê sử dụng thiết bị</Title>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số thiết bị"
              value={42}
              prefix={<LaptopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang được mượn"
              value={15}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sẵn sàng cho mượn"
              value={27}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Người dùng đang hoạt động"
              value={8}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Device Usage Chart */}
      <Card
        title={
          <span>
            <BarChartOutlined /> Thống kê mượn thiết bị theo loại
          </span>
        }
      >
        <Column {...config} />
      </Card>

      {/* Additional Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Thiết bị được mượn nhiều nhất">
            <Statistic
              title="Laptop Dell XPS 13"
              value={28}
              suffix="lần mượn"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Thời gian mượn trung bình">
            <Statistic
              title="Trung bình"
              value={2.5}
              suffix="ngày"
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default StatisticsPage;
