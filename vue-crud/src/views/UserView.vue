<template>
  <q-page class="q-pa-lg flex flex-center">
    <div style="width: 100%; max-width: 1200px; margin: 0 auto;">

      <!-- ย้ายคำว่า "อุปกรณ์" ไปทางซ้าย -->
      <div class="text-h5 q-mb-md" style="text-align: left;">
        อุปกรณ์
      </div>

      <q-card flat bordered>

        <!-- ส่วนฟิลเตอร์ -->
        <q-card-section>
          <div class="q-gutter-md row q-col-gutter-md q-col-align-stretch justify-center">
            <q-select
              v-model="selectedType"
              :options="deviceTypes"
              label="Type"
              filled
              class="col-3"
              dense
            />
            <q-option-group
              v-model="selectedStatus"
              :options="statusOptions"
              type="radio"
              inline
              label="Status"
              class="col-3"
            />

            <!-- เพิ่มช่องค้นหา -->
            <q-input
              v-model="searchQuery"
              placeholder="ค้นหา..."
              dense
              filled
              class="col-3"
            />

            <!-- ปุ่ม Search -->
            <q-btn 
              label="Search" 
              color="green" 
              @click="filterDevices" 
              dense
              style="width: 80px; padding-top: 4px; padding-bottom: 4px; padding-left: 12px; padding-right: 12px;"
            ></q-btn>
          </div>
        </q-card-section>

        <!-- ตารางแสดงข้อมูล -->
        <q-card-section>
          <q-table
            title="Products"
            :rows="filteredProductRows"
            :columns="productColumns"
            row-key="product_id"
          >
            <!-- ช่องการกระทำ เช่น แก้ไข/ลบ -->
            <template v-slot:body-cell-actions="props">
              <q-td align="center">
                <q-btn
                  flat
                  round
                  dense
                  icon="play_arrow"
                  style="background-color: #00E676; color: white"
                  @click="navigateToBorrowView(props.row.product_id)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>

      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();



// กำหนดข้อมูลคอลัมน์ของตาราง (ข้อมูลตัวอย่าง)
const productColumns = ref([
  { name: 'product_id', align: 'center', label: 'Product ID', field: 'product_id', sortable: true },
  { name: 'product_name', align: 'left', label: 'Product Name', field: 'product_name', sortable: true },
  { name: 'product_type', align: 'left', label: 'Product Type', field: 'product_type', sortable: true },
  { name: 'stock', align: 'right', label: 'Stock', field: 'stock', sortable: true },
  { name: 'actions', align: 'center', label: 'Actions', field: 'actions', sortable: false }, 
]);
const productRows = ref([]);

// ฟังก์ชันสำหรับดึงข้อมูลผลิตภัณฑ์
const fetchProducts = () => {
  fetch('http://localhost:8800/api/v1/products')
    .then(res => res.json())
    .then(result => {
      productRows.value = result;
    })
    .catch(error => console.error('Error fetching products:', error));
};
fetchProducts();

// ฟังก์ชันการนำทางไปยัง BorrowView
const navigateToBorrowView = (id) => {
  router.push('/borrow/'+ id);
};
// ฟิลเตอร์ข้อมูล
const deviceTypes = ref(['ToolKids', 'Projector', 'Mouse', 'Laptop', 'Keyboard', 'Speaker', 'Monitor']);
const statusOptions = ref([
  { label: 'Available', value: 'Available' },
  { label: 'Unavailable', value: 'Unavailable' }
]);

const selectedType = ref('');
const selectedStatus = ref('Available');

// ข้อมูลสำหรับช่องค้นหา
const searchQuery = ref('');

// กรองสินค้าตามเงื่อนไขที่เลือก
const filteredProductRows = computed(() => {
  return productRows.value.filter(product => {
    // เงื่อนไขการค้นหาตามประเภท
    const matchesType = selectedType.value ? product.product_type === selectedType.value : true;
    // เงื่อนไขการค้นหาตามสถานะ
    const matchesStatus = selectedStatus.value === 'Available' ? product.stock > 0 : product.stock <= 0;
    // เงื่อนไขการค้นหาตามคำค้นหา
    const matchesQuery = product.product_name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesType && matchesStatus && matchesQuery;
  });
});

// ฟังก์ชันค้นหา
const filterDevices = () => {
  console.log("ค้นหาด้วยคำว่า:", searchQuery.value);
};
</script>
