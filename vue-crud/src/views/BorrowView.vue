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
          <div class="device-id">ID<q-input dense filled v-model="id" readonly /></div>
          <q-separator class="q-mt-md" />

          <!-- รายละเอียดอุปกรณ์ในรูปแบบแถวเดียว -->
          <div class="device-details">
            <div class="detail-item">
              <span class="detail-label">Device</span>
              <span class="detail-value"><q-input dense filled v-model="product_name" readonly /></span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Stock</span>
              <span class="detail-value"><q-input dense filled v-model="stock" readonly /></span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Type</span>
              <span class="detail-value"><q-input dense filled v-model="product_type" readonly /></span>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ฟอร์มการยืม -->
      <q-card class="form-card">
        <q-card-section>
          <div class="form-grid">
            <q-input outlined v-model="borrowDate" label="Borrow date" type="date" class="q-mb-md input-field" dense />
            <q-input outlined v-model="returnDate" label="Return date" type="date" class="q-mb-md input-field" dense />
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
            <q-input label="User ID" v-model="user_id" outlined dense readonly class="dialog-input" />
            <q-input label="Device ID" v-model="id" outlined dense readonly class="dialog-input" />
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
    const stock = ref(0); // เก็บ stock ของอุปกรณ์
    const borrowDate = ref('');
    const returnDate = ref('');
    const amount = ref(1);
    const dialog = ref(false);

    // ดึงข้อมูล user_id จาก localStorage
    const user_id = ref(localStorage.getItem('user_id'));

    // ฟังก์ชันดึงข้อมูลอุปกรณ์
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

    // ฟังก์ชันสำหรับบันทึกการยืมและอัปเดต stock
    const saveDialog = async () => {
      // ตรวจสอบว่า amount ไม่เกิน stock ที่มีอยู่
      if (amount.value > stock.value) {
        alert("จำนวนการยืมเกินจำนวนสินค้าในสต็อก");
        return; // หยุดการทำงานหาก amount เกิน stock
      }

      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const borrowData = {
          user_id: parseInt(user_id.value), // แปลง user_id ให้เป็น Int
          borrow_date: borrowDate.value,
          borrow_return: returnDate.value,
          products: [
            {
              product_id: parseInt(id.value), // แปลง product_id ให้เป็น Int
              amount: parseInt(amount.value)  // แปลง amount ให้เป็น Int
            }
          ]
        };

        // 1. สร้างคำขอยืมสินค้า
        const borrowResponse = await fetch("http://localhost:8800/api/v1/borrows", {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(borrowData),
          redirect: "follow"
        });

        const borrowResult = await borrowResponse.json();

        if (borrowResponse.ok) {
          console.log("Borrow created successfully:", borrowResult);

          // 2. คำนวณค่า stock ใหม่
          const newStock = stock.value - amount.value;

          // 3. อัปเดต stock ใหม่ในฐานข้อมูล
          await fetch(`http://localhost:8800/api/v1/products/${id.value}`, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify({ stock: newStock }),
            redirect: "follow"
          });

          // 4. อัปเดตค่า stock ในหน้าจอด้วย
          stock.value = newStock;
          alert("Stock updated successfully.");
          dialog.value = false;
        } else {
          alert("Failed to create borrow.");
        }
      } catch (error) {
        console.error("Error processing borrow request:", error);
        alert("Error processing borrow request.");
      }
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
      user_id,
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
  gap: 24px;
  margin-top: 16px;
  overflow-x: auto;
}

.detail-item {
  display: flex;
  flex-direction: column;
  min-width: 120px;
  align-items: flex-start;
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
