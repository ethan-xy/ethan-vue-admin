<template>
  <el-sub-menu :index="index+1" :key="index" v-if="item?.children">
    <template #title>
      <el-icon>
        <component :is="item.icon"/>
      </el-icon>
      <span>{{item.name}}</span>
    </template>
    <el-menu-item v-for="(val, i) in item?.children" :key="i" :index="val.uri">{{val.name}}</el-menu-item>
  </el-sub-menu>
  <el-menu-item v-else :index="item.uri">
    <el-icon>
      <component :is="item.icon"/>
    </el-icon>
    <template #title>{{item.name}}</template>
  </el-menu-item>
</template>
<script>
  import {ref} from "vue";

  export default {
    name: 'MenuItem',
    props: {
      item: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        default: 0
      }
    },
    setup(props, {emit}) {
      const item = ref(props.item)
      const index = ref(props.index.toString())

      return {
        item,
        index
      }
    }
  }
</script>