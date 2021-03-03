import { createApp } from "vue"
import Dev from "./serve.vue"
import {
  ElSelect,
  ElOption,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElButton
} from "element-plus"
import "element-plus/lib/theme-chalk/index.css"
import VueVisualFilter from "@/entry.esm"

const app = createApp(Dev)

app.component(ElSelect.name, ElSelect)
app.component(ElOption.name, ElOption)
app.component(ElDropdown.name, ElDropdown)
app.component(ElDropdownMenu.name, ElDropdownMenu)
app.component(ElDropdownItem.name, ElDropdownItem)
app.component(ElButton.name, ElButton)
app.use(VueVisualFilter)
app.mount("#app")
