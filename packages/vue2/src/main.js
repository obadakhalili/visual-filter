import Vue from "vue"

import VueVisualFilter from "./VueVisualFilter/index.vue"
import "./index.css"

VueVisualFilter.install = () => {
  Vue.component(VueVisualFilter.name, VueVisualFilter)
}

export default VueVisualFilter
