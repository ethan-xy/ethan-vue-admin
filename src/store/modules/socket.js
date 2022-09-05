const state = {
  status: 'connecting',
}

const getters = {
  wsStatus: state => state.status,
}

const mutations = {
  SET_WS_STATUS (state, status) {
    state.status = status
  }
}

const actions = {

}

export default {
  state,
  getters,
  mutations,
  actions
}