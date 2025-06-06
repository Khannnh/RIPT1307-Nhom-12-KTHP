
import React from 'react';
import { Modal, Form, Radio, Input } from 'antd';
import { ETrangThaiYeuCau } from '@/services/MuonDo/constant';

interface DuyetYeuCauFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  record: MuonDo.IYeuCauMuon;
}

const DuyetYeuCauForm: React.FC<DuyetYeuCauFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  record,
}) => {
  const [form] = Form.useForm();
  const [trangThai, setTrangThai] = React.useState<string>(ETrangThaiYeuCau.DA_DUYET);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Duyệt yêu cầu mượn"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Xác nhận"
      cancelText="Hủy"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          trangThai: ETrangThaiYeuCau.DA_DUYET,
        }}
      >
        <Form.Item
          name="trangThai"
          label="Quyết định"
          rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}
        >
          <Radio.Group onChange={(e) => setTrangThai(e.target.value)}>
            <Radio value={ETrangThaiYeuCau.DA_DUYET}>Duyệt</Radio>
            <Radio value={ETrangThaiYeuCau.TU_CHOI}>Từ chối</Radio>
          </Radio.Group>
        </Form.Item>

        {trangThai === ETrangThaiYeuCau.TU_CHOI && (
          <Form.Item
            name="lyDoTuChoi"
            label="Lý do từ chối"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do từ chối..." />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default DuyetYeuCauForm;
