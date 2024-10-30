<template>
    <q-page padding>
      <q-card>
        <q-card-section>
          <div class="text-h6">Product Report</div>
        </q-card-section>
  
        <q-card-section>
          <q-table
            title="Products"
            :rows="productRows"
            :columns="productColumns"
            row-key="product_id"
          />
        </q-card-section>
  
        <q-card-actions align="right">
          <q-btn color="primary" label="Download as PDF" @click="downloadPDF" />
          <q-btn color="secondary" label="Download as DOC" @click="downloadDOC" />
        </q-card-actions>
      </q-card>
    </q-page>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
  import { saveAs } from 'file-saver';
  import axios from 'axios';
  
  // Define columns for the product table
  const productColumns = ref([
    { name: 'product_id', label: 'Product ID', field: 'product_id', align: 'center' },
    { name: 'product_name', label: 'Product Name', field: 'product_name', align: 'left' },
    { name: 'product_type', label: 'Type', field: 'product_type', align: 'left' },
    { name: 'stock', label: 'Stock', field: 'stock', align: 'right' },
    { name: 'image', label: 'Image', field: 'image', align: 'center' },
  ]);
  
  const productRows = ref([]);
  
  // Fetch products from the backend
  const fetchProducts = () => {
    axios.get('http://localhost:8800/api/v1/products')
      .then((response) => {
        productRows.value = response.data;
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };
  
  // Call the fetch function when the component is mounted
  onMounted(fetchProducts);
  
  // Download PDF report
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Product Report", 14, 10);
    doc.autoTable({
      head: [productColumns.value.map(col => col.label)],
      body: productRows.value.map(row => [
        row.product_id,
        row.product_name,
        row.product_type,
        row.stock,
        row.image || 'N/A', // Display 'N/A' if no image
      ]),
    });
    doc.save("Product_Report.pdf");
  };
  
  // Download DOC report
  const downloadDOC = () => {
    const docContent = `
      <h1>Product Report</h1>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            ${productColumns.value.map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${productRows.value.map(row => `
            <tr>
              <td>${row.product_id}</td>
              <td>${row.product_name}</td>
              <td>${row.product_type}</td>
              <td>${row.stock}</td>
              <td>${row.image || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  
    const blob = htmlDocx.asBlob(docContent);
    saveAs(blob, 'Product_Report.doc');
  };
  </script>
  
  <style scoped>
  .q-card {
    max-width: 800px;
    margin: auto;
  }
  </style>
  