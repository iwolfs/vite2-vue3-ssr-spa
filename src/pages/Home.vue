<template>
  <h1>home</h1>
  <div>Render the page with SSR</div>
  <p>msg: {{store.state.message}}</p>
</template>

<script>
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    return {store}
  },
  asyncData({ store }) {
    return store.dispatch('fetchMessage');
  },
}
</script>

<style lang="scss" scoped>
p {
  color: $color-primary;
}
</style>