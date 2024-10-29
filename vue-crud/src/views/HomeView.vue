<template>
  <q-layout view="hHh lpR fFf">

    <!-- เนื้อหาหลัก -->
    <q-page-container>
      <q-page padding class="bg-grey-2">
        <div class="q-pa-md q-mb-md">
          <h4>หน้าแรก</h4>
        </div>

        <div class="row q-gutter-md q-px-md q-mb-md">
          <!-- ปรับขนาดของแต่ละ card ให้เป็น col-2 เพื่อให้มีขนาดเหมาะสมและเท่ากัน -->
          <q-card class="col-2 text-center q-pa-md">
            <q-card-section>
              <div>รออนุมัติ</div>
              <div class="text-orange text-h6">5 รายการ</div>
            </q-card-section>
          </q-card>

          <q-card class="col-2 text-center q-pa-md">
            <q-card-section>
              <div>กำลังถูกคืน</div>
              <div class="text-orange text-h6">8 รายการ</div>
            </q-card-section>
          </q-card>

          <q-card class="col-2 text-center q-pa-md">
            <q-card-section>
              <div>เสร็จสิ้น</div>
              <div class="text-orange text-h6">5 รายการ</div>
            </q-card-section>
          </q-card>

          <q-card class="col-2 text-center q-pa-md">
            <q-card-section>
              <div>ยกเลิก</div>
              <div class="text-orange text-h6">2 รายการ</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- ตารางเลขที่เลยที่หมดคืน -->
        <div class="row q-gutter-md q-px-md">
          <q-card class="col-11 q-pa-md">
            <q-card-section>
              <h6>เลขที่เลยที่หมดคืน</h6>
              <q-table :rows="returnList" :columns="columns" row-key="id" flat rows-per-page-options="[5, 10, 15]">
                <template v-slot:body-cell-status="props">
                  <q-badge color="orange" class="text-white">{{ props.row.status }}</q-badge>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      drawer: true, // เปิด Sidebar เป็นค่าเริ่มต้น
      returnList: [],
      pendingCount: 0,
      columns: [
        { name: 'borrow_id', label: 'ID', align: 'left', field: 'borrow_id' },
        { name: 'borrow_return', label: 'กำหนดวันที่คืน', align: 'left', field: 'borrow_return' },
        { name: 'user_id', label: 'รหัสผู้ใช้', align: 'left', field: 'user_id' },
        { name: 'status', label: 'สถานะ', align: 'center', field: 'status' },
        { name: 'amount', label: 'จำนวน', align: 'center', field: 'amount' },
      ],
    };
  },
};
</script>

<style scoped>
.text-orange {
  color: #ff9800;
}
</style>
