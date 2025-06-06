
import React, { useState } from 'react';
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
  const [trangThai, setTrangThai] = useState<string>(ETrangThaiYeuCau.DA_DUYET);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSubmit(values);
      form.resetFields();
      setTrangThai(ETrangThaiYeuCau.DA_DUYET);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setTrangThai(ETrangThaiYeuCau.DA_DUYET);
    onCancel();
  };

  return (
    <Modal
      title="Duyệt yêu cầu mượn"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
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
          label="Quyết định"
          name="trangThai"
          rules={[{ required: true, message: 'Vui lòng chọn quyết định!' }]}
        >
          <Radio.Group
            value={trangThai}
            onChange={(e) => setTrangThai(e.target.value)}
          >
            <Radio value={ETrangThaiYeuCau.DA_DUYET}>Duyệt</Radio>
            <Radio value={ETrangThaiYeuCau.TU_CHOI}>Từ chối</Radio>
          </Radio.Group>
        </Form.Item>

        {trangThai === ETrangThaiYeuCau.TU_CHOI && (
          <Form.Item
            label="Lý do từ chối"
            name="lyDoTuChoi"
            rules={[
              { required: true, message: 'Vui lòng nhập lý do từ chối!' },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập lý do từ chối..."
            />
          </Form.Item>
        )}

        <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5' }}>
          <strong>Thông tin yêu cầu:</strong>
          <div>Sinh viên: {record.tenSinhVien} ({record.maSinhVien})</div>
          <div>Lý do mượn: {record.lyDoMuon}</div>
          <div>Số lượng thiết bị: {record.danhSachThietBi.length}</div>
        </div>
      </Form>
    </Modal>
  );
};

export default DuyetYeuCauForm;
