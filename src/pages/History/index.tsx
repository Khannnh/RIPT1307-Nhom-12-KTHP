import React from 'react';
import { Table, Tag, Space, Typography, Card, Layout, Button, message } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { cancelBorrowRequest, type BorrowRequest } from '@/services/borrow-request.service';
import dayjs from 'dayjs';
import styles from './index.less';
import useHistory from '@/hooks/useHistory';

const { Title } = Typography;
const { Content } = Layout;

// Nếu cần, mở rộng interface BorrowRequest ở đây cho đúng dữ liệu thực tế
type BorrowRequestWithDevice = BorrowRequest & {
  device?: any[];
};

const getStatusTag = (status: string) => {
  switch (status) {
    case 'pending':
      return <Tag icon={<ClockCircleOutlined />} color="processing">Đang chờ duyệt</Tag>;
    case 'approved':
      return <Tag icon={<CheckCircleOutlined />} color="success">Đã duyệt</Tag>;
    case 'rejected':
      return <Tag icon={<CloseCircleOutlined />} color="error">Từ chối</Tag>;
    case 'returned':
      return <Tag icon={<CheckCircleOutlined />} color="default">Đã trả</Tag>;
    default:
      return null;
  }
};

const HistoryPage: React.FC = () => {
  const { data, pagination, loading, refetch } = useHistory();

  const handleCancel = async (id: string) => {
    try {
      await cancelBorrowRequest(id);
      message.success('Hủy yêu cầu thành công');
      refetch();
    } catch (error) {
      message.error('Không thể hủy yêu cầu');
    }
  };

  const columns: ColumnsType<BorrowRequestWithDevice> = [
    {
      title: 'Số lượng',
      key: 'quantity',
      width: 120,
      render: (_: any, record: BorrowRequestWithDevice) => record.device?.[0]?.quantity ?? '',
    },
    {
      title: 'Tên thiết bị',
      key: 'deviceName',
      width: 200,
      render: (_: any, record: BorrowRequestWithDevice) => record.device?.[0]?.name || '',
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      key: 'borrowDate',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày dự định trả',
      dataIndex: 'returnDate',
      key: 'returnDate',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, record: BorrowRequestWithDevice) => (
        <Space>
          {record.status === 'pending' && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleCancel(record.id)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Content className={styles.content}>
      <div className={styles.container}>
        <Card className={styles.historyCard}>
          <Title level={2} className={styles.title}>Lịch sử mượn thiết bị</Title>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey="id"
            className={styles.table}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} bản ghi`,
            }}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
    </Content>
  );
};

export default HistoryPage;