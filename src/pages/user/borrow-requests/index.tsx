import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, message } from 'antd';
import type { BorrowRequest } from '@/types/borrow-request';
import { BORROW_REQUEST_STATUS } from '@/constants/borrow-request';
import { borrowRequestService } from '@/services/borrow-request';
import styles from './index.less';

const BorrowRequestList: React.FC = () => {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowRequestService.getUserBorrowRequests();
      setRequests(data);
    } catch (error) {
      message.error('Failed to fetch borrow requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancel = async (requestId: string) => {
    try {
      await borrowRequestService.rejectRequest(requestId);
      message.success('Request cancelled successfully');
      fetchRequests();
    } catch (error) {
      message.error('Failed to cancel request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case BORROW_REQUEST_STATUS.PENDING:
        return 'processing';
      case BORROW_REQUEST_STATUS.APPROVED:
        return 'success';
      case BORROW_REQUEST_STATUS.REJECTED:
        return 'error';
      case BORROW_REQUEST_STATUS.CANCELLED:
        return 'default';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Device',
      dataIndex: ['device', 'name'],
      key: 'deviceName',
    },
    {
      title: 'Borrow Date',
      dataIndex: 'borrowDate',
      key: 'borrowDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Return Date',
      dataIndex: 'returnDate',
      key: 'returnDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: BorrowRequest) => (
        <Space>
          {record.status === BORROW_REQUEST_STATUS.PENDING && (
            <Button
              type="link"
              danger
              onClick={() => handleCancel(record._id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="My Borrow Requests" className={styles.card}>
        <Table
          columns={columns}
          dataSource={requests}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default BorrowRequestList;
