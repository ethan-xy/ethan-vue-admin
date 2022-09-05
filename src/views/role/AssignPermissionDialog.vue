<template>
  <el-dialog :title="title" v-model="dialogVisible" width="60%">
    <el-scrollbar height="400px"  v-loading="loading">
      <el-card v-for="group in guardNameByPermissions" :key="group.id" style="margin-bottom:20px;">
          <template #header>
            <div style="float:right">
              <el-radio v-model="radio[group.id]" @change="radioChange(group.id)" :label="true">全选</el-radio>
              <el-radio v-model="radio[group.id]" @change="radioChange(group.id)" :label="false">取消全选</el-radio>
            </div>
            <span class="permission-group">{{ group.name }}</span>
          </template>
          <el-checkbox-group v-model="rolePermissions" class="el-row">
            <el-col
              class="permission-item"
              :span="6"
              style="margin-top:10px"
              v-for="permission in group.permission"
              :key="permission.id">
              <el-checkbox :label="permission.name">{{ permission.display_name}}</el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-card>
    </el-scrollbar>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="assignPermission">
        分配
      </el-button>
    </template>
  </el-dialog>
</template>
<script>
  import {ref, watch} from 'vue'
  import {guardNameForPermissions} from '@/api/permission-group'
  import {messageSuccess} from '@/utils/helper'
  import {rolePermission, roleAssignPermission} from '@/api/role'
  import GuardSelect from "@/views/components/Select/GuardSelect.vue"

  export default {
    name: 'AssignPermissionDialog',
    components: {
      GuardSelect
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      roleId: {
        type: Number,
        default: 0
      },
      title: {
        type: String
      },
      guardName: {
        type: String,
      }
    },
    setup(props, {emit}) {
      const dialogVisible = ref(false)
      const loading = ref(false)

      const rolePermissions = ref([])
      const guardNameByPermissions = ref([])
      const groupPermissions = ref({})
      const radio = ref({})

      const radioChange = (groupId) => {
        groupPermissions.value[groupId].forEach(permission => {
          let index = rolePermissions.value.indexOf(permission)

          if (!radio.value[groupId] && index >= 0) {
            rolePermissions.value.splice(index, 1)
          } else if (radio.value[groupId] && index === -1) {
            rolePermissions.value.push(permission)
          }
        })
      }

      const assignPermission = () => {
        roleAssignPermission(props.roleId, rolePermissions.value).then( () => {
          messageSuccess('分配成功')
          dialogVisible.value = false
        })
      }

      const loadData = async () => {
        loading.value = true
        rolePermissions.value = []
        guardNameByPermissions.value = []
        groupPermissions.value = {}
        radio.value = {}

        let requestPermissionGroups = guardNameForPermissions(props.guardName)
        let requestRolePermissions = rolePermission(props.roleId)

        await Promise.all([requestPermissionGroups, requestRolePermissions]).then(result => {
          guardNameByPermissions.value = result[0].data.data

          result[0].data.data.forEach(item => {
            if (!groupPermissions.value.hasOwnProperty(item.id)) {
              groupPermissions.value[item.id] = []
            }
            item.permission.forEach(permission => {
              groupPermissions.value[item.id].push(permission.name)
            })
          })

          result[1].data.data.forEach(item => {
            rolePermissions.value.push(item.name)
          })
        })

        loading.value = false
      }

      watch(() => props.roleId, (roleId) => {
        if (roleId) {
          loadData()
        }
      })

      watch(() => props.modelValue, (v) => {
        dialogVisible.value = v
      })

      watch(dialogVisible, (v) => {
        emit("update:modelValue", v)
      })


      return {
        dialogVisible,
        guardNameByPermissions,
        radio,
        rolePermissions,
        radioChange,
        loading,
        assignPermission
      }
    }
  }
</script>