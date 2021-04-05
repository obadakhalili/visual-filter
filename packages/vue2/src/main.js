import Vue from "vue"

import VueVisualFilter from "@/VueVisualFilter/index.vue"

VueVisualFilter.install = () => {
  Vue.component(VueVisualFilter.name, VueVisualFilter)
}

export default VueVisualFilter
