import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {},
  state: {
    activeCard: undefined
  },
  getters: {
    activeCard: (state) => state.activeCard
  },
  mutations: {
    SET_ACTIVE_CARD (state, thisCard) {
      state.activeCard = thisCard
    }
  },
  actions: {
    setActiveCard ({ commit }, thisCard) {
      commit('SET_ACTIVE_CARD', thisCard)
    },
    clearActiveCard ({ commit }) {
      commit('SET_ACTIVE_CARD', undefined)
    }
  }
})

export default store
