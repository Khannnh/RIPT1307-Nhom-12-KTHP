import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Button, Modal, message, Descriptions } from 'antd';
import type { BorrowRequest } from '@/types/borrow-request';
import { BORROW_REQUEST_STATUS } from '@/constants/borrow-request';
import { borrowRequestService } from '@/services/borrow-request';
import styles from './index.less';

const BorrowRequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await borrowRequestService.getAllBorrowRequests();
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

  const handleApprove = async (requestId: string) => {
    try {
      await borrowRequestService.approveRequest(requestId);
      message.success('Request approved successfully');
      fetchRequests();
    } catch (error) {
      message.error('Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await borrowRequestService.rejectRequest(requestId);
      message.success('Request rejected successfully');
      fetchRequests();
    } catch (error) {
      message.error('Failed to reject request');
    }
  };

  const handleReturn = async (requestId: string) => {
    try {
      await borrowRequestService.returnDevice(requestId);
      message.success('Device returned successfully');
      fetchRequests();
    } catch (error) {
      message.error('Failed to return device');
    }
  };

  const handleViewDetails = (request: BorrowRequest) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
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
      title: 'User',
      dataIndex: ['user', 'fullName'],
      key: 'userName',
    },
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
      title: 'Action',
      key: 'action',
      render: (_: any, record: BorrowRequest) => (
        <Space>
          <Button
            type="link"
            onClick={() => handleViewDetails(record)}
          >
            View Details
          </Button>
          {record.status === BORROW_REQUEST_STATUS.PENDING && (
            <>
              <Button
                type="link"
                onClick={() => handleApprove(record._id)}
              >
                Approve
              </Button>
              <Button
                type="link"
                danger
                onClick={() => handleReject(record._id)}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === BORROW_REQUEST_STATUS.APPROVED && (
            <Button
              type="link"
              onClick={() => handleReturn(record._id)}
            >
              Return
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="Borrow Request Management" className={styles.card}>
        <Table
          columns={columns}
          dataSource={requests}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Request Details"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRequest && (
          <Descriptions column={1}>
            <Descriptions.Item label="User">
              {selectedRequest.user?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedRequest.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Device">
              {selectedRequest.device?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {selectedRequest.device?.category}
            </Descriptions.Item>
            <Descriptions.Item label="Borrow Date">
              {new Date(selectedRequest.borrowDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Return Date">
              {new Date(selectedRequest.returnDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedRequest.status)}>
                {selectedRequest.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Note">
              {selectedRequest.note || 'No note'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default BorrowRequestManagement;
