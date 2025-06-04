import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { fetchAdminDevices, addDevice, updateDevice, deleteDevice } from '@/services/devices';
import { Device } from '@/services/devices';

const AdminDevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [form] = Form.useForm();

  const loadDevices = async () => {
    const data = await fetchAdminDevices();
    setDevices(data);
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const handleAdd = () => {
    setEditingDevice(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    form.setFieldsValue(device);
    setModalVisible(true);
  };

  const handleDelete = async (device: Device) => {
    const success = await deleteDevice(device.id);
    if (success) {
      message.success('Device deleted successfully.');
      loadDevices();
    } else {
      message.error('Failed to delete device');
    }
  };

  const handleSubmit = async (values: any) => {
    if (editingDevice) {
      const updated = await updateDevice(editingDevice.id, values);
      if (updated) {
        message.success('Device updated successfully.');
      } else {
        message.error('Failed to update device.');
      }
    } else {
      const added = await addDevice(values);
      if (added) {
        message.success('Device added successfully.');
      } else {
        message.error('Failed to add device.');
      }
    }
    setModalVisible(false);
    loadDevices();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Device Management</h1>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Device
      </Button>
      <Table dataSource={devices} rowKey="id">
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Description" dataIndex="description" key="description" />
        <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(_text, record: Device) => (
            <>
              <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
                Edit
              </Button>
              <Button danger onClick={() => handleDelete(record)}>
                Delete
              </Button>
            </>
          )}
        />
      </Table>

      <Modal
        title={editingDevice ? 'Edit Device' : 'Add Device'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input device name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
            <Input type="number" />
          </Form.Item>
          {/* Bạn có thể thêm các trường khác như category, location, serialNumber nếu cần */}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDevicesPage;
