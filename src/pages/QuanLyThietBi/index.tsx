import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Image,
  Input,
  Select,
  Row,
  Col,
  Popconfirm,
  Tooltip,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import type { ConnectState } from '@/models/connect';
import type { ThietBiModelState } from '@/models/quanlythietbi/thietbi'; 
import { ThietBi, ThietBiParams } from '@/services/QuanLyThietBi/typing';
import { TRANG_THAI_THIET_BI, COLOR_TRANG_THAI } from '@/services/QuanLyThietBi/constant';
import ThietBiForm from './components/Form';

const { Search } = Input;
const { Option } = Select;

interface Props {
  dispatch: Dispatch;
  thietbi: ThietBiModelState; 
  loading: boolean;
}

const QuanLyThietBi: React.FC<Props> = ({ dispatch, thietbi, loading }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [editData, setEditData] = useState<ThietBi | null>(null);
  const [searchParams, setSearchParams] = useState<ThietBiParams>({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    dispatch({ type: 'thietbi/fetchList', payload: searchParams });
    dispatch({ type: 'thietbi/fetchDanhMuc' });
  }, [dispatch, searchParams]);

  const handleSearch = (value: string) => {
    setSearchParams({
      ...searchParams,
      ten: value,
      current: 1,
    });
  };

  const handleFilterChange = (field: string, value: any) => {
    setSearchParams({
      ...searchParams,
      [field]: value,
      current: 1,
    });
  };

  const handleAdd = () => {
    setEditData(null);
    setFormVisible(true);
  };

  const handleEdit = (record: ThietBi) => {
    setEditData(record);
    setFormVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch({
      type: 'thietbi/delete',
      payload: id,
    });
  };

  const handleFormSubmit = (values: any) => {
    if (editData) {
      dispatch({
        type: 'thietbi/update',
        payload: {
          id: editData.id,
          data: values,
        },
        callback: () => {
          setFormVisible(false);
        },
      });
    } else {
      dispatch({
        type: 'thietbi/create',
        payload: values,
        callback: () => {
          setFormVisible(false);
        },
      });
    }
  };

  const handleTableChange = (pagination: any) => {
    setSearchParams({
      ...searchParams,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => {
        return (searchParams.current! - 1) * searchParams.pageSize! + index + 1;
      },
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'hinhAnh',
      key: 'hinhAnh',
      width: 100,
      render: (url: string, record: ThietBi) => (
        <Image
          width={60}
          height={60}
          src={url}
          alt={record.ten}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN..."
        />
      ),
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'ten',
      key: 'ten',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Danh mục',
      dataIndex: 'danhMuc',
      key: 'danhMuc',
      render: (danhMucId: string) => {
        const danhMuc = (thietbi.danhMucList || []).find((item: any) => item.id === danhMucId);
        return danhMuc?.ten || '-';
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
      width: 100,
      align: 'center' as const,
    },
    {
      title: 'Còn lại',
      dataIndex: 'soLuongConLai',
      key: 'soLuongConLai',
      width: 100,
      align: 'center' as const,
      render: (value: number, record: ThietBi) => (
        <span style={{ color: value === 0 ? '#ff4d4f' : undefined }}>
          {value !== undefined ? value : record.soLuong} {/* Sửa để hiển thị soLuong nếu soLuongConLai là undefined */}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (status: keyof typeof TRANG_THAI_THIET_BI) => (
        <Tag color={COLOR_TRANG_THAI[status] || 'default'}>
          {TRANG_THAI_THIET_BI[status] || status}
        </Tag>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      key: 'moTa',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_: any, record: ThietBi) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thiết bị này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button type="primary" danger ghost size="small" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const tableData = Array.isArray(thietbi.list) ? thietbi.list : [];

  return (
    <PageContainer
      title="Quản lý danh sách thiết bị"
      extra={[
        <Button key="refresh" icon={<ReloadOutlined />} onClick={() => {
            dispatch({ type: 'thietbi/fetchList', payload: searchParams });
            dispatch({ type: 'thietbi/fetchDanhMuc' });
        }}>
          Làm mới
        </Button>,
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm thiết bị
        </Button>,
      ]}
    >
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm theo tên thiết bị"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo danh mục"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => handleFilterChange('danhMuc', value)}
            >
              {/* SỬA Ở ĐÂY: Thêm fallback || [] */}
              {(thietbi.danhMucList || []).map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.ten}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => handleFilterChange('trangThai', value)}
            >
              {Object.entries(TRANG_THAI_THIET_BI).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          loading={loading}
          pagination={{
            current: searchParams.current,
            pageSize: searchParams.pageSize,
            total: thietbi.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} thiết bị`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      <ThietBiForm
        visible={formVisible}
        editData={editData}
        danhMucList={thietbi.danhMucList || []}
        onCancel={() => setFormVisible(false)}
        onOk={handleFormSubmit}
        loading={loading}
      />
    </PageContainer>
  );
};

export default connect(({ thietbi, loading }: ConnectState) => ({
  thietbi: thietbi || { list: [], total: 0, danhMucList: [] },
  loading: loading?.models?.thietbi || false,
}))(QuanLyThietBi);