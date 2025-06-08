import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
  Device,
  DeviceListParams,
  DeviceListResponse,
} from '@/services/device.service';

// Create a simple styles object instead of importing
const styles = {
  content: {
    padding: '24px',
    background: '#fff',
    minHeight: '100vh'
  }
};

const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;

const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchDevices = async (params: DeviceListParams = {}) => {
    try {
      setLoading(true);
      const response: DeviceListResponse = await getDevices({
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        keyword: params.keyword,
      });
      console.log('API Response for Devices Page:', response);
      setDevices(response.data);
      setPagination({
        current: response.current,
        pageSize: response.pageSize,
        total: response.total,
      });
    } catch (error) {
      console.error('Error fetching devices:', error);
      message.error('Không thể tải danh sách thiết bị');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchDevices({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'available':
        return <Tag icon={<CheckCircleOutlined />} color="success">Sẵn sàng</Tag>;
      case 'borrowed':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Đang sử dụng</Tag>;
      case 'broken':
        return <Tag icon={<CloseCircleOutlined />} color="error">Hỏng</Tag>;
      case 'maintenance':
        return <Tag icon={<ClockCircleOutlined />} color="warning">Bảo trì</Tag>;
      case 'lost':
        return <Tag icon={<CloseCircleOutlined />} color="red">Mất</Tag>;
      default:
        return null;
    }
  };

  const handleAdd = () => {
    setEditingDevice(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Device) => {
    setEditingDevice(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa thiết bị này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteDevice(id);
          message.success('Đã xóa thiết bị thành công');
          fetchDevices(); // Refresh list
        } catch (error) {
          console.error('Error deleting device:', error);
          message.error('Xóa thiết bị thất bại');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingDevice) {
        // Update existing device
        await updateDevice(editingDevice.id, values);
        message.success('Cập nhật thiết bị thành công');
      } else {
        // Add new device
        await createDevice(values);
        message.success('Thêm thiết bị thành công');
      }
      setIsModalVisible(false);
      fetchDevices(); // Refresh list
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const columns: ColumnsType<Device> = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mã số',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Sẵn sàng', value: 'available' },
        { text: 'Đang mượn', value: 'borrowed' },
        { text: 'Bảo trì', value: 'maintenance' },
        { text: 'Hỏng', value: 'broken' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a: Device, b: Device) => a.quantity - b.quantity,
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
  ];

  return (
    <Content style={styles.content}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Quản lý thiết bị</Title>
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm thiết bị
          </Button> */}
        </div>

        <Table
          columns={columns}
          dataSource={devices}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
        />

        {/* <Modal
          title={editingDevice ? 'Sửa thiết bị' : 'Thêm thiết bị mới'}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ status: 'available', quantity: 1, location: '' }}
          >
            <Form.Item
              name="name"
              label="Tên thiết bị"
              rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="serialNumber"
              label="Mã số"
              rules={[{ required: true, message: 'Vui lòng nhập mã số thiết bị' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục thiết bị' }]}
            >
              <Select>
                <Option value="Laptop">Laptop</Option>
                <Option value="Projector">Máy chiếu</Option>
                <Option value="Monitor">Màn hình</Option>
                <Option value="Camera">Camera</Option>
                <Option value="Microphone">Microphone</Option>
                <Option value="Other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Option value="available">Sẵn sàng</Option>
                <Option value="borrowed">Đang mượn</Option>
                <Option value="maintenance">Bảo trì</Option>
                <Option value="broken">Hỏng</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="location"
              label="Vị trí"
              rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal> */}
      </Card>
    </Content>
  );
};

export default DevicesPage;
