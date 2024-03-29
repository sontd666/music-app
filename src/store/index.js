import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import { Howl } from 'howler';
import helpers from '@/includes/helpers'

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  getters: {
    // authModalShow: (state) => state.authModalShow
    playing: state => {
      if (state.sound.playing) return state.sound.playing()
      return false
    }
  },
  mutations: {
    toggleAuthModal(state) {
      state.authModalShow = !state.authModalShow
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn
    },
    newSong(state, payload) {
      state.currentSong = payload
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      })
    },
    updatePosition(state) {
      state.seek = helpers.formatTime(state.sound.seek())
      state.duration = helpers.formatTime(state.sound.duration())
      state.playerProgress = `${state.sound.seek() / state.sound.duration() * 100}%`
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
    },
    async newSong({ commit, state, dispatch }, payload) {
      if (state.sound instanceof Howl) state.sound.unload()
      commit('newSong', payload)

      state.sound.play()

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress')
        })
      })
    },
    toggleAudio({ state }) {
      if (!state.sound.playing) return
      if (state.sound.playing()) state.sound.pause()
      else state.sound.play()
    },
    progress({ state, commit, dispatch }) {
      commit('updatePosition')

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress')
        })
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) return

      const { x, width } = payload.currentTarget.getBoundingClientRect()
      const clickX = payload.clientX - x;

      const percentage = clickX / width

      const seconds = percentage * state.sound.duration()
      state.sound.seek(seconds)

      state.sound.once('seek', () => {
        dispatch('progress')
      })
  },
},
  // add new user to database
  modules: {
  },
});
