import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  getters: {
    // authModalShow: (state) => state.authModalShow
  },
  mutations: {
    toggleAuthModal(state) {
      state.authModalShow = !state.authModalShow
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn
    }
  },
  actions: {
    async register({ commit }, payload) {

      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email,
        payload.password
      );

      await usersCollection.doc(userCred.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });
      await userCred.user.updateProfile({
        displayName: payload.name,
      })

      commit('toggleAuth');
    },
    init_login({ commit }) {
      if (auth.currentUser) commit('toggleAuth')
    },
    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password)

      commit('toggleAuth')
    },
    async signOut({ commit }) {
      await auth.signOut()
      commit('toggleAuth')
    }
  },
  // add new user to database
  modules: {
  },
});
