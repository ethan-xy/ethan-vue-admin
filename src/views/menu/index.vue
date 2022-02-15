<template>
  <el-card>
    <el-form :inline="false" :model="tableData.queryParams" size="small">
      <el-row :gutter="40">
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
    <el-table
      :data="tableData.data"
      v-loading="tableData.loading"
      row-key="id"
      default-expand-all
      border stripe>
      <el-table-column
        label="菜单名称"
        min-width="200"
        prop="name"
        show-overflow-tooltip
        align="left">
      </el-table-column>
      <el-table-column prop="uri" label="路由名称" />
      <el-table-column prop="name" label="权限"/>
      <el-table-column label="icon图标">
        <template #default="scope">
          <el-icon v-if="scope.row.icon"><component :is="scope.row.icon" /></el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"/>
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
    <menu-form-dialog action="add" @handleRow="onHandleRow" v-model="addDialogVisible" title="添加"></menu-form-dialog>
    <menu-form-dialog action="edit" @handleRow="onHandleRow" :row="nowRow" :rowIndex="rowIndex" v-model="editDialogVisible" title="编辑"></menu-form-dialog>
  </el-card>
</template>
<script>
  import {reactive, computed, ref} from 'vue'
  import { useStore } from 'vuex'
  import {getMenuList, deleteMenu} from "@/api/menu"
  import {tableDataDefault} from '@/utils/table'
  import MenuFormDialog from './MenuFormDialog.vue'
  import GuardSelect from '../components/Select/GuardSelect.vue'
  import {messageSuccess} from "@/utils/helper";

  export default {
    name: 'permissionGroupPage',
    components: {
      MenuFormDialog,
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
        getMenuList(tableData.queryParams).then(res => {
          tableData.data = res.data.data
          tableData.loading = false
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
        deleteMenu(row.id).then(() => {
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
        updatePermission: computed(() => store.getters.hasPermission('menu.update')),
        storePermission: computed(() => store.getters.hasPermission('menu.store')),
        deletePermission: computed(() => store.getters.hasPermission('menu.destroy')),
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