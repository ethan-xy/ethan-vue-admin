<template>
  <el-dialog :title="title" v-model="dialogVisible" width="30%">
    <el-scrollbar height="315px">
      <el-form :model="form" :rules="rules" label-width="120px" size="small" ref="formRef">
        <el-form-item label="路由" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="路由名称" prop="display_name">
          <el-input v-model="form.display_name"></el-input>
        </el-form-item>
        <el-form-item label="归属项目" prop="guard_name">
          <guard-select v-model="form.guard_name"></guard-select>
        </el-form-item>
        <el-form-item label="权限组" prop="pg_id">
          <permission-group-select v-model="form.pg_id" :showRefresh=true></permission-group-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="handleAddRole" v-if="action === 'add'">
        确定
      </el-button>
      <el-button size="small" type="primary" @click="handleEditRole" v-if="action === 'edit'">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
<script>
  import {ref, watch} from 'vue'
  import {addPermission, editPermission} from "@/api/permission"
  import config from '@/config'
  import {messageSuccess} from '@/utils/helper'
  import GuardSelect from "@/views/components/Select/GuardSelect.vue"
  import PermissionGroupSelect from "@/views/components/Select/PermissionGroupSelect.vue"

  export default {
    name: 'PermissionFormDialog',
    components: {
      GuardSelect,
      PermissionGroupSelect,
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String
      },
      action: {
        type: String,
      },
      row: {
        type: Object,
      },
      rowIndex: {
        type: Number,
      }
    },
    emits: ['handle-row', 'update:modelValue'],
    setup(props, {emit}) {
      const dialogVisible = ref(false)
      const dialogAction = ref('add')
      const formRef = ref(null)
      const form = ref({
        name: null,
        display_name: null,
        guard_name: null,
        pg_id: null,
        sort: 0,
        description: null
      })
      const id = ref(null)

      let rules = {
        name: [
          {required: true, message: '请输入路由'},
        ],
        display_name: [
          {required: true, message: '请输入路由名称'},
        ],
        guard_name: [
          {required: true, message: '请选择归属项目'},
        ],
        pg_id: [
          {required: true, message: '请选择权限组'},
        ],
      }

      const handleAddRole = () => {
        formRef.value.validate((valid) => {
          if (!valid) {
            return false
          }

          addPermission(form.value).then(() => {
            emit("handle-row", {...form.value}, -1)
            messageSuccess()
            dialogVisible.value = false
            formRef.value.resetFields()
          })
        })
      }


      const handleEditRole = () => {
        formRef.value.validate((valid) => {
          if (!valid) {
            return false
          }

          editPermission(id.value, form.value).then((res) => {
            emit("handle-row", {...res.data.data}, props.rowIndex)
            messageSuccess()
            dialogVisible.value = false
          })
        })
      }

      watch(() => props.modelValue, (v) => {
        dialogVisible.value = v
      })

      watch(dialogVisible, (v) => {
        emit("update:modelValue", v)
      })

      watch(() => props.row, (row) => {
        id.value = row.id
        form.value.name = row.name
        form.value.guard_name = row.guard_name
        form.value.display_name = row.display_name
        form.value.pg_id = row.pg_id
        form.value.sort = row.sort
        form.value.description = row.description
      })

      return {
        dialogAction,
        form,
        dialogVisible,
        rules,
        formRef,
        items: config.guardNames,
        handleAddRole,
        handleEditRole
      }
    }
  }
</script>