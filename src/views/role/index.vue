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
          <el-form-item label="归属项目">
            <guard-select v-model="queryParams.guard_name"></guard-select>
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
      <el-table-column prop="guard_name" label="归属项目"/>
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
            @click="showAssignPermission(scope.row)"
            v-if="roleAssignPermission"
            size="mini"
            type="primary">分配权限
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
  </el-card>
  <role-form-dialog action="add" title="创建" @handleRow="onHandleRow" v-model="addDialogVisible"></role-form-dialog>
  <role-form-dialog action="edit" title="编辑" @handleRow="onHandleRow" :row="nowRow" :rowIndex="rowIndex" v-model="editDialogVisible"></role-form-dialog>
  <assign-permission-dialog title="分配权限" v-model="assignPermissionDialogVisible" :role-id="assignPermissionRole.id" :guard-name="assignPermissionRole.guardName"></assign-permission-dialog>
</template>
<script>
  import {reactive, watch, ref, computed} from 'vue'
  import {getRoles, deleteRole} from "@/api/role"
  import RoleFormDialog from './RoleFormDialog.vue'
  import AssignPermissionDialog from './AssignPermissionDialog.vue'
  import {messageSuccess} from '@/utils/helper'
  import GuardSelect from "@/views/components/Select/GuardSelect.vue"
  import { useStore } from 'vuex'

  export default {
    name: 'rolePage',
    components: {
      RoleFormDialog,
      GuardSelect,
      AssignPermissionDialog
    },
    setup() {
      const addDialogVisible = ref(false)
      const editDialogVisible = ref(false)
      const assignPermissionDialogVisible = ref(false)
      const queryParams = reactive({})
      const nowRow = ref({})
      const rowIndex = ref(0)
      const store = useStore()

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

      const assignPermissionRole = ref({
        id: 0,
        guardName: null,
      })

      const onHandleRow = (val, index) => {
        if (index >= 0) {
          tableData.data[index] = val
        } else {
          requestData()
        }
      }

      const requestData = () => {
        tableData.loading = true
        getRoles({...queryParams, page: tableData.pagination.currentPage}).then(res => {
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

      const showEditDialogVisible = (index, row) => {
        editDialogVisible.value = true
        nowRow.value = row
        rowIndex.value = index
      }

      const handleDelete = (index, row) => {
        deleteRole(row.id).then( () => {
          messageSuccess()
          tableData.data.splice(index, 1)
        })
      }

      const showAssignPermission = (row) => {
        assignPermissionRole.value.id = row.id
        assignPermissionRole.value.guardName = row.guard_name
        assignPermissionDialogVisible.value = true
      }

      watch(queryParams, () => {
        tableData.pagination.currentPage = 1
      })

      return {
        tableData,
        requestData,
        queryParams,
        addDialogVisible,
        editDialogVisible,
        showEditDialogVisible,
        nowRow,
        rowIndex,
        onHandleRow,
        handleDelete,
        assignPermissionDialogVisible,
        assignPermissionRole,
        showAssignPermission,
        updatePermission: computed(() => store.getters.hasPermission('role.update')),
        storePermission: computed(() => store.getters.hasPermission('role.store')),
        deletePermission: computed(() => store.getters.hasPermission('role.destroy')),
        roleAssignPermission: computed(() => store.getters.hasPermission('role.assign-permissions')),
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