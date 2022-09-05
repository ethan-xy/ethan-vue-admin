import store from "@/store"
import {openElNotification} from "./Message"


let Socket = ''
let setIntervalWesocketPush = null

/**
 * 建立websocket连接
 * @param {string} url ws地址
 */
export const createSocket = url => {
  Socket && Socket.close()
  if (!Socket) {
    console.log('建立websocket连接')
    Socket = new WebSocket(url)
    Socket.onopen = onopenWS
    Socket.onmessage = onmessageWS
    Socket.onerror = onerrorWS
    Socket.onclose = oncloseWS
  } else {
    console.log('websocket已连接')
  }
}

/**打开WS之后发送心跳 */
const onopenWS = () => {
  sendPing(1000 * 60)
}

/**连接失败重连 */
const onerrorWS = () => {
  Socket.close()
  console.log('连接失败重连中')
}

/**WS数据接收统一处理 */
const onmessageWS = e => {
  console.log('接收信息')
  openElNotification(JSON.parse(e.data))
}

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = message => {
  setTimeout(() => {
    if (Socket.readyState === 0) {
      connecting(message)
    } else {
      Socket.send(JSON.stringify(message))
    }
  }, 1000)
}

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWSPush = message => {
  if (Socket !== null && Socket.readyState === 3) {
    Socket.close()
    createSocket(`${import.meta.env.VITE_WS_URI}?token=${store.getters.token.token}`)
  } else if (Socket.readyState === 1) {
    Socket.send(JSON.stringify(message))
  } else if (Socket.readyState === 0) {
    connecting(message)
  }
}

/**断开重连 */
const oncloseWS = () => {
  clearInterval(setIntervalWesocketPush)
  console.log('websocket已断开....正在尝试重连')

  if (Socket.readyState !== 2) {
    //重连
    setTimeout(function () {
      Socket = null
      createSocket(`${import.meta.env.VITE_WS_URI}?token=${store.getters.token.token}`)
    }, 6000);
  }
}

/**发送心跳
 * @param {number} time 心跳间隔毫秒 默认5000
 * @param {string} ping 心跳名称 默认字符串ping
 */
export const sendPing = (time = 10000, ping = 'ping') => {
  clearInterval(setIntervalWesocketPush)
  console.log('ping')
  Socket.send(ping)
  setIntervalWesocketPush = setInterval(() => {
    console.log('setInterval ping')
    Socket.send(ping)
  }, time)
}