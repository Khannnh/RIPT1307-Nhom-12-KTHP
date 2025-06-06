import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Typography,
  Timeline,
  message,
  Modal
} from 'antd';
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { borrowRequestService } from '@/services/borrow-request';
import type { BorrowRequest } from '@/types/borrow-request';
import { BORROW_REQUEST_STATUS } from '@/constants/borrow-request';
import styles from './index.less';

const { Title, Text } = Typography;

const BorrowRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [request, setRequest] = useState<BorrowRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  useEffect(() => {
    fetchRequestDetail();
  }, [id]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const response = await borrowRequestService.getBorrowRequestById(id);
      setRequest(response.data);
    } catch (error) {
      message.error('Không thể tải thông tin yêu cầu');
      history.push('/student/borrow-requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      await borrowRequestService.cancelBorrowRequest(id);
      message.success('Hủy yêu cầu thành công');
      setCancelModalVisible(false);
      fetchRequestDetail();
    } catch (error) {
      message.error('Không thể hủy yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      [BORROW_REQUEST_STATUS.PENDING]: {
        color: 'warning',
        icon: <ClockCircleOutlined />,
        text: 'Chờ duyệt'
      },
      [BORROW_REQUEST_STATUS.APPROVED]: {
        color: 'success',
        icon: <CheckCircleOutlined />,
        text: 'Đã duyệt'
      },
      [BORROW_REQUEST_STATUS.REJECTED]: {
        color: 'error',
        icon: <CloseCircleOutlined />,
        text: 'Bị từ chối'
      },
      [BORROW_REQUEST_STATUS.CANCELLED]: {
        color: 'default',
        icon: <CloseCircleOutlined />,
        text: 'Đã hủy'
      },
      [BORROW_REQUEST_STATUS.RETURNED]: {
        color: 'processing',
        icon: <CheckCircleOutlined />,
        text: 'Đã trả'
      }
    };

    const config = statusConfig[status] || {
      color: 'default',
      icon: <ExclamationCircleOutlined />,
      text: status
    };

    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  if (!request) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Card
        loading={loading}
        title={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => history.push('/student/borrow-requests')}
            >
              Quay lại
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              Chi tiết yêu cầu mượn
            </Title>
          </Space>
        }
        extra={
          request.status === BORROW_REQUEST_STATUS.PENDING && (
            <Button
              danger
              onClick={() => setCancelModalVisible(true)}
            >
              Hủy yêu cầu
            </Button>
          )
        }
      >
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Trạng thái">
            {getStatusTag(request.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Thiết bị">
            {request.device?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày mượn">
            {new Date(request.borrowDate).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày trả">
            {new Date(request.returnDate).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={2}>
            {request.note || 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Thời gian tạo">
            {new Date(request.createdAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {new Date(request.updatedAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>

        <div className={styles.timeline}>
          <Title level={5}>Lịch sử yêu cầu</Title>
          <Timeline>
            <Timeline.Item>
              <Text>Yêu cầu được tạo</Text>
              <br />
              <Text type="secondary">
                {new Date(request.createdAt).toLocaleString('vi-VN')}
              </Text>
            </Timeline.Item>
            {request.status !== BORROW_REQUEST_STATUS.PENDING && (
              <Timeline.Item color={request.status === BORROW_REQUEST_STATUS.APPROVED ? 'green' : 'red'}>
                <Text>
                  {request.status === BORROW_REQUEST_STATUS.APPROVED
                    ? 'Yêu cầu được duyệt'
                    : 'Yêu cầu bị từ chối'}
                </Text>
                <br />
                <Text type="secondary">
                  {new Date(request.updatedAt).toLocaleString('vi-VN')}
                </Text>
              </Timeline.Item>
            )}
            {request.status === BORROW_REQUEST_STATUS.RETURNED && (
              <Timeline.Item color="blue">
                <Text>Thiết bị đã được trả</Text>
                <br />
                <Text type="secondary">
                  {new Date(request.updatedAt).toLocaleString('vi-VN')}
                </Text>
              </Timeline.Item>
            )}
          </Timeline>
        </div>
      </Card>

      <Modal
        title="Xác nhận hủy yêu cầu"
        visible={cancelModalVisible}
        onOk={handleCancel}
        onCancel={() => setCancelModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <p>Bạn có chắc chắn muốn hủy yêu cầu mượn này không?</p>
      </Modal>
    </div>
  );
};

export default BorrowRequestDetail;
