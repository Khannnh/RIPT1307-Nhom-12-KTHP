import request from '@/utils/axios';
import { ThietBi, ThietBiParams, ThietBiForm, DanhMucThietBi } from './typing';

// API endpoints
const API_ENDPOINTS = {
  THIET_BI: '/api/thiet-bi',
  DANH_MUC: '/api/danh-muc-thiet-bi',
};

// Thiết bị APIs
export async function getThietBiList(params: ThietBiParams) {
  return request.get(API_ENDPOINTS.THIET_BI, { params });
}

export async function getThietBiDetail(id: string) {
  return request.get(`${API_ENDPOINTS.THIET_BI}/${id}`);
}

export async function createThietBi(data: ThietBiForm) {
  return request.post(API_ENDPOINTS.THIET_BI, data);
}

export async function updateThietBi(id: string, data: ThietBiForm) {
  return request.put(`${API_ENDPOINTS.THIET_BI}/${id}`, data);
}

export async function deleteThietBi(id: string) {
  return request.delete(`${API_ENDPOINTS.THIET_BI}/${id}`);
}

// Danh mục APIs
export async function getDanhMucList() {
  return request.get(API_ENDPOINTS.DANH_MUC);
}

export async function createDanhMuc(data: Partial<DanhMucThietBi>) {
  return request.post(API_ENDPOINTS.DANH_MUC, data);
}

export async function updateDanhMuc(id: string, data: Partial<DanhMucThietBi>) {
  return request.put(`${API_ENDPOINTS.DANH_MUC}/${id}`, data);
}

export async function deleteDanhMuc(id: string) {
  return request.delete(`${API_ENDPOINTS.DANH_MUC}/${id}`);
}