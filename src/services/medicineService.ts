//lib/services/medicineService.ts
import api from '@/lib/api';

export interface Medicine {
  id: number;
  medicine_Name: string;
  selling_Price: number;
  quantity_In_Stock: number;
  expiry_Date: string;
  supplier: string;
  category: string;
}

export const getMedicines = () => api.get<Medicine[]>('/Medicines');
export const addMedicine = (data: any) => api.post('/Medicines', data);
export const deleteMedicine = (id: number) => api.delete(`/Medicines/${id}`);
export const updateMedicine = (id: number, data: any) => api.put(`/Medicines/${id}`, data);