import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { ThietBi, DanhMucThietBi } from '@/services/QuanLyThietBi/typing';
import { TRANG_THAI_THIET_BI } from '@/services/QuanLyThietBi/constant';

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  loading?: boolean;
  editData?: ThietBi | null;
  danhMucList: DanhMucThietBi[];
}

const ThietBiForm: React.FC<Props> = ({
  visible,
  onCancel,
  onOk,
  loading = false,
  editData,
  danhMucList,
}) => {
  const [form] = Form.useForm();
  const [imageLoading, setImageLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string>('');

  useEffect(() => {
    if (visible) {
      if (editData) {
        form.setFieldsValue({
          ...editData,
        });
        setImageUrl(editData.hinhAnh);
      } else {
        form.resetFields();
        setImageUrl('');
      }
    }
  }, [visible, editData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk({
        ...values,
        hinhAnh: imageUrl,
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ có thể upload file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setImageLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setImageLoading(false);
      setImageUrl(info.file.response?.url || '');
    }
  };

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title={editData ? 'Sửa thiết bị' : 'Thêm thiết bị mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          soLuong: 1,
          trangThai: 'AVAILABLE',
        }}
      >
        <Form.Item
          name="ten"
          label="Tên thiết bị"
          rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
        >
          <Input placeholder="Nhập tên thiết bị" />
        </Form.Item>

        <Form.Item
          name="danhMuc"
          label="Danh mục"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select placeholder="Chọn danh mục">
            {danhMucList.map(item => (
              <Option key={item.id} value={item.id}>
                {item.ten}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="soLuong"
          label="Số lượng"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <InputNumber min={1} placeholder="Nhập số lượng" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="moTa" label="Mô tả">
          <TextArea rows={3} placeholder="Nhập mô tả thiết bị" />
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>

        {editData && (
          <Form.Item
            name="trangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              {Object.entries(TRANG_THAI_THIET_BI).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ThietBiForm;