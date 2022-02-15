<template>
  <el-dialog :title="title" v-model="dialogVisible" width="30%">
    <el-form :model="form" :rules="rules" label-width="120px" size="small" ref="formRef">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
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
  import {addPermissionGroup, editPermissionGroup} from "@/api/permission-group"
  import {messageSuccess} from '@/utils/helper'
  import GuardSelect from "@/views/components/Select/GuardSelect.vue"

  export default {
    name: 'PermissionGroupFormDialog',
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
      const formRef = ref(null)
      const form = ref({
        name: null,
      })
      const id = ref(null)

      let rules = {
        name: [
          {required: true},
        ]
      }

      const handleAddRole = () => {
        formRef.value.validate((valid) => {
          if (!valid) {
            return false
          }

          addPermissionGroup(form.value).then(() => {
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

          editPermissionGroup(id.value, form.value).then((res) => {
            emit("handle-row", {...res.data.data}, props.rowIndex)
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
      })

      return {
        dialogAction,
        form,
        dialogVisible,
        rules,
        formRef,
        handleAddRole,
        handleEditRole
      }
    }
  }
</script>