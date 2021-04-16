import Vue from "vue"

import VueVisualFilter from "@/main.js"

import Serve from "./Serve.vue"

Vue.use(VueVisualFilter)

new Vue({
  render: (h) => h(Serve),
}).$mount("#app")
