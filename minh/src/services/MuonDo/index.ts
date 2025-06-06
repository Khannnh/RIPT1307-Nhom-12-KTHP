
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

// API Yêu cầu mượn
export async function getDanhSachYeuCau(params?: any) {
  return axios.get(`${ip3}/yeu-cau-muon`, { params });
}

export async function getChiTietYeuCau(id: string) {
  return axios.get(`${ip3}/yeu-cau-muon/${id}`);
}

export async function duyetYeuCau(id: string, data: { trangThai: string; lyDoTuChoi?: string }) {
  return axios.put(`${ip3}/yeu-cau-muon/${id}/duyet`, data);
}

export async function ghiNhanMuon(id: string, data: { ghiChu?: string }) {
  return axios.put(`${ip3}/yeu-cau-muon/${id}/ghi-nhan-muon`, data);
}

export async function ghiNhanTra(id: string, data: { danhSachTra: Array<{ idThietBi: string; soLuong: number }>; ghiChu?: string }) {
  return axios.put(`${ip3}/yeu-cau-muon/${id}/ghi-nhan-tra`, data);
}

// API Thiết bị
export async function getDanhSachThietBi(params?: any) {
  return axios.get(`${ip3}/thiet-bi`, { params });
}

export async function getChiTietThietBi(id: string) {
  return axios.get(`${ip3}/thiet-bi/${id}`);
}

export async function taoThietBi(data: any) {
  return axios.post(`${ip3}/thiet-bi`, data);
}

export async function capNhatThietBi(id: string, data: any) {
  return axios.put(`${ip3}/thiet-bi/${id}`, data);
}

export async function xoaThietBi(id: string) {
  return axios.delete(`${ip3}/thiet-bi/${id}`);
}

export async function capNhatSoLuongThietBi(id: string, data: { soLuongTonKho: number }) {
  return axios.put(`${ip3}/thiet-bi/${id}/so-luong`, data);
}

// API Lịch sử
export async function getLichSuMuonTra(params?: any) {
  return axios.get(`${ip3}/lich-su-muon-tra`, { params });
}

// API Thống kê
export async function getThongKe(params?: any) {
  return axios.get(`${ip3}/thong-ke`, { params });
}
