import React, { useState } from 'react';
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
  message
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

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

interface Device {
  key: string;
  name: string;
  type: string;
  status: 'available' | 'in_use' | 'broken';
  quantity: number;
  location: string;
  description: string;
}

// Mock data
const initialDevices: Device[] = [
  {
    key: '1',
    name: 'Laptop Dell XPS 13',
    type: 'Laptop',
    status: 'available',
    quantity: 5,
    location: 'Phòng A101',
    description: 'Laptop Dell XPS 13, Core i7, 16GB RAM, 512GB SSD',
  },
  {
    key: '2',
    name: 'Máy chiếu Epson',
    type: 'Projector',
    status: 'in_use',
    quantity: 2,
    location: 'Phòng B203',
    description: 'Máy chiếu Epson EB-X05, độ phân giải 1024x768',
  },
  {
    key: '3',
    name: 'Màn hình Dell 24"',
    type: 'Monitor',
    status: 'broken',
    quantity: 1,
    location: 'Phòng C305',
    description: 'Màn hình Dell 24 inch, độ phân giải Full HD',
  },
];

const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [form] = Form.useForm();

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'available':
        return <Tag icon={<CheckCircleOutlined />} color="success">Sẵn sàng</Tag>;
      case 'in_use':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Đang sử dụng</Tag>;
      case 'broken':
        return <Tag icon={<CloseCircleOutlined />} color="error">Hỏng</Tag>;
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

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa thiết bị này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        setDevices(devices.filter(device => device.key !== key));
        message.success('Đã xóa thiết bị thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingDevice) {
        // Update existing device
        setDevices(devices.map(device =>
          device.key === editingDevice.key ? { ...values, key: device.key } : device
        ));
        message.success('Cập nhật thiết bị thành công');
      } else {
        // Add new device
        const newDevice = {
          ...values,
          key: Date.now().toString(),
        };
        setDevices([...devices, newDevice]);
        message.success('Thêm thiết bị thành công');
      }
      setIsModalVisible(false);
    });
  };

  const columns: ColumnsType<Device> = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Laptop', value: 'Laptop' },
        { text: 'Projector', value: 'Projector' },
        { text: 'Monitor', value: 'Monitor' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Sẵn sàng', value: 'available' },
        { text: 'Đang sử dụng', value: 'in_use' },
        { text: 'Hỏng', value: 'broken' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Content style={styles.content}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Quản lý thiết bị</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm thiết bị
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={devices}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} thiết bị`,
          }}
        />

        <Modal
          title={editingDevice ? 'Sửa thiết bị' : 'Thêm thiết bị mới'}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ status: 'available' }}
          >
            <Form.Item
              name="name"
              label="Tên thiết bị"
              rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại thiết bị"
              rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị' }]}
            >
              <Select>
                <Option value="Laptop">Laptop</Option>
                <Option value="Projector">Máy chiếu</Option>
                <Option value="Monitor">Màn hình</Option>
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
                <Option value="in_use">Đang sử dụng</Option>
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
        </Modal>
      </Card>
    </Content>
  );
};

export default DevicesPage;
