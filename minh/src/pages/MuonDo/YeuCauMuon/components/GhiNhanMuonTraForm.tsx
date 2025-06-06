
import React from 'react';
import { Modal, Form, Input, Table, InputNumber } from 'antd';

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
  const [danhSachTra, setDanhSachTra] = React.useState<Array<{ idThietBi: string; tenThietBi: string; soLuongMuon: number; soLuongTra: number }>>([]);

  React.useEffect(() => {
    if (loai === 'TRA' && record.danhSachThietBi) {
      setDanhSachTra(
        record.danhSachThietBi.map(item => ({
          idThietBi: item.idThietBi,
          tenThietBi: item.tenThietBi,
          soLuongMuon: item.soLuongMuon,
          soLuongTra: item.soLuongMuon,
        }))
      );
    }
  }, [loai, record]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (loai === 'TRA') {
        values.danhSachTra = danhSachTra.map(item => ({
          idThietBi: item.idThietBi,
          soLuong: item.soLuongTra,
        }));
      }
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columnsTraDo = [
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
    {
      title: 'Số lượng trả',
      key: 'soLuongTra',
      align: 'center' as const,
      render: (text: any, record: any, index: number) => (
        <InputNumber
          min={0}
          max={record.soLuongMuon}
          value={record.soLuongTra}
          onChange={(value) => {
            const newDanhSach = [...danhSachTra];
            newDanhSach[index].soLuongTra = value || 0;
            setDanhSachTra(newDanhSach);
          }}
        />
      ),
    },
  ];

  return (
    <Modal
      title={loai === 'MUON' ? 'Ghi nhận mượn đồ' : 'Ghi nhận trả đồ'}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Xác nhận"
      cancelText="Hủy"
      width={loai === 'TRA' ? 800 : 600}
    >
      <Form form={form} layout="vertical">
        {loai === 'TRA' && (
          <div style={{ marginBottom: 16 }}>
            <h4>Danh sách thiết bị trả:</h4>
            <Table
              columns={columnsTraDo}
              dataSource={danhSachTra}
              pagination={false}
              size="small"
              rowKey="idThietBi"
            />
          </div>
        )}

        <Form.Item name="ghiChu" label="Ghi chú">
          <Input.TextArea rows={4} placeholder="Nhập ghi chú..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GhiNhanMuonTraForm;
