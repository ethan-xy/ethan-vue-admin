<template>
  <el-dialog :title="title" v-model="dialogVisible" width="30%">
    <el-scrollbar height="280px">
      <el-form :model="form" :rules="rules" label-width="120px" size="small" ref="formRef">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="action ==='add'">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="状态" v-if="action ==='edit'">
          <el-switch v-model="form.status"></el-switch>
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
  import {addAdminUser, editAdminUser} from "@/api/admin-user"
  import {messageSuccess} from '@/utils/helper'
  import GuardSelect from "@/views/components/Select/GuardSelect.vue"

  export default {
    name: 'AdminUserFormDialog',
    components: {
      GuardSelect
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
      const guard = ref(null)
      const formRef = ref(null)
      const form = ref({
        name: null,
        email: null,
        password: null,
        status: true,
      })
      const id = ref(null)

      let rules = {
        name: [
          {required: true},
          {min: 3, max: 255}
        ],
        email: [
          {required: true}
        ]
      }
      if (props.action === 'add') {
        rules = {
          ...rules,
          password: [
            {required: true},
            {min: 8, max: 32}
          ]
        }
      }

      const handleAddRole = () => {
        formRef.value.validate((valid) => {
          if (!valid) {
            return false
          }

          addAdminUser(form.value).then(() => {
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

          editAdminUser(id.value, form.value).then((res) => {
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

      watch(() => (props.row), (row, oldValue) => {
        id.value = row.id
        form.value.name = row.name
        form.value.email = row.email
        form.value.status = row.status === 1 ? true : false
        form.value.remark = row.remark
      })

      return {
        dialogAction,
        form,
        dialogVisible,
        rules,
        guard,
        formRef,
        handleAddRole,
        handleEditRole
      }
    }
  }
</script>