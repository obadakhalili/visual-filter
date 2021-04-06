import VueVisualFilter from "./VueVisualFilter/index.vue"
import "./index.css"

VueVisualFilter.install = (app) => {
  app.component(VueVisualFilter.name, VueVisualFilter)
}

export default VueVisualFilter
