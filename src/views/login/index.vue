<template>
  <Particles
      id="tsparticles"
      :particlesInit="particlesInit"
      :options="options"
  />
  <div>
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <template #prepend>
              <el-button>
                <el-icon>
                  <User/>
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="param.password"
                    @keyup.enter="submitForm()">
            <template #prepend>
              <el-button>
                <el-icon>
                  <Lock/>
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {ref, reactive} from "vue";
  import {useRouter} from "vue-router"
  import {useStore} from 'vuex'
  import {Lock, User} from '@element-plus/icons'
  import config from '@/config'
  import {messageSuccess} from '@/utils/helper'
  import { loadFull } from "tsparticles";

  export default {
    components: {Lock, User},
    setup() {
      const store = useStore()
      const router = useRouter();
      const param = reactive({
        username: null,
        password: null,
        provider: 'admin'
      });
      const rules = {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
        ],
      };
      const login = ref(null);
      const submitForm = () => {
        login.value.validate((valid) => {
          if (valid) {
            store.dispatch("loginHandle", param).then(res => {
              messageSuccess("登录成功");
              router.push({
                name: config.homeRouteName
              })
            })
          }
        });
      }

      const particlesInit = async (engine) => {
        await loadFull(engine);
      }

      const options = {
        background: {
          color: {
            value: '#0d47a1'
          }
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push'
            },
            onHover: {
              enable: true,
              mode: 'repulse'
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40
            },
            push: {
              quantity: 4
            },
            repulse: {
              distance: 200,
              duration: 0.4
            }
          }
        },
        particles: {
          color: {
            value: '#ffffff'
          },
          links: {
            color: '#ffffff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1
          },
          collisions: {
            enable: true
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce'
            },
            random: false,
            speed: 6,
            straight: false
          },
          number: {
            density: {
              enable: true,
              area: 800
            },
            value: 80
          },
          opacity: {
            value: 0.5
          },
          shape: {
            type: 'circle'
          },
          size: {
            value: { min: 1, max: 5 },
          }
        },
        detectRetina: true
      }

      return {
        param,
        rules,
        login,
        submitForm,
        options,
        particlesInit
      };
    },
  };
</script>

<style scoped>

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px 30px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }
</style>