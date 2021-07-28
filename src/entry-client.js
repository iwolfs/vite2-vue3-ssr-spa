import { createSSRApp, createApp } from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App.vue'

import createStore from './store'
import createRouter from './router'

const store = createStore()
const router = createRouter()

sync(store, router)


const app = window.__INITIAL_STATE__ ? createSSRApp(App) : createApp(App)
// const app = createSSRApp(App)
app.use(router).use(store)

router.beforeResolve((to, from, next) => {
  let diffed = false;
  const matched = router.resolve(to).matched;
  const prevMatched = router.resolve(from).matched;

  if (from && !from.name) {
    return next();
  } else {
    window.document.title = to?.meta?.title || '首页'
  }
  
  const activated = matched.filter((c, i) => {
    return diffed || (diffed = prevMatched[i] !== c);
  });

  if (!activated.length) {
    return next();
  }

  const matchedComponents = [];
  matched.map((route) => {
    matchedComponents.push(...Object.values(route.components));
  });
  const asyncDataFuncs = matchedComponents.map((component) => {
    const asyncData = component.asyncData || null;
    if (asyncData) {
      const config = {
        store,
        route: to,
      };

      return asyncData(config);
    }
  });
  try {
    Promise.all(asyncDataFuncs).then(() => {
      next();
    });
  } catch (err) {
    next(err);
  }

})

router.isReady().then(() => {
  app.mount('#app', true)
})

if (window.__INITIAL_STATE__) {  
  store.replaceState(window.__INITIAL_STATE__); 
}