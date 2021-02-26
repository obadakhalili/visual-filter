import * as components from "@/lib-components/index"
import "@/index.css"

export default function(app) {
  Object.entries(components).forEach(([componentName, component]) =>
    app.component(componentName, component)
  )
}

export * from "@/lib-components/index"
