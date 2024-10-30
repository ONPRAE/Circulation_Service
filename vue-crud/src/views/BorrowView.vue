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
            <div class="device-id">ID: E568905</div>
            <q-separator class="q-mt-md" />
  
            <!-- รายละเอียดอุปกรณ์ในรูปแบบแถวเดียว -->
            <div class="device-details">
              <div class="detail-item">
                <span class="detail-label">Device</span>
                <span class="detail-value">อุปกรณ์1</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Model</span>
                <span class="detail-value">model</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Stock</span>
                <span class="detail-value">
                  3
                  <q-badge color="green" class="status-badge">พร้อมยืม</q-badge>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Type</span>
                <span class="detail-value">Computer</span>
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
            <q-input
              outlined
              v-model="note"
              label="Note"
              type="textarea"
              class="q-mb-md note-field"
              dense
            />
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
              <q-input label="ID" v-model="deviceId" outlined dense readonly class="dialog-input" />
              <q-input label="Device" v-model="device" outlined dense readonly class="dialog-input" />
              <q-input label="Model" v-model="model" outlined dense readonly class="dialog-input" />
              <q-input label="Type" v-model="type" outlined dense readonly class="dialog-input" />
              <q-input label="Brand" v-model="brand" outlined dense readonly class="dialog-input" />
              <q-input label="กำหนดวันยืม" v-model="borrowDate" outlined dense readonly class="dialog-input" />
              <q-input label="กำหนดวันคืน" v-model="returnDate" outlined dense readonly class="dialog-input" />
              <q-input label="Note" v-model="note" outlined dense readonly class="dialog-input" />
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

  export default {
    data() {
      return {
        dialog: false,
        deviceId: "E534700",
        device: "อุปกรณ์8",
        model: "Model",
        type: "Computer",
        brand: "MSI",
        borrowDate: "16 Oct 2024",
        returnDate: "23 Oct 2024",
        note: "-"
      };
    },
      methods: {
        //คำสั่งย้อนกลับ
        goBack() {
          window.history.back();
          },
        
      showDialog() {
        this.dialog = true;
      },
      saveDialog() {
        console.log("Saved information:", {
          deviceId: this.deviceId,
          device: this.device,
          model: this.model,
          type: this.type,
          brand: this.brand,
          borrowDate: this.borrowDate,
          returnDate: this.returnDate,
          note: this.note,
        });
        this.dialog = false;
      }
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
  