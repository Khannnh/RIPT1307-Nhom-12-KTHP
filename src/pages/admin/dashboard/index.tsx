import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Tag } from 'antd';
import {
  DesktopOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { deviceService } from '@/services/device';
import { borrowRequestService } from '@/services/borrow-request';
import { IBorrowRequest } from '@/types/borrow-request';
import { BORROW_REQUEST_STATUS } from '@/constants/borrow-request';
import styles from './index.module.less';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDevices: 0,
    availableDevices: 0,
    pendingRequests: 0,
    activeBorrows: 0,
  });
  const [recentRequests, setRecentRequests] = useState<IBorrowRequest[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [devices, requests] = await Promise.all([
        deviceService.adminGetAllDevices(),
        borrowRequestService.getAllBorrowRequests(),
      ]);

      const availableDevices = devices.filter(d => d.status === 'AVAILABLE').length;
      const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
      const activeBorrows = requests.filter(r => r.status === 'APPROVED').length;

      setStats({
        totalDevices: devices.length,
        availableDevices,
        pendingRequests,
        activeBorrows,
      });

      // Get 5 most recent requests
      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Sinh viên',
      dataIndex: ['user', 'name'],
      key: 'user',
    },
    {
      title: 'Thiết bị',
      dataIndex: ['device', 'name'],
      key: 'device',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          PENDING: { color: 'warning', text: 'Chờ duyệt' },
          APPROVED: { color: 'processing', text: 'Đã duyệt' },
          REJECTED: { color: 'error', text: 'Từ chối' },
          RETURNED: { color: 'success', text: 'Đã trả' },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <div className={styles.container}>
      <Title level={2}>Tổng quan</Title>

      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng số thiết bị"
              value={stats.totalDevices}
              prefix={<DesktopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Thiết bị khả dụng"
              value={stats.availableDevices}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Yêu cầu chờ duyệt"
              value={stats.pendingRequests}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Đang mượn"
              value={stats.activeBorrows}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Yêu cầu mượn gần đây"
        className={styles.recentRequests}
        loading={loading}
      >
        <Table
          columns={columns}
          dataSource={recentRequests}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
