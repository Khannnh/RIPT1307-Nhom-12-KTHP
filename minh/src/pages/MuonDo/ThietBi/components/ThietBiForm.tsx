
import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (visible) {
      if (record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
  }, [visible, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
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
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={record ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          trangThai: ETrangThaiThietBi.HOAT_DONG,
          loaiThietBi: ELoaiThietBi.KHAC,
          soLuongTonKho: 0,
          soLuongDangMuon: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="maThietBi"
              label="Mã thiết bị"
              rules={[{ required: true, message: 'Vui lòng nhập mã thiết bị' }]}
            >
              <Input placeholder="Nhập mã thiết bị" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="tenThietBi"
              label="Tên thiết bị"
              rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}
            >
              <Input placeholder="Nhập tên thiết bị" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="loaiThietBi"
              label="Loại thiết bị"
              rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị' }]}
            >
              <Select placeholder="Chọn loại thiết bị" options={loaiThietBiOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="trangThai"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select placeholder="Chọn trạng thái" options={trangThaiOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="hangSanXuat" label="Hãng sản xuất">
              <Input placeholder="Nhập hãng sản xuất" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="model" label="Model">
              <Input placeholder="Nhập model" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="soLuongTonKho"
              label="Số lượng tồn kho"
              rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="donGia" label="Đơn giá">
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="viTri" label="Vị trí">
              <Input placeholder="Nhập vị trí" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="moTa" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Nhập mô tả thiết bị" />
        </Form.Item>

        <Form.Item name="ghiChu" label="Ghi chú">
          <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ThietBiForm;
