
import { getDanhSachThietBi, getChiTietThietBi, taoThietBi, capNhatThietBi, xoaThietBi, capNhatSoLuongThietBi } from '@/services/MuonDo';
import useInitModel from '@/hooks/useInitModel';
import { message } from 'antd';

export default () => {
  const objInit = useInitModel<MuonDo.IThietBi>({
    getAllService: getDanhSachThietBi,
    getByIdService: getChiTietThietBi,
    createService: taoThietBi,
    updateService: capNhatThietBi,
    deleteService: xoaThietBi,
  });

  const capNhatSoLuongModel = async (id: string, soLuongTonKho: number) => {
    try {
      await capNhatSoLuongThietBi(id, { soLuongTonKho });
      message.success('Cập nhật số lượng thành công');
      objInit.getData();
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật số lượng');
    }
  };

  return {
    ...objInit,
    capNhatSoLuongModel,
  };
};
