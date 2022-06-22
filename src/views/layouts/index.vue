<template>
  <el-container class="layouts" style="height: 100%">
    <el-aside :width="isCollapse ? '65px' : '210px'" style="overflow-x: hidden;background-color: rgb(84, 92, 100);">
      <el-scrollbar height="100%">
        <h1 class="web-name" STYLE="color: rgb(191, 187, 187);text-align: center">
          <span v-if="isCollapse">E</span>
          <span v-else>ETHAN ADMIN</span>
        </h1>
        <el-menu
            :style="isCollapse ? 'width: 66px' : 'width: 211px'"
            active-text-color="#ffd04b"
            background-color="#545c64"
            default-active="1-1"
            text-color="#fff"
            :router="true"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
        >
          <view v-for="(menu, index) in menuItems">
            <el-sub-menu :index="'1'+index" :key="index" v-if="menu?.children">
              <template #title>
                <el-icon>
                  <component :is="menu.icon"/>
                </el-icon>
                <span>{{menu.name}}</span>
              </template>
              <el-menu-item v-for="(val, i) in menu?.children" :index="val.uri">{{val.name}}</el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="menu.uri">
              <el-icon>
                <component :is="menu.icon"/>
              </el-icon>
              {{menu.name}}
            </el-menu-item>
          </view>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header direction="vertical">
        <div data-v-ccf23852="" class="header-menu el-row">
          <div class="el-col el-col-1">
            <el-icon v-if="isCollapse" @click="menuOpenOrClose">
              <component is="Expand"/>
            </el-icon>
            <el-icon v-else @click="menuOpenOrClose">
              <component is="Fold"/>
            </el-icon>
          </div>
          <div class="el-col el-col-15">
            <el-breadcrumb separator="/" style="line-height: 60px">
              <el-breadcrumb-item v-for="bc in breadcrumb" :to="{ path: bc.path }" :key="bc.path"> {{ bc.meta.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="el-col el-col-8">
            <el-dropdown trigger="click" style="margin-right: 15px;float: right;margin-top: 18px">
              <el-icon size="16">
                <component is="User"/>
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!--            <el-badge is-dot style="position: absolute;right: 55px;top: 20px;}">-->
            <!--              <el-popover-->
            <!--                placement="left-end"-->
            <!--                title="消息通知"-->
            <!--                :width="200"-->
            <!--                trigger="click"-->
            <!--              >-->
            <!--                <span> Some content </span>-->
            <!--                <template #reference>-->
            <!--                  <el-icon size="16" style="position: absolute;right: 0; top: 0;">-->
            <!--                    <bell/>-->
            <!--                  </el-icon>-->
            <!--                </template>-->
            <!--              </el-popover>-->
            <!--            </el-badge>-->
          </div>
        </div>
      </el-header>
      <div class="tags-box">
        <div class="tags-left-btn" @click="tagsScroll(300)">
          <el-button>
            <el-icon>
              <ArrowLeftBold/>
            </el-icon>
          </el-button>
        </div>
        <div class="tags-right-btn" @click="tagsScroll(-300)">
          <el-button>
            <el-icon>
              <ArrowRightBold/>
            </el-icon>
          </el-button>
        </div>
        <div class="tags-close">
          <el-dropdown trigger="click">
            <el-button :plain="true">
              <el-icon>
                <CloseBold/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-item @click="closeAll">关闭全部</el-dropdown-item>
              <el-dropdown-item @click="closeOther">关闭其他</el-dropdown-item>
              <el-dropdown-item @click="closeRight">关闭右边</el-dropdown-item>
              <el-dropdown-item @click="closeLeft">关闭左边</el-dropdown-item>
            </template>
          </el-dropdown>

        </div>
        <div class="tags-list" ref="tagsListRef">
          <div class="tags-view" ref="tagsViewRef" :style="{left: tagsViewLeft + 'px'}">
            <el-tag
                :key="tag.fullPath"
                v-for="tag in tagList"
                :closable="tag.closable"
                :type="isActive(tag)"
                @click="openTagPage(tag)"
                @close="closeTagPage(tag)"
                :disable-transitions="false">
              <i class="el-icon-star-on" v-if="isStar(tag)"></i> {{tag.title}}
            </el-tag>
          </div>
        </div>
      </div>

      <el-main>
        <el-scrollbar height="100%">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {defineComponent, ref, computed} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import config from "@/config"
import {myMenu} from "@/api/menu"

export default({
  components: {},
  props: {
    isCollapse: Boolean
  },
  setup(props, {emit}) {
    let isCollapse = ref(false)
    let store = useStore()
    const route = useRoute()
    const router = useRouter()
    const tagsListRef = ref(null)
    const tagsViewRef = ref(null)
    let tagsViewLeft = ref(0)
    let menuItems = ref([])


    myMenu().then(response => {
      menuItems.value = response.data.data
    })

    store.dispatch('userPermissions', store.getters.provider)

    const isStar = (tag) => {
      return tag.fullPath === route.fullPath
    }

    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }

    const menuOpenOrClose = () => {
      isCollapse.value = !isCollapse.value
    }

    const tagsScroll = (offset) => {
      const tagsListWidth = tagsListRef.value.offsetWidth - 150
      const tagsViewWidth = tagsViewRef.value.offsetWidth

      if (tagsListWidth > tagsViewWidth) {
        return tagsViewLeft.value = 0
      }

      if (offset > 0) {
        return tagsViewLeft.value = Math.min(0, tagsViewLeft.value + offset)
      }

      if (tagsViewLeft.value > -(tagsViewWidth - tagsListWidth)) {
        tagsViewLeft.value = Math.max(tagsViewLeft.value + offset, tagsListWidth - tagsViewWidth)
      }
    }

    const closeAll = (tag) => {
      let tagList = []
      store.getters.tags.forEach((item, index) => {
        if (item.closable) {
          tagList.push(index)
        }
      })

      store.commit('CLOSE_TAG_HANDLE', tagList)
      router.push({path: config.dashboardFullPath})
    }

    const closeOther = () => {
      let tagList = []
      store.getters.tags.forEach((item, index) => {
        if (item.closable && item.fullPath !== route.fullPath) {
          tagList.push(index)
        }
      })

      store.commit('CLOSE_TAG_HANDLE', tagList)
    }

    const closeRight = () => {
      let tagList = []
      let flag = false
      store.getters.tags.forEach((item, index) => {
        if (item.fullPath === route.fullPath) {
          flag = true
        } else if (item.closable && flag) {
          tagList.push(index)
        }
      })

      store.commit('CLOSE_TAG_HANDLE', tagList)
    }

    const closeLeft = () => {
      let tagList = []
      let flag = true
      store.getters.tags.forEach((item, index) => {
        if (item.fullPath === route.fullPath) {
          flag = false
        }
        if (item.closable && flag) {
          tagList.push(index)
        }
      })

      store.commit('CLOSE_TAG_HANDLE', tagList)
    }

    let openTagPage = (tag) => {
      router.push({path: tag.fullPath})
    }

    let closeTagPage = (tag) => {
      store.dispatch('closeTagView', tag.fullPath)
    }

    const handleIndex = (index, i) => {
      return i >= 0 ? `${index + 1}-${i + 1}` : `${index + 1}`
    }

    const logout = () => {
      store.dispatch("logoutHandle", store.getters.provider).then(() => {
        router.push({
          name: config.loginRouteName
        })
      })
    }

    console.log(store.getters.breadcrumb)

    return {
      handleOpen,
      handleClose,
      isCollapse,
      menuOpenOrClose,
      tagsViewLeft,
      tagsListRef,
      tagsViewRef,
      tagsScroll,
      tagList: store.getters.tags,
      isStar,
      closeAll,
      isActive: (tag) => {
        return tag.fullPath === route.fullPath ? '' : 'info'
      },
      openTagPage,
      closeTagPage,
      breadcrumb: computed(() => store.getters.breadcrumb),
      menuItems,
      handleIndex,
      logout,
      closeOther,
      closeRight,
      closeLeft
    }
  },
})
</script>
<style lang="scss" scoped>
.tags-box {
  position: relative;
  height: 40px;
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
  overflow: hidden;
  width: 100%;

  .tags-left-btn {
    position: absolute;
    z-index: 10;
    left: 0;
  }

  .tags-right-btn {
    position: absolute;
    z-index: 10;
    right: 44px;
    border-right: 1px solid #e6e6e6;
  }

  .tags-close {
    position: absolute;
    z-index: 10;
    right: 0;
  }

  .tags-list {
    position: absolute;
    left: 45px;
    width: 100%;

    .tags-view {
      margin-top: 3px;
      position: absolute;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}

.el-button {
  padding: 10px 15px;
  border: none;
  height: 39px;
}

.el-tag {
  margin-left: 5px;
  cursor: pointer;
}
</style>
<style>
.layouts .el-header {
  line-height: 60px;
}
</style>
