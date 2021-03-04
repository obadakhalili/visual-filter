import { createApp } from "vue"
import Dev from "./serve.vue"
import {
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElButton,
  ElInput,
  ElTable,
  ElTableColumn
} from "element-plus"
import "element-plus/lib/theme-chalk/index.css"
import VueVisualFilter from "@/entry.esm"

const app = createApp(Dev)

app.component(ElRow.name, ElRow)
app.component(ElCol.name, ElCol)
app.component(ElSelect.name, ElSelect)
app.component(ElOption.name, ElOption)
app.component(ElDropdown.name, ElDropdown)
app.component(ElDropdownMenu.name, ElDropdownMenu)
app.component(ElDropdownItem.name, ElDropdownItem)
app.component(ElButton.name, ElButton)
app.component(ElInput.name, ElInput)
app.component(ElTable.name, ElTable)
app.component(ElTableColumn.name, ElTableColumn)
app.use(VueVisualFilter)
app.mount("#app")
