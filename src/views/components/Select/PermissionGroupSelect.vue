<template>
  <el-select v-model="groupId" clearable placeholder="请选择权限组">
    <el-option v-for="group in groups" :label="group.name" :value="group.id" :key="group.id"></el-option>
  </el-select>
  <Refresh style="width: 1em; margin-left: 8px;margin-top: 5px" @click="permissionGroupAll" v-if="showRefresh && show"/>
</template>
<script>
  import {getPermissionGroupAll} from '@/api/permission-group'
  import {ref, watch} from 'vue'
  import {Refresh,} from '@element-plus/icons'

  export default {
    name: 'PermissionGroupSelect',
    props: ['modelValue', 'showRefresh'],
    components: {
      Refresh
    },
    setup(props, {emit}) {
      const groupId = ref(props.modelValue)
      const groups = ref([])
      const show = ref(true)

      const permissionGroupAll = () => {
        show.value = false
        getPermissionGroupAll().then(response => {
          groups.value = response.data.data
          show.value = true
        }).catch(err => {
          show.value = true
        })
      }

      permissionGroupAll()

      watch(() => props.modelValue, (v) => {
        groupId.value = v
      })

      watch(groupId, (v) => {
        emit("update:modelValue", v)
      })

      return {
        groupId,
        groups,
        show,
        permissionGroupAll
      }
    },
  }
</script>