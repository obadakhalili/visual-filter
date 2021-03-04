import component from "@/VueVisualFilter/index.vue"
import "@/index.css"

export default (() => {
  const installable = component

  installable.install = (app) => {
    app.component(component.name, installable)
  }
  return installable
})()
