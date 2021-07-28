// import { createStore } from 'vuex'

// const state = {
//   messate: 'Hello vite2 vue3 ssr'
// }

// const getters = {

// }

// const mutations = {

// }

// const actions = {
//   fetchMessage({ state }) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         state.message = 'Hello vite2 vue3 ssr scss vuex vue-router';
//         resolve(0);
//       }, 200)
//     })
//   }
// }

// export default () => createStore({
//   state,
//   getters,
//   mutations,
//   actions,
//   modules: {},
// })

import { createStore as _createStore } from 'vuex';

export default function createStore() {
  return _createStore({
    state: {
      message: 'Hello vite2 vue3 ssr',
    },
    mutations: {},
    actions: {
      fetchMessage: ({ state }) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            state.message = 'Hello vite2 vue3 ssr scss vuex vue-router';
            resolve(0);
          }, 200);
        });
      },
    },
    modules: {},
  });
}