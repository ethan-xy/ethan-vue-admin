<template>
  <el-card>
    <el-form :inline="false" :model="queryParams" size="small">
      <el-row :gutter="40">
        <el-col :span="4">
          <el-form-item label="名称">
            <el-input v-model="queryParams.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="邮箱">
            <el-input v-model="queryParams.email" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="text-align:right">
          <el-button type="primary" @click="requestData" size="small">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="table-cation">
      <el-col :span="24" class="action">
        <el-button type="primary" size="small" @click="addDialogVisible = true" v-if="storePermission">添加</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="tableData.loading" :data="tableData.data" border style="width: 100%">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="status_name" label="状态"/>
      <el-table-column prop="created_at" label="创建时间"/>
      <el-table-column
        fixed="right"
        width="300px"
        label="操作"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            @click="showEditDialogVisible(scope.$index, scope.row)" v-if="updatePermission">编辑
          </el-button>
          <el-button
            @click="showAssignRole(scope.row)"
            v-if="assignRolesPermission"
            size="mini"
            type="primary">分配角色
          </el-button>
          <el-popconfirm title="确认删除吗？" @confirm="handleDelete(scope.$index, scope.row)" v-if="deletePermission">
            <template #reference>
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-table"
      @current-change="requestData"
      v-model:currentPage="tableData.pagination.currentPage"
      :page-size="tableData.pagination.pageSize"
      :total="tableData.pagination.total"
      layout="total, prev, pager, next, jumper"
      :hide-on-single-page="true"
      :page-count="tableData.pagination.pageCount">
    </el-pagination>
    <assign-role-dialog :user-id="assignRoleRow.id" :guard-name="assignRoleRow.guardName" v-model="assignRoleDialogVisible"></assign-role-dialog>
    <admin-user-form-dialog action="add" title="创建" @handleRow="onHandleRow" v-model="addDialogVisible"></admin-user-form-dialog>
    <admin-user-form-dialog action="edit" title="编辑" @handleRow="onHandleRow" :row="nowRowData.row" :rowIndex="nowRowData.index" v-model="editDialogVisible"></admin-user-form-dialog>
  </el-card>
</template>
<script>
  import {reactive, watch, ref, computed} from 'vue'
  import { useStore } from 'vuex'
  import {getAdminUser, deleteAdminUser} from "@/api/admin-user";
  import {messageSuccess} from "@/utils/helper";
  import AssignRoleDialog from "./AssignRoleDialog.vue";
  import AdminUserFormDialog from "./AdminUserFormDialog.vue";

  export default {
    components: {
      AssignRoleDialog,
      AdminUserFormDialog
    },
    setup() {
      const tableData = reactive({
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 15,
          pageCount: 0,
          from: 1,
          lastPage: 1,
          to: 1
        },
        nowRow: {
          index: 0,
          row: {}
        },
        queryParams: {},
        loading: false
      })

      const queryParams = reactive({})
      const nowRowData = reactive({row: {}, index: -1})
      const assignRoleDialogVisible = ref(false)
      const editDialogVisible = ref(false)
      const addDialogVisible = ref(false)
      const assignRoleRow = ref({
        id: 0,
        guardName: 'admin',
      })
      const store = useStore()

      const requestData = () => {
        tableData.loading = true
        getAdminUser({...queryParams, page: tableData.pagination.currentPage}).then(res => {
          tableData.data = res.data.data

          let meta = res.data.meta
          tableData.pagination = {
            currentPage: meta.current_page,
            pageSize: meta.per_page,
            from: meta.from,
            pageCount: meta.last_page,
            total: meta.total,
            to: meta.to
          }

          tableData.loading = false
        })
      }

      requestData()

      const handleDelete = (index, row) => {
        deleteAdminUser(row.id).then(() => {
          messageSuccess()
          tableData.data.splice(index, 1)
        })
      }

      const showAssignRole = (row) => {
        assignRoleDialogVisible.value = true
        assignRoleRow.value.id = row.id
      }

      const showEditDialogVisible = (index, row) => {
        editDialogVisible.value = true
        nowRowData.row = row
        nowRowData.index = index
      }

      const onHandleRow = (val, index) => {
        if (index >= 0) {
          tableData.data[index] = val
        } else {
          requestData()
        }
      }

      watch(queryParams, () => {
        tableData.pagination.currentPage = 1
      })

      return {
        tableData,
        requestData,
        queryParams,
        handleDelete,
        assignRoleDialogVisible,
        showAssignRole,
        showEditDialogVisible,
        editDialogVisible,
        addDialogVisible,
        assignRoleRow,
        onHandleRow,
        nowRowData,
        updatePermission: computed(() => store.getters.hasPermission('admin-user.update')),
        storePermission: computed(() => store.getters.hasPermission('admin-user.store')),
        deletePermission: computed(() => store.getters.hasPermission('admin-user.destroy')),
        assignRolesPermission: computed(() => store.getters.hasPermission('admin-user.assign-roles')),
      }
    }
  }
</script>
<style lang="scss" scoped>
  .table-cation {
    margin-bottom: 15px;

    .action {
      text-align: right
    }
  }
</style>