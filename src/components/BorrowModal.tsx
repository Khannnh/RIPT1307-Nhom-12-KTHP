import React, { useEffect } from 'react';
import { Modal, Form, DatePicker, message } from 'antd';

interface BorrowModalProps {
  visible: boolean;
  deviceName: string;
  onCancel: () => void;
  onSubmit: (borrowDate: string, returnDate: string) => void;
}

const BorrowModal: React.FC<BorrowModalProps> = ({ visible, deviceName, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const { borrowDate, returnDate } = values;
        if (borrowDate && returnDate) {
          onSubmit(borrowDate.toISOString(), returnDate.toISOString());
        } else {
          message.error('Please select both dates.');
        }
      })
      .catch(info => {
        console.log('Validation Failed:', info);
      });
  };

  return (
    <Modal
      visible={visible}
      title={`Borrow Device: ${deviceName}`}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Submit Request"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="borrowDate"
          label="Borrow Date"
          rules={[{ required: true, message: 'Please select borrow date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="returnDate"
          label="Expected Return Date"
          rules={[{ required: true, message: 'Please select expected return date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BorrowModal;
