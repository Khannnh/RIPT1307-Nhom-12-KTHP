import React from 'react';
import TableBase from '@/components/Table';
import { Tag } from 'antd';
import FormThietBi from './components/Form';
import type { ThietBi } from '@/services/QuanLyThietBi/typing';

const EquipmentsPage: React.FC = () => {
  const columns: any = [
    { title: 'STT', dataIndex: 'index', valueType: 'indexBorder', width: 80 },
    { title: 'Tên thiết bị', dataIndex: 'tenThietBi', search: true, ellipsis: true, width: 250 },
    { title: 'Loại thiết bị', dataIndex: 'loaiThietBi', width: 150 },
    { title: 'Tổng số lượng', dataIndex: 'soLuongTong', align: 'center', width: 120 },
    { title: 'Đã cho mượn', dataIndex: 'soLuongDaChoMuon', align: 'center', width: 120 },
    { title: 'Còn lại', dataIndex: 'soLuongConLai', align: 'center', width: 120 },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      width: 120,
      render: (tinhTrang: string) => (
        <Tag color={tinhTrang === 'Sẵn sàng' ? 'green' : tinhTrang === 'Hết hàng' ? 'orange' : 'red'}>
          {tinhTrang.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Tác vụ',
      dataIndex: 'operation',
      valueType: 'option',
      width: 150,
      render: (_: any, record: ThietBi, __: any, action: any) => [
        <a key="edit" onClick={() => action.edit(record)}>Sửa</a>,
        <a key="delete" onClick={() => action.delete(record)}>Xóa</a>,
      ],
    },
  ];

  return (
    <TableBase
      title="Quản lý thiết bị"
      modelName="quanLyThietBi"
      columns={columns}
      Form={FormThietBi as any}
      formType="Drawer"
    />
  );
};

export default EquipmentsPage;