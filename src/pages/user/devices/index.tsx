import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Space, Table, Tag, Button, message, Modal, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import type { Device } from '@/types/device';
import { DEVICE_STATUS } from '@/constants/device';
import { deviceService } from '@/services/device';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [borrowDate, setBorrowDate] = useState<[Date, Date] | null>(null);
  const history = useHistory();

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await deviceService.getAllDevices({
        search: searchText,
        category: categoryFilter,
        status: statusFilter,
      });
      setDevices(data);
    } catch (error) {
      message.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [searchText, categoryFilter, statusFilter]);

  const handleBorrow = async (device: Device) => {
    setSelectedDevice(device);
    setBorrowModalVisible(true);
  };

  const handleBorrowSubmit = async () => {
    if (!selectedDevice || !borrowDate) return;

    try {
      await deviceService.borrowDevice({
        deviceId: selectedDevice._id,
        borrowDate: borrowDate[0],
        returnDate: borrowDate[1],
      });
      message.success('Borrow request submitted successfully');
      setBorrowModalVisible(false);
      history.push('/user/borrow-requests');
    } catch (error) {
      message.error('Failed to submit borrow request');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Device) => (
        <a onClick={() => history.push(`/user/devices/${record._id}`)}>{text}</a>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === DEVICE_STATUS.AVAILABLE ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Available Quantity',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Device) => (
        <Button
          type="primary"
          onClick={() => handleBorrow(record)}
          disabled={record.status !== DEVICE_STATUS.AVAILABLE || record.availableQuantity <= 0}
        >
          Borrow
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="Available Devices" className={styles.card}>
        <Space className={styles.filters}>
          <Input
            placeholder="Search devices..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Category"
            allowClear
            style={{ width: 200 }}
            onChange={setCategoryFilter}
          >
            <Option value="electronics">Electronics</Option>
            <Option value="furniture">Furniture</Option>
            <Option value="sports">Sports</Option>
          </Select>
          <Select
            placeholder="Status"
            allowClear
            style={{ width: 200 }}
            onChange={setStatusFilter}
          >
            <Option value={DEVICE_STATUS.AVAILABLE}>Available</Option>
            <Option value={DEVICE_STATUS.MAINTENANCE}>Maintenance</Option>
            <Option value={DEVICE_STATUS.LOST}>Lost</Option>
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={devices}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Borrow Device"
        visible={borrowModalVisible}
        onOk={handleBorrowSubmit}
        onCancel={() => setBorrowModalVisible(false)}
        okText="Submit Request"
        cancelText="Cancel"
      >
        {selectedDevice && (
          <div>
            <p>Device: {selectedDevice.name}</p>
            <p>Category: {selectedDevice.category}</p>
            <p>Available Quantity: {selectedDevice.availableQuantity}</p>
            <div style={{ marginTop: 16 }}>
              <p>Select Borrow Period:</p>
              <RangePicker
                onChange={(dates) => {
                  if (dates) {
                    setBorrowDate([dates[0]?.toDate() as Date, dates[1]?.toDate() as Date]);
                  } else {
                    setBorrowDate(null);
                  }
                }}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeviceList;
