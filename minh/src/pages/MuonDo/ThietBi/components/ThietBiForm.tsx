
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col } from 'antd';
import { ETrangThaiThietBi, ELoaiThietBi } from '@/services/MuonDo/constant';

interface ThietBiFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  record?: MuonDo.IThietBi | null;
}

const ThietBiForm: React.FC<ThietBiFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  record,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue(record);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const loaiThietBiOptions = [
    { label: 'Điện tử', value: ELoaiThietBi.DIEN_TU },
    { label: 'Văn phòng phẩm', value: ELoaiThietBi.VAN_PHONG_PHAM },
    { label: 'Thể thao', value: ELoaiThietBi.THE_THAO },
    { label: 'Khác', value: ELoaiThietBi.KHAC },
  ];

  const trangThaiOptions = [
    { label: 'Hoạt động', value: ETrangThaiThietBi.HOAT_DONG },
    { label: 'Bảo trì', value: ETrangThaiThietBi.BAO_TRI },
    { label: 'Hỏng', value: ETrangThaiThietBi.HONG },
  ];

  return (
    <Modal
      title={record ? 'Sửa thiết bị' : 'Thêm thiết bị mới'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={record ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          trangThai: ETrangThaiThietBi.HOAT_DONG,
          loaiThietBi: ELoaiThietBi.DIEN_TU,
          soLuongTonKho: 1,
          soLuongDangMuon: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Mã thiết bị"
              name="maThietBi"
              rules={[{ required: true, message: 'Vui lòng nhập mã thiết bị!' }]}
            >
              <Input placeholder="Nhập mã thiết bị" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tên thiết bị"
              name="tenThietBi"
              rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
            >
              <Input placeholder="Nhập tên thiết bị" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Loại thiết bị"
              name="loaiThietBi"
              rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị!' }]}
            >
              <Select placeholder="Chọn loại thiết bị" options={loaiThietBiOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="trangThai"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái" options={trangThaiOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Hãng sản xuất" name="hangSanXuat">
              <Input placeholder="Nhập hãng sản xuất" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Model" name="model">
              <Input placeholder="Nhập model" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Số lượng tồn kho"
              name="soLuongTonKho"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Đơn giá" name="donGia">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Vị trí" name="viTri">
              <Input placeholder="Nhập vị trí" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả" name="moTa">
          <Input.TextArea rows={3} placeholder="Nhập mô tả thiết bị" />
        </Form.Item>

        <Form.Item label="Ghi chú" name="ghiChu">
          <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThietBiForm;
