<template>
    <v-col cols="12">
      <v-row>
        <v-col cols="12" md="9">
          <v-card flat class="rounded-lg mb-4">
            <v-row>
              <v-col class="12" md="4">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-btn
                      color="#CFD8DC"
                      flat
                      class="rounded-lg ma-2 d-flex justify-start"
                      block
                    >
                      <p>ສະແດງຍອດຂາຍ</p>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="d-flex justify-end align-center">
                      <v-btn icon="mdi-cart-percent" size="50" color="#CFD8DC"></v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="12" md="3">
                <v-select
                  label="Filter by Type"
                  :items="types"
                  v-model="selectedType"
                  @change="filterByType"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  label="Search by Barcode"
                  v-model="searchBarcode"
                  @keyup.enter="selectByBarcode"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
  
        <v-col class="12" md="3">
          <v-card>
            <v-row>
              <v-col cols="12">
                <h3>ລາຍການທີ່ເລືອກ</h3>
                <v-list>
                  <v-list-item v-for="item in selectedItems" :key="item.id">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle>
                        ຈຳນວນ: {{ item.quantity }} | ລາຄາ: {{ item.price }} {{ item.currencode }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-btn @click="increaseQuantity(item)" color="green">+</v-btn>
                    <v-btn @click="decreaseQuantity(item)" color="red">-</v-btn>
                  </v-list-item>
                </v-list>
                <p>VAT: {{ vat }} k</p>
                <p>ລາຄາລວມ: {{ totalPriceWithVat }} k</p>
                <v-btn @click="generateBill" color="primary">ອອກໃບບິນ</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12" md="9">
          <v-row>
            <v-col cols="12" md="3" v-for="item in filteredData" :key="item.id">
              <div>
                <v-card flat class="rounded-lg">
                  <v-chip class="ma-2" label> {{ item.stem }}</v-chip> <br />
                  <v-container class="d-flex justify-center">
                    <v-img
                      :src="item.URL"
                      width="100"
                      height="100"
                      class="d-flex justify-center"
                      min-height="10vh"
                      min-width="100%"
                    ></v-img>
                  </v-container>
                  <p>ຊື່ຢາ: {{ item.name }}</p>
                  <p>ລາຄາ: {{ item.price }} {{ item.currencode }}</p>
                  <v-btn @click="selectItem(item)" color="green">Select</v-btn>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3"></v-col>
      </v-row>
    </v-col>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import Swal from 'sweetalert2';
  
  const data = ref([
    {
      id: 1,
      type: "ດີເຈັບຫົວ",
      barcode: "6786543668",
      name: "ດີຫວັດລາວ",
      price: 15000,
      stem: "100",
      currencode: "LAK",
      URL: "https://opcpharma.com/wp-content/uploads/2023/03/Para-OPC_80mg_Hop-2-goi.webp",
    },
    {
      id: 2,
      type: "ດີກະເພາະ",
      barcode: "123456789",
      name: "ດີຫວັດລາວ",
      price: 10000,
      stem: "100",
      currencode: "LAK",
      URL: "https://opcpharma.com/wp-content/uploads/2023/03/Para-OPC_80mg_Hop-2-goi.webp",
    },
    // Add more products as needed
  ]);
  
  const selectedItems = ref([]);
  const selectedType = ref('');
  const searchBarcode = ref('');
  
  const types = computed(() => {
    return [...new Set(data.value.map(item => item.type))];
  });
  
  const filteredData = computed(() => {
    let filtered = data.value;
    if (selectedType.value) {
      filtered = filtered.filter(item => item.type === selectedType.value);
    }
    if (searchBarcode.value) {
      filtered = filtered.filter(item => item.barcode.includes(searchBarcode.value));
    }
    return filtered;
  });
  
  const totalPrice = ref(0);
  const vat = ref(0);
  const totalPriceWithVat = ref(0);
  
  const calculateTotalPrice = () => {
    totalPrice.value = selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    vat.value = totalPrice.value * 0.1; // Assuming VAT is 10%
    totalPriceWithVat.value = totalPrice.value + vat.value;
  };
  
  const selectItem = (item) => {
    const existingItem = selectedItems.value.find(selected => selected.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      selectedItems.value.push({ ...item, quantity: 1 });
    }
    calculateTotalPrice();
  };
  
  const increaseQuantity = (item) => {
    const existingItem = selectedItems.value.find(selected => selected.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
      calculateTotalPrice();
    }
  };
  
  const decreaseQuantity = (item) => {
    const existingItem = selectedItems.value.find(selected => selected.id === item.id);
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity -= 1;
      calculateTotalPrice();
    } else if (existingItem && existingItem.quantity === 1) {
      selectedItems.value = selectedItems.value.filter(selected => selected.id !== item.id);
      calculateTotalPrice();
    }
  };
  
  const selectByBarcode = () => {
    const item = data.value.find(item => item.barcode === searchBarcode.value);
    if (item) {
      selectItem(item);
      searchBarcode.value = ''; // Clear the search field after selection
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Not Found',
        text: 'No item found with the given barcode',
      });
    }
  };
  
  const generateBill = () => {
    let billContent = `
      <style>
        .bill-container {
          font-family: Arial, sans-serif;
          text-align: left;
        }
        .bill-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .bill-items {
          width: 100%;
          border-collapse: collapse;
        }
        .bill-items th, .bill-items td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .bill-items th {
          background-color: #f2f2f2;
          text-align: center;
        }
        .bill-footer {
          margin-top: 20px;
          text-align: right;
        }
      </style>
      <div class="bill-container">
        <div class="bill-header">
          <h3>ບິນຂາຍ</h3>
        </div>
        <table class="bill-items">
          <thead>
            <tr>
              <th>ຊື່ສິນຄ້າ</th>
              <th>ຈຳນວນ</th>
              <th>ລາຄາ</th>
            </tr>
          </thead>
          <tbody>
    `;
    selectedItems.value.forEach(item => {
      billContent += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price * item.quantity} ${item.currencode}</td>
        </tr>
      `;
    });
    billContent += `
          </tbody>
        </table>
        <div class="bill-footer">
          <p>VAT: ${vat.value} k</p>
          <p>ລາຄາລວມ: ${totalPriceWithVat.value} k</p>
        </div>
      </div>
    `;
  
    Swal.fire({
      title: 'ບິນຂາຍ',
      html: billContent,
      showCancelButton: true,
      confirmButtonText: 'Print',
      cancelButtonText: 'Close',
      width: 600,
      padding: '3em',
      background: '#fff',
      backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
      `
    }).then((result) => {
      if (result.isConfirmed) {
        window.print();
      }
    });
  };
  
  // Initial calculation
  calculateTotalPrice();
  </script>