// stores/sale.ts
import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const useSaleStore = defineStore('sale', {
  state: () => ({
    sales: [],
    currentSale: null,
    dailyReport: null,
    topProducts: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async createSale(saleData) {
      try {
        this.loading = true;
        const response = await axios.post(`${API_URL}/sales`, saleData);
        this.currentSale = response.data.sale;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'ມີຂໍ້ຜິດພາດໃນການບັນທຶກການຂາຍ';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getSales(filters = {}) {
      try {
        this.loading = true;
        const response = await axios.get(`${API_URL}/sales`, { params: filters });
        this.sales = response.data.sales;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການຂາຍ';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getSaleDetails(id) {
      try {
        this.loading = true;
        const response = await axios.get(`${API_URL}/sales/${id}`);
        this.currentSale = response.data.sale;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຍລະອຽດການຂາຍ';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getDailyReport(date) {
      try {
        this.loading = true;
        const response = await axios.get(`${API_URL}/sales/daily-report`, {
          params: { date }
        });
        this.dailyReport = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'ມີຂໍ້ຜິດພາດໃນການດຶງລາຍງານປະຈຳວັນ';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getTopSellingProducts(limit = 10) {
      try {
        this.loading = true;
        const response = await axios.get(`${API_URL}/sales/top-selling`, {
          params: { limit }
        });
        this.topProducts = response.data.products;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'ມີຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າຂາຍດີ';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    clearCurrentSale() {
      this.currentSale = null;
    },
    
    clearError() {
      this.error = null;
    }
  }
});