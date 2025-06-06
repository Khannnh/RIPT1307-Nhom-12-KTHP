import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Typography,
  Timeline,
  Modal,
  message,
  Tag
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined
} from '@ant-design/icons';
import { borrowRequestService } from '@/services/borrow-request';
import { BorrowRequest } from '@/types/borrow-request';
import { BORROW_REQUEST_STATUS } from '@/constants/borrow-request';
import styles from './[id].module.less';

const { Title } = Typography;

const AdminBorrowRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<BorrowRequest | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRequestDetails();
    }
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await borrowRequestService.getBorrowRequestById(id!);
      setRequest(response.data);
    } catch (error) {
      console.error('Error fetching request details:', error);
      message.error('Không thể tải thông tin yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await borrowRequestService.approveBorrowRequest(id!);
      message.success('Đã duyệt yêu cầu mượn');
      fetchRequestDetails();
    } catch (error) {
      console.error('Error approving request:', error);
      message.error('Không thể duyệt yêu cầu');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await borrowRequestService.rejectBorrowRequest(id!);
      message.success('Đã từ chối yêu cầu mượn');
      fetchRequestDetails();
    } catch (error) {
      console.error('Error rejecting request:', error);
      message.error('Không thể từ chối yêu cầu');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    try {
      setActionLoading(true);
      await borrowRequestService.returnDevice(id!);
      message.success('Đã xác nhận trả thiết bị');
      fetchRequestDetails();
    } catch (error) {
      console.error('Error returning device:', error);
      message.error('Không thể xác nhận trả thiết bị');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'warning', text: 'Chờ duyệt' },
      APPROVED: { color: 'processing', text: 'Đã duyệt' },
      REJECTED: { color: 'error', text: 'Từ chối' },
      RETURNED: { color: 'success', text: 'Đã trả' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  if (!request) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin/borrow-requests')}
        className={styles.backButton}
      >
        Quay lại
      </Button>

      <Title level={2}>Chi tiết yêu cầu mượn</Title>

      <Card loading={loading}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Mã yêu cầu">{request.id}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {getStatusTag(request.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Sinh viên">{request.user.name}</Descriptions.Item>
          <Descriptions.Item label="MSSV">{request.user.studentId}</Descriptions.Item>
          <Descriptions.Item label="Thiết bị">{request.device.name}</Descriptions.Item>
          <Descriptions.Item label="Mã thiết bị">{request.device.code}</Descriptions.Item>
          <Descriptions.Item label="Ngày mượn">
            {new Date(request.borrowDate).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày trả">
            {new Date(request.returnDate).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={2}>
            {request.note || 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(request.createdAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {new Date(request.updatedAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>

        {request.status === 'PENDING' && (
          <Space className={styles.actions}>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleApprove}
              loading={actionLoading}
            >
              Duyệt
            </Button>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={handleReject}
              loading={actionLoading}
            >
              Từ chối
            </Button>
          </Space>
        )}

        {request.status === 'APPROVED' && (
          <Space className={styles.actions}>
            <Button
              type="primary"
              icon={<RollbackOutlined />}
              onClick={handleReturn}
              loading={actionLoading}
            >
              Xác nhận trả
            </Button>
          </Space>
        )}

        <div className={styles.timeline}>
          <Title level={4}>Lịch sử yêu cầu</Title>
          <Timeline>
            <Timeline.Item>
              Tạo yêu cầu mượn - {new Date(request.createdAt).toLocaleString('vi-VN')}
            </Timeline.Item>
            {request.status !== 'PENDING' && (
              <Timeline.Item color={request.status === 'APPROVED' ? 'green' : 'red'}>
                {request.status === 'APPROVED' ? 'Duyệt' : 'Từ chối'} yêu cầu - {new Date(request.updatedAt).toLocaleString('vi-VN')}
              </Timeline.Item>
            )}
            {request.status === 'RETURNED' && (
              <Timeline.Item color="green">
                Xác nhận trả thiết bị - {new Date(request.updatedAt).toLocaleString('vi-VN')}
              </Timeline.Item>
            )}
          </Timeline>
        </div>
      </Card>
    </div>
  );
};

export default AdminBorrowRequestDetail;
