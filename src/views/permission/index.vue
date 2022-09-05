<template>
  <el-card>
    <el-form :inline="false" :model="tableData.queryParams" size="small">
      <el-row :gutter="40">
        <el-col :span="4">
          <el-form-item label="名称">
            <el-input v-model="tableData.queryParams.name" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="归属项目">
            <guard-select v-model="tableData.queryParams.guard_name"></guard-select>
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
      <el-table-column prop="display_name" label="路由名称"/>
      <el-table-column prop="guard_name" label="归属项目"/>
      <el-table-column prop="created_at" label="创建时间"/>
      <el-table-column
        fixed="right"
        width="220px"
        label="操作"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="primary"
            v-if="updatePermission"
            @click="showEditDialogVisible(scope.$index, scope.row)">编辑
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
    <permission-form-dialog action="add" @handleRow="onHandleRow" v-model="addDialogVisible" title="添加"></permission-form-dialog>
    <permission-form-dialog action="edit" @handleRow="onHandleRow" :row="nowRow" :rowIndex="rowIndex" v-model="editDialogVisible" title="编辑"></permission-form-dialog>
  </el-card>
</template>
<script>
  import {reactive, computed, ref} from 'vue'
  import { useStore } from 'vuex'
  import {getPermissions, deletePermission} from "@/api/permission"
  import {tableDataDefault, tableDataFormat} from '@/utils/table'
  import PermissionFormDialog from './PermissionFormDialog.vue'
  import GuardSelect from "@/views/components/Select/GuardSelect.vue"
  import {messageSuccess} from "@/utils/helper";

  export default {
    name: 'permissionPage',
    components: {
      PermissionFormDialog,
      GuardSelect
    },
    setup() {
      const tableData = tableDataDefault()
      const addDialogVisible = ref(false)
      const editDialogVisible = ref(false)
      const nowRow = ref({})
      const rowIndex = ref(0)
      const store = useStore()

      const requestData = () => {
        tableData.loading = true
        getPermissions(tableData.getQueryParams()).then(res => {
          tableDataFormat(res, tableData)
        })
      }

      requestData()

      const onHandleRow = (val, index) => {
        if (index >= 0) {
          tableData.data[index] = val
        } else {
          requestData()
        }
      }

      const showEditDialogVisible = (index, row) => {
        editDialogVisible.value = true
        nowRow.value = row
        rowIndex.value = index
      }

      const handleDelete = (index, row) => {
        deletePermission(row.id).then(() => {
          messageSuccess()
          tableData.data.splice(index, 1)
        })
      }

      return {
        tableData,
        requestData,
        onHandleRow,
        addDialogVisible,
        editDialogVisible,
        nowRow,
        rowIndex,
        showEditDialogVisible,
        handleDelete,
        updatePermission: computed(() => store.getters.hasPermission('permission.update')),
        storePermission: computed(() => store.getters.hasPermission('permission.store')),
        deletePermission: computed(() => store.getters.hasPermission('permission.destroy')),
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