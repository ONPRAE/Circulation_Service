<template>
  <div class="q-py-md">
    <div class="q-gutter-md q-mb-md flex justify-end">
      <q-input
        v-model="searchQuery"
        label="Search by Product Name"
        debounce="300" 
        class="q-w-300" 
      />
    </div>
    <q-table
      title="Products"
      :rows="filteredProductRows"
      :columns="productColumns"
      row-key="product_id"
      flat
      bordered
    >
      <template v-slot:body-cell-image="props">
        <q-td :props="props">
          <img :src="props.row.image" alt="Product Image" style="width: 50px; height: 50px;" />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" @click="onEditProduct(props.row.product_id)" />
        </q-td>
      </template>
    </q-table>
    <q-spinner v-if="loading" />
    <q-alert v-if="error" type="negative" :message="error" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Define columns for the product table
const productColumns = ref([
  { name: 'product_id', align: 'center', label: 'Product ID', field: 'product_id', sortable: true },
  { name: 'productname', align: 'left', label: 'Product Name', field: 'productname', sortable: true },
  { name: 'product_type', align: 'right', label: 'Type', field: 'product_type', sortable: true },
  { name: 'stock', align: 'right', label: 'Stock', field: 'stock', sortable: true },
  { name: 'image', align: 'center', label: 'Image', field: 'image', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false },
]);

const productRows = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref(''); // Search query

// Computed property to filter products based on the search query
const filteredProductRows = computed(() => {
  if (!searchQuery.value) {
    return productRows.value; // Return all products if there's no search query
  }
  const query = searchQuery.value.toLowerCase();
  return productRows.value.filter(product =>
    product.productname.toLowerCase().includes(query)
  );
});

// Fetch all products from the backend
const fetchProducts = () => {
  loading.value = true;
  fetch('http://localhost:8800/api/v1/products') // Ensure this endpoint returns all products
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(result => {
      productRows.value = result; // Assign the result to productRows
      loading.value = false; // Loading complete
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      error.value = 'Failed to load products.'; // Set error message
      loading.value = false; // Loading complete
    });
};

// Handle editing of a product
const onEditProduct = (productId) => {
  // Implement your edit product logic here
  console.log('Editing product:', productId);
};

// Call fetchProducts to load all products on component mount
fetchProducts();
</script>
