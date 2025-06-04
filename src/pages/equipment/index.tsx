import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, message } from 'antd';
import { history, useModel } from 'umi';
import { fetchUserDevices, createBorrowRequest } from '@/services/devices';
import { Device } from '@/services/devices';
import BorrowModal from '@/components/BorrowModal';

const EquipmentPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Kiểm tra trạng thái đăng nhập từ Umi (initialState)
  const { initialState } = useModel('@@initialState');
  const isLoggedIn = !!initialState?.currentUser;

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const deviceList = await fetchUserDevices();
    setDevices(deviceList);
  };

  const handleBorrowClick = (device: Device) => {
    if (!isLoggedIn) {
      message.info('Please log in to borrow a device.');
      history.push('/user/auth/login');
      return;
    }
    setSelectedDevice(device);
    setBorrowModalVisible(true);
  };

  const handleBorrowSubmit = async (borrowDate: string, returnDate: string) => {
    if (!selectedDevice) return;
    const success = await createBorrowRequest(selectedDevice.id, borrowDate, returnDate);
    if (success) {
      message.success(`Borrow request for ${selectedDevice.name} submitted successfully.`);
    } else {
      message.error('Failed to submit borrow request.');
    }
    setBorrowModalVisible(false);
    setSelectedDevice(null);
  };

  const handleBorrowCancel = () => {
    setBorrowModalVisible(false);
    setSelectedDevice(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Available Devices</h1>
      <Row gutter={[16, 16]}>
        {devices.map(device => (
          <Col xs={24} sm={12} md={8} lg={6} key={device.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={device.name}
                  src={device.imageUrl || 'https://via.placeholder.com/200'}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta title={device.name} description={device.description} />
              <Button type="primary" onClick={() => handleBorrowClick(device)} style={{ marginTop: 10 }}>
                Borrow
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <BorrowModal
        visible={borrowModalVisible}
        deviceName={selectedDevice ? selectedDevice.name : ''}
        onCancel={handleBorrowCancel}
        onSubmit={handleBorrowSubmit}
      />
    </div>
  );
};

export default EquipmentPage;
