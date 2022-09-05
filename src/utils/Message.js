import {ElNotification} from 'element-plus'

export const openElNotification = (data) => {
  console.log(data.info.message)
  ElNotification({
    title: '通知',
    dangerouslyUseHTMLString: true,
    message: MessageDispatch.dispatch(data),
    position: 'bottom-right',
    offset: 15
  })
}

const MessageDispatch = {
  'action': {
    text: 'textMessage',
    system: 'system'
  },
  dispatch: function (data) {
    return this[this.action[data.action]](data.info);
  },
  textMessage: function (data) {
    return '<p><strong>测试 <i>textMessage</i> textMessage</strong></p><p><strong>textMessage string</strong></p>';
  },
  system: function (data) {
    return `<p>${data.message}</p>`;
  }
};