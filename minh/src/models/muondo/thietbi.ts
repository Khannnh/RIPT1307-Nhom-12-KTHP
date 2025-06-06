
import { capNhatSoLuongThietBi } from '@/services/MuonDo';
import useInitModel from '@/hooks/useInitModel';
import { message } from 'antd';

export default () => {
  const objInit = useInitModel<MuonDo.IThietBi>('/thiet-bi');

  const capNhatSoLuongModel = async (id: string, soLuongTonKho: number) => {
    try {
      await capNhatSoLuongThietBi(id, { soLuongTonKho });
      message.success('Cập nhật số lượng thành công');
      objInit.getModel();
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật số lượng');
    }
  };

  return {
    ...objInit,
    capNhatSoLuongModel,
  };
};
