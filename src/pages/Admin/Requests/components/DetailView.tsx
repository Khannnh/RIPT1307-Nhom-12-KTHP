import React from 'react';
import { Descriptions, Tag } from 'antd';
import type { YeuCau } from '@/services/QuanLyYeuCau/typing';
import moment from 'moment';

type DetailViewProps = {
  record: YeuCau;
};

const DetailView: React.FC<DetailViewProps> = ({ record }) => {
  const renderStatus = (trangThai: string) => {
    let color = 'default';
    if (trangThai === 'Đã duyệt') color = 'success';
    if (trangThai === 'Đã từ chối') color = 'error';
    if (trangThai === 'Chờ duyệt') color = 'processing';
    if (trangThai === 'Đã lấy') color = 'blue';
    if (trangThai === 'Đã trả') color = 'purple';
    return <Tag color={color}>{trangThai.toUpperCase()}</Tag>;
  }

  return (
    <Descriptions bordered column={1} labelStyle={{width: 150}}>
      <Descriptions.Item label="Người mượn">{record.nguoiMuon.ten}</Descriptions.Item>
      <Descriptions.Item label="Thiết bị">{record.thietBi.ten}</Descriptions.Item>
      <Descriptions.Item label="Số lượng">{record.soLuong}</Descriptions.Item>
      <Descriptions.Item label="Trạng thái">{renderStatus(record.trangThai)}</Descriptions.Item>
      <Descriptions.Item label="Ngày yêu cầu">{moment(record.ngayYeuCau).format('HH:mm DD/MM/YYYY')}</Descriptions.Item>
      <Descriptions.Item label="Ngày hẹn trả">{moment(record.ngayHenTra).format('HH:mm DD/MM/YYYY')}</Descriptions.Item>
      <Descriptions.Item label="Lý do mượn">{record.lyDo}</Descriptions.Item>
    </Descriptions>
  );
};

export default DetailView;