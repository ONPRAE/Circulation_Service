<template>
  <q-layout view="hHh lpR fFf">
    <!-- เนื้อหาหลัก -->
    <q-page-container>
      <q-page padding class="bg-grey-2">
        <div class="q-pa-md q-mb-md">
          <h4>หน้าแรก</h4>
        </div>

        <!-- แสดงการ์ดสถานะต่าง ๆ -->
        <div class="row q-gutter-md q-px-md">
          <!-- Card สำหรับสถานะต่าง ๆ เช่น รออนุมัติ, กำลังถูกยืม, เสร็จสิ้น, ยกเลิก, เกินกำหนด -->
          <q-card class="col-2 text-center q-pa-md" v-for="(count, status) in statusCounts" :key="status">
            <q-card-section>
              <div>{{ status }}</div>
              <div class="text-orange text-h6">{{ count }} รายการ</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- ตารางรายการที่หมดเวลายืม -->
       <div class="row q-gutter-md q-px-md">
          <q-card class="col-11 q-pa-md">
            <q-card-section>
              <h6>เลขที่รายการหมดเวลายืม</h6>
              <q-table
            :rows="returnList"
            :columns="columns"
            row-key="product_id"
          >
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

              <!-- แสดงข้อความหากไม่มีรายการใน returnList -->
              <div v-if="returnList.length === 0" class="text-center q-mt-md">
                <p>ไม่มีรายการหมดเวลายืม</p>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const borrows = ref([]);              // เก็บข้อมูลการยืมทั้งหมด
    const returnList = ref([]);           // เก็บรายการที่ต้องคืน
    const statusCounts = ref({            // เก็บจำนวนการยืมแยกตามสถานะต่าง ๆ
      "รออนุมัติ": 0,
      "กำลังถูกยืม": 0,
      "เสร็จสิ้น": 0,
      "ยกเลิก": 0,
      "เกินกำหนด": 0,
    });

    const columns = [
      { name: 'borrow_id', label: 'ID', align: 'left', field: 'borrow_id' },
      { name: 'borrow_return', label: 'กำหนดวันที่คืน', align: 'left', field: 'borrow_return' },
      { name: 'user_id', label: 'รหัสผู้ใช้', align: 'left', field: 'user_id' },
      { name: 'status', label: 'สถานะ', align: 'center', field: 'status' },
    ];

    const fetchBorrows = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/v1/borrows");
        const data = await response.json();
        borrows.value = data;

        console.log("All borrows:", borrows.value); // ตรวจสอบข้อมูลทั้งหมดจาก API

        // นับจำนวนการยืมที่มีสถานะต่างๆ
        statusCounts.value["รออนุมัติ"] = borrows.value.filter(borrow => borrow.status === 'Pending').length;
        statusCounts.value["กำลังถูกยืม"] = borrows.value.filter(borrow => borrow.status === 'Borrowing').length;
        statusCounts.value["เสร็จสิ้น"] = borrows.value.filter(borrow => borrow.status === 'Return').length;
        statusCounts.value["ยกเลิก"] = borrows.value.filter(borrow => borrow.status === 'Cancel').length;
        statusCounts.value["เกินกำหนด"] = borrows.value.filter(borrow => borrow.status === 'Late').length;

        console.log("Status counts:", statusCounts.value); // ตรวจสอบจำนวนสถานะต่าง ๆ

        // ดึงเฉพาะรายการที่มีสถานะ "Late"
        returnList.value = borrows.value.filter(borrow => borrow.status === 'Late');
      } catch (error) {
        console.error("Error fetching borrows:", error);
      }
    };



    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    onMounted(() => {
      fetchBorrows(); // ดึงข้อมูลเมื่อ component ถูก mount
    });

    return {
      borrows,
      returnList,
      statusCounts,
      columns,
      formatDate,
    };
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff9800;
}

.content-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
