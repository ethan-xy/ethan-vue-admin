<template>
  <el-dialog :title="title" v-model="dialogVisible" width="30%">
    <el-scrollbar height="315px">
      <el-form :model="form" :rules="rules" label-width="120px" size="small" ref="formRef">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="路由名称" prop="uri">
          <el-input v-model="form.uri"></el-input>
        </el-form-item>
        <el-form-item label="归属项目" prop="guard_name">
          <guard-select v-model="form.guard_name"></guard-select>
        </el-form-item>
        <el-form-item label="父级菜单" prop="p_id" v-if="form.guard_name">
          <menu-cascader v-model="form.p_id" :guard-name="form.guard_name" :mc-visible="dialogVisible"></menu-cascader>
        </el-form-item>
        <el-form-item label="权限" prop="permission_name">
          <el-input v-model="form.permission_name"></el-input>
        </el-form-item>
        <el-form-item label="icon图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.number="form.sort"></el-input>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="handleAddMenu" v-if="action === 'add'">
        确定
      </el-button>
      <el-button size="small" type="primary" @click="handleEditMenu" v-if="action === 'edit'">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>
<script>
  import {ref, watch} from 'vue'
  import {addMenu, editMenu} from "@/api/menu"
  import {messageSuccess} from '@/utils/helper'
  import GuardSelect from "@/views/components/Select/GuardSelect.vue"
  import MenuCascader from "@/views/components/Cascader/MenuCascader.vue"

  export default {
    name: 'PermissionGroupFormDialog',
    components: {
      GuardSelect,
      MenuCascader,
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
        uri: null,
        guard_name: null,
        permission_name: null,
        sort: 0,
        icon: null,
        p_id: 0
      })
      const id = ref(null)

      let rules = {
        name: [
          {required: true, message: '请输入菜单名称'},
        ],
        uri: [
          {required: true, message: '请输入路由名称'},
        ],
        guard_name: [
          {required: true, message: '请选择归属项目'},
        ]
      }

      const handleAddMenu = () => {
        formRef.value.validate((valid) => {
          if (!valid) {
            return false
          }

          addMenu(form.value).then(() => {
            emit("handle-row", {...form.value}, -1)
            messageSuccess()
            dialogVisible.value = false
            formRef.value.resetFields()
          })
        })
      }

      const handleEditMenu = () => {
        formRef.value.validate((valid) => {
          if (!valid) {
            return false
          }

          editMenu(id.value, form.value).then(() => {
            emit("handle-row", {...form.value}, -1)
            messageSuccess()
            dialogVisible.value = false
            props.row.name = form.value.name
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
        form.value.uri = row.uri
        form.value.guard_name = row.guard_name
        form.value.permission_name = row.permission_name
        form.value.sort = row.sort
        form.value.icon = row.icon
        form.value.p_id = row.p_id
      })

      return {
        dialogAction,
        form,
        dialogVisible,
        rules,
        formRef,
        handleAddMenu,
        handleEditMenu
      }
    }
  }
</script>