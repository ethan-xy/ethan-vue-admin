<template>
  <el-cascader
    v-model="optionValue"
    placeholder="Please choose"
    clearable
    :options="options"
    :props="defaultProps">
  </el-cascader>

</template>
<script>
  import {getNodeParentPath} from '@/utils/helper'
  import {getMenuList} from '@/api/menu'
  import {ref, watch} from 'vue'

  export default {
    name: 'MenuCascader',
    props: {
      modelValue: {
        type: Number,
        default: 0,
      },
      mcVisible: {
        type: Boolean,
        default: false,
      },
      guardName: String,
    },
    setup(props, {emit}) {
      const menuId = ref(props.modelValue)
      const options = ref([])
      const optionValue = ref([])
      const defaultProps = ref({
        children: 'children',
        label: 'name',
        value: "id",
        checkStrictly: true
      })

      const requestData = () => {
        if (props.guardName) {
          getMenuList({'guard_name': props.guardName}).then(response => {
            options.value = response.data.data
          })
        } else {
          options.value = []
        }
      }

      requestData()

      const setDefault = (menuId) => {
        optionValue.value = getNodeParentPath(options.value, menuId)
      }

      watch(optionValue, (ids) => {
        let id = ids ? ids[ids.length - 1] : 0
        let menuId = id > 0 ? id : 0
        emit("update:modelValue", menuId);
      })

      watch(() => props.modelValue, (val) => {
        setDefault(props.modelValue)
      })

      watch(options, () => {
        if (props.modelValue) {
          setDefault(props.modelValue)
        }
      })

      watch(() => props.guardName, (val) => {
        requestData()
        optionValue.value = []
      })

      watch(() => props.mcVisible, (val) => {
        if (val) {
          requestData()
        }
      })

      return {
        menuId,
        options,
        optionValue,
        defaultProps,
      }
    },
  }
</script>