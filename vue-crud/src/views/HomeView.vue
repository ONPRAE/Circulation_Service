<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page padding class="bg-grey-2">
        <div class="q-pa-md q-mb-md">
          <h4>หน้าแรก</h4>
        </div>

        <!-- Cards for different status -->
        <div class="row q-gutter-md q-px-md">
          <q-card
            class="col-2 text-center q-pa-md"
            v-for="(count, status) in statusCounts"
            :key="status"
          >
            <q-card-section>
              <div>{{ status }}</div>
              <div class="text-orange text-h6">{{ count }} รายการ</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Table for overdue items -->
        <div class="row q-gutter-md q-px-md">
          <q-card class="col-11 q-pa-md">
            <q-card-section>
              <h6>เลขที่รายการหมดเวลายืม</h6>
              <q-table
                :rows="returnList"
                :columns="columns"
                row-key="borrow_id"
              >
                <template v-slot:body-cell-actions="props">
                  <q-td align="center">
                    <q-btn
                      flat
                      round
                      dense
                      icon="play_arrow"
                      style="background-color: #00E676; color: white"
                      @click="navigateToBorrowView(props.row.borrow_id)"
                    />
                  </q-td>
                </template>
              </q-table>

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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const borrows = ref([]); // All borrow data
    const returnList = ref([]); // List of overdue items
    const statusCounts = ref({
      "รออนุมัติ": 0,
      "กำลังถูกยืม": 0,
      "เสร็จสิ้น": 0,
      "ยกเลิก": 0,
      "เกินกำหนด": 0,
    });

    const columns = [
      { name: "borrow_id", label: "ID", align: "left", field: "borrow_id" },
      { name: "borrow_return", label: "กำหนดวันที่คืน", align: "left", field: "borrow_return" },
      { name: "user_id", label: "รหัสผู้ใช้", align: "left", field: "user_id" },
      { name: "status", label: "สถานะ", align: "center", field: "status" },
    ];

    const fetchBorrows = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/v1/borrows");
        const data = await response.json();
        borrows.value = data;

        // Count items by status
        statusCounts.value["รออนุมัติ"] = borrows.value.filter(borrow => borrow.status === "Pending").length;
        statusCounts.value["กำลังถูกยืม"] = borrows.value.filter(borrow => borrow.status === "Borrowing").length;
        statusCounts.value["เสร็จสิ้น"] = borrows.value.filter(borrow => borrow.status === "Return").length;
        statusCounts.value["ยกเลิก"] = borrows.value.filter(borrow => borrow.status === "Cancel").length;
        statusCounts.value["เกินกำหนด"] = borrows.value.filter(borrow => borrow.status === "Late").length;

        // Filter for overdue items
        returnList.value = borrows.value.filter(borrow => borrow.status === "Late");
      } catch (error) {
        console.error("Error fetching borrows:", error);
      }
    };

    const checkUserRole = async () => {
      const userId = localStorage.getItem("user_id");

      if (userId) {
        try {
          const response = await fetch(`http://localhost:8800/api/v1/user/role?userId=${userId}`);
          const result = await response.json();

          if (response.ok && result.role === "User") {
            router.push("/user");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        console.error("User ID is missing.");
      }
    };

    onMounted(() => {
      checkUserRole();
      fetchBorrows(); // Fetch data when the component is mounted
    });

    return {
      borrows,
      returnList,
      statusCounts,
      columns,
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
