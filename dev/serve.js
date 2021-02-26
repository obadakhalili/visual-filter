import { createApp } from "vue"
import Dev from "./serve.vue"
import VueVisualFilter from "@/entry.esm"

const app = createApp(Dev)

app.use(VueVisualFilter)
app.mount("#app")
