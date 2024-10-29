<template>
    <div class="q-pa-md">
      <q-table
        title="Products"
        :rows="productRows"
        :columns="productColumns"
        row-key="id"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn icon="edit" @click="onEditProduct(props.row.product_id)" />
            <q-btn icon="delete" @click="onDeleteProduct(props.row.product_id)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import router from '@/router';
  
  const productColumns = ref([
    { name: 'product_id', align: 'center', label: 'Product ID', field: 'product_id', sortable: true },
    { name: 'productname', align: 'left', label: 'Product Name', field: 'productname', sortable: true },
    { name: 'stock', align: 'right', label: 'Stock', field: 'stock', sortable: true },
    { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false }, 
  ]);
  const productRows = ref([]);
  
  const fetchProducts = () => {
    fetch('http://localhost:8800/api/v1/products')
      .then(res => res.json())
      .then(result => {
        productRows.value = result;
      })
      .catch(error => console.error('Error fetching products:', error));
  };
  fetchProducts();
  
  const onEditProduct = (id) => {
    router.push(`/produpdate/${id}`);
  };
  
  const onDeleteProduct = (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const requestOptions = {
      method: 'Add',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    fetch(`http://localhost:8800/api/v1/products/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        alert(result.message);
        fetchProducts(); 
      })
      .catch(error => console.error('Error deleting Product:', error));
  };
  
  </script>
  