
import { getDanhSachYeuCau, getChiTietYeuCau, duyetYeuCau, ghiNhanMuon, ghiNhanTra } from '@/services/MuonDo';
import useInitModel from '@/hooks/useInitModel';
import { message } from 'antd';

export default () => {
  const objInit = useInitModel<MuonDo.IYeuCauMuon>('muon-do');

  const duyetYeuCauModel = async (id: string, data: { trangThai: string; lyDoTuChoi?: string }) => {
    try {
      await duyetYeuCau(id, data);
      message.success('Duyệt yêu cầu thành công');
      objInit.getData();
    } catch (error) {
      message.error('Có lỗi xảy ra khi duyệt yêu cầu');
      objInit.getTableData();
  };

  const ghiNhanMuonModel = async (id: string, data: { ghiChu?: string }) => {
    try {
      await ghiNhanMuon(id, data);
      message.success('Ghi nhận mượn thành công');
      objInit.getData();
    } catch (error) {
      message.error('Có lỗi xảy ra khi ghi nhận mượn');
    }
  };

  const ghiNhanTraModel = async (id: string, data: { danhSachTra: Array<{ idThietBi: string; soLuong: number }>; ghiChu?: string }) => {
    try {
      await ghiNhanTra(id, data);
      message.success('Ghi nhận trả thành công');
      objInit.getData();
    } catch (error) {
      message.error('Có lỗi xảy ra khi ghi nhận trả');
    }
  };

  return {
    ...objInit,
    duyetYeuCauModel,
    ghiNhanMuonModel,
    ghiNhanTraModel,
  };
};
