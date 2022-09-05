<template>
  <router-view></router-view>
</template>

<script>
  import {computed, onMounted, watch} from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import { routeFormatTag } from '@/utils/helper'
  import config from '@/config'

  export default {
    name: "App",
    setup(props, {emit}) {
      const route = useRoute()
      const store = useStore()

      onMounted(() => {
        store.commit('SET_BREADCRUMB', route.matched)
      })

      watch(route, () => {
        store.commit('SET_BREADCRUMB', route.matched)
        if (route.name !== config.loginRouteName) {
          store.dispatch("openTagView", routeFormatTag(route))
        }
      })
    }
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .router-link-active {
    color: orange;
  }

  .router-link-exact-active {
    color: crimson;
  }
</style>

<style scoped>
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li:not(:last-of-type) {
    margin-right: 1rem;
  }
</style>