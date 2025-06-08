import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import type { ThietBi } from '@/services/QuanLyThietBi/typing';

const { TextArea } = Input;
const { Option } = Select;

type FormThietBiProps = {
  form: any;
  record?: ThietBi;
};

const FormThietBi: React.FC<FormThietBiProps> = ({ form, record }) => {
  return (
    <Form form={form} layout="vertical" initialValues={record}>
      <Form.Item name="tenThietBi" label="Tên thiết bị" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="loaiThietBi" label="Loại thiết bị" rules={[{ required: true }]}>
        <Input placeholder="VD: Âm thanh, Trình chiếu,..." />
      </Form.Item>
      <Form.Item name="soLuongTong" label="Tổng số lượng" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="tinhTrang" label="Tình trạng" initialValue="Sẵn sàng">
        <Select>
          <Option value="Sẵn sàng">Sẵn sàng</Option>
          <Option value="Hết hàng">Hết hàng</Option>
          <Option value="Bảo trì">Bảo trì</Option>
        </Select>
      </Form.Item>
      <Form.Item name="moTa" label="Mô tả">
        <TextArea rows={4} />
      </Form.Item>
    </Form>
  );
};

export default FormThietBi;