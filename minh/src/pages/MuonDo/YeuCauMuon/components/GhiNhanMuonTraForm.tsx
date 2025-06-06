
import React, { useState } from 'react';
import { Modal, Form, Input, Table, InputNumber, Space } from 'antd';

interface GhiNhanMuonTraFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  record: MuonDo.IYeuCauMuon;
  loai: 'MUON' | 'TRA';
}

const GhiNhanMuonTraForm: React.FC<GhiNhanMuonTraFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  record,
  loai,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [danhSachTra, setDanhSachTra] = useState<Array<{ idThietBi: string; soLuong: number }>>([]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (loai === 'TRA') {
        values.danhSachTra = danhSachTra;
      }
      
      await onSubmit(values);
      form.resetFields();
      setDanhSachTra([]);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setDanhSachTra([]);
    onCancel();
  };

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'tenThietBi',
      key: 'tenThietBi',
    },
    {
      title: 'Số lượng đã mượn',
      dataIndex: 'soLuongMuon',
      key: 'soLuongMuon',
      align: 'center' as const,
    },
  ];

  const columnsWithReturn = [
    ...columns,
    {
      title: 'Số lượng trả',
      key: 'soLuongTra',
      align: 'center' as const,
      render: (text: any, recordItem: MuonDo.IChiTietYeuCau) => (
        <InputNumber
          min={0}
          max={recordItem.soLuongMuon}
          defaultValue={recordItem.soLuongMuon}
          onChange={(value) => {
            const newDanhSachTra = [...danhSachTra];
            const index = newDanhSachTra.findIndex(item => item.idThietBi === recordItem.idThietBi);
            
            if (index >= 0) {
              newDanhSachTra[index].soLuong = value || 0;
            } else {
              newDanhSachTra.push({
                idThietBi: recordItem.idThietBi,
                soLuong: value || 0,
              });
            }
            
            setDanhSachTra(newDanhSachTra);
          }}
        />
      ),
    },
  ];

  return (
    <Modal
      title={loai === 'MUON' ? 'Ghi nhận mượn thiết bị' : 'Ghi nhận trả thiết bị'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Xác nhận"
      cancelText="Hủy"
      width={800}
    >
      <Form form={form} layout="vertical">
        <div style={{ marginBottom: 16 }}>
          <strong>Thông tin sinh viên:</strong>
          <div>Tên: {record.tenSinhVien} ({record.maSinhVien})</div>
          <div>Email: {record.email}</div>
          <div>Lớp: {record.lop}</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <strong>Danh sách thiết bị:</strong>
          <Table
            columns={loai === 'TRA' ? columnsWithReturn : columns}
            dataSource={record.danhSachThietBi}
            pagination={false}
            size="small"
            rowKey="idThietBi"
          />
        </div>

        <Form.Item label="Ghi chú" name="ghiChu">
          <Input.TextArea
            rows={3}
            placeholder="Nhập ghi chú (không bắt buộc)..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GhiNhanMuonTraForm;
