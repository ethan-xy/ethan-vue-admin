<template>
  <el-dialog title="分配角色" v-model="dialogVisible" width="30%">
    <el-scrollbar height="300px"  v-loading="loading">
      <el-checkbox-group v-model="userRoles" class="el-row">
        <el-col :span="12" class="item" v-for="role in roles" :key="role">
          <el-checkbox :label="role" ></el-checkbox>
        </el-col>
      </el-checkbox-group>
    </el-scrollbar>
    <template #footer>
      <el-button size="small" @click="dialogVisible = false">取消</el-button>
      <el-button size="small" type="primary" @click="assignRole">
        分配
      </el-button>
    </template>
  </el-dialog>
</template>
<script>
  import {ref, watch} from 'vue'
  import {messageSuccess} from '@/utils/helper'
  import GuardSelect from "@/views/components/Select/GuardSelect.vue"
  import {getUserRoles, assignRoles} from '@/api/admin-user'
  import { guardNameRoles  } from '@/api/role'

  export default {
    name: 'AssignRoleDialog',
    components: {
      GuardSelect
    },
    props: {
      userId: {
        type: Number,
      },
      modelValue: {
        type: Boolean,
        default: false,
      },
      guardName: {
        type: String,
      }
    },
    setup(props, {emit}) {
      const dialogVisible = ref(false)
      const loading = ref(false)
      const roles = ref([])
      const userRoles = ref([])

      const assignRole = () => {
        assignRoles(props.userId, userRoles.value).then( () => {
          messageSuccess('分配成功')
          dialogVisible.value = false
        })
      }

      const loadData = async () => {
        loading.value = true
        let guardNameRolesRequest = guardNameRoles(props.guardName)
        let userRolesRequest = getUserRoles(props.userId)

        await Promise.all([guardNameRolesRequest, userRolesRequest]).then(result => {
          let roleItems = []
          result[0].data.data.forEach( role => {
            roleItems.push(role.name)
          })

          let userRoleItems = []
          result[1].data.data.forEach( role => {
            userRoleItems.push(role.name)
          })

          roles.value = roleItems
          userRoles.value = userRoleItems
        })

        loading.value = false
      }

      watch(() => props.userId, (userId) => {
        if (userId) {
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
        loading,
        roles,
        userRoles,
        assignRole
      }
    }
  }
</script>