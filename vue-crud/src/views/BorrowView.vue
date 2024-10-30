<template> 
  <div class="content-container">
    <div class="content">
      <!-- ส่วนแสดงรายละเอียดอุปกรณ์ -->
      <q-card class="device-card q-mb-md">
        <q-card-section>
          <div class="header-section">
            <span class="title">รายการ</span>
            <span class="back-link" @click="goBack">กลับ</span>
          </div>
          <div class="device-id">ID<q-input
              dense
              filled
              v-model="id" readonly/></div>
          <q-separator class="q-mt-md" />

          <!-- รายละเอียดอุปกรณ์ในรูปแบบแถวเดียว -->
          <div class="device-details">
            <div class="detail-item">
              <span class="detail-label">Device</span>
              <span class="detail-value"><q-input dense filled v-model="product_name" readonly/></span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Stock</span>
              <span class="detail-value"><q-input dense filled v-model="stock" readonly/></span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Type</span>
              <span class="detail-value"><q-input dense filled v-model="product_type" readonly/></span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ฟอร์มการยืม -->
      <q-card class="form-card">
        <q-card-section>
          <div class="form-grid">
            <q-input
              outlined
              v-model="borrowDate"
              label="Borrow date"
              type="date"
              class="q-mb-md input-field"
              dense
            />
            <q-input
              outlined
              v-model="returnDate"
              label="Return date"
              type="date"
              class="q-mb-md input-field"
              dense
            />
          </div>
          <div class="button-container">
            <q-btn color="primary" label="ยืนยันการยืม" class="confirm-btn" @click="showDialog" />
          </div>
        </q-card-section>
      </q-card>

      <!-- Dialog Pop-up -->
      <q-dialog v-model="dialog" persistent>
        <q-card class="dialog-card">
          <q-card-section class="dialog-header">
            <div class="text-h6">Information Details</div>
          </q-card-section>

          <q-card-section class="dialog-content">
            <q-input label="ID" v-model="id" outlined dense readonly class="dialog-input" />
            <q-input label="กำหนดวันยืม" v-model="borrowDate" outlined dense readonly class="dialog-input" />
            <q-input label="กำหนดวันคืน" v-model="returnDate" outlined dense readonly class="dialog-input" />
            <q-input label="จำนวน" v-model="amount" outlined dense class="dialog-input" type="number" />
          </q-card-section>

          <q-card-actions align="right" class="dialog-actions">
            <q-btn color="green" label="Save" class="dialog-btn" @click="saveDialog" />
            <q-btn color="primary" label="Close" flat class="dialog-btn" @click="dialog = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    // ตัวแปรสำหรับการจัดเก็บข้อมูลอุปกรณ์และฟอร์มการยืม
    const id = ref(route.params.id || '');
    const product_name = ref('');
    const product_type = ref('');
    const stock = ref('');
    const borrowDate = ref('');
    const returnDate = ref('');
    const amount = ref(1);
    const dialog = ref(false);

    // ฟังก์ชันดึงข้อมูล
    const fetchData = () => {
      if (id.value) {
        fetch(`http://localhost:8800/api/v1/products/${id.value}`)
          .then((res) => res.json())
          .then((result) => {
            product_name.value = result.product_name;
            product_type.value = result.product_type;
            stock.value = result.stock;
          })
          .catch((error) => {
            console.error('Error fetching product data:', error);
            alert('Error fetching product data:', error);
          });
      }
    };

    // ฟังก์ชันสำหรับการบันทึก
    const saveDialog = () => {
      const data = {
        product_id: id.value,
        borrow_date: borrowDate.value,
        return_date: returnDate.value,
        amount: amount.value
      };
      console.log("Data to save:", data);
      dialog.value = false;
    };

    // ฟังก์ชันสำหรับกลับไปหน้าก่อนหน้า
    const goBack = () => {
      router.back();
    };

    // เรียก fetchData เมื่อ component ถูก mount
    onMounted(() => {
      fetchData();
    });

    return {
      id,
      product_name,
      product_type,
      stock,
      borrowDate,
      returnDate,
      amount,
      dialog,
      saveDialog,
      goBack,
      showDialog: () => (dialog.value = true),
    };
  },
};
</script>


  
  <style scoped>
  .content-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 32px;
    box-sizing: border-box;
  }
  
  .content {
    width: 100%;
    max-width: 800px;
  }
  
  .device-card,
  .form-card {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    width: 100%;
  }
  
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .back-link {
    font-size: 16px;
    color: #888;
    cursor: pointer;
  }
  
  .device-id {
    font-size: 16px;
    color: #666;
    margin-top: 8px;
  }
  
  .q-mb-md {
    margin-bottom: 16px;
  }
  
  .q-mt-md {
    margin-top: 16px;
  }
  
  .device-details {
  display: flex;
  gap: 24px; /* ระยะห่างระหว่างแต่ละ item */
  margin-top: 16px;
  overflow-x: auto; /* ให้เลื่อนได้ถ้าจอเล็กเกินไป */
}

.detail-item {
  display: flex;
  flex-direction: column;
  min-width: 120px; /* กำหนดขนาดขั้นต่ำของแต่ละ item */
  align-items: flex-start; /* จัดให้อยู่ชิดซ้าย */
}
  
  .detail-label {
    font-size: 16px;
    font-weight: bold;
    color: #4a00e0;
  }
  
  .detail-value {
    font-size: 16px;
    color: #333;
  }
  
  .status-badge {
    margin-left: 8px;
    background-color: #00c853;
    color: white;
    padding: 2px 8px;
    font-size: 12px;
    border-radius: 4px;
  }
  
  .dialog-card {
    max-width: 500px;
    width: 100%;
    padding: 24px;
    border-radius: 12px;
  }
  
  .dialog-header {
    text-align: center;
    padding-bottom: 16px;
  }
  
  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .dialog-input {
    font-size: 14px;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  .dialog-btn {
    min-width: 70px;
    font-weight: bold;
  }
  
  .button-container {
    display: flex;
    justify-content: center;
    padding-top: 16px;
  }
  
  .confirm-btn {
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    border-radius: 4px;
    padding: 10px 20px;
  }
  
  .confirm-btn:hover {
    background-color: #45a049;
  }
  </style>
  