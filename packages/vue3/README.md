# Find Intro, Usage, Prerequisites, and other in the [GitHub Repo](https://github.com/obadakhalili/vue-visual-filter)

# Installation

- From a package manager:

```sh
yarn add @visual-filter/vue3
# OR
npm install @visual-filter/vue3
```

```js
// JS
import VueVisualFilter from "@visual-filter/vue3"
// OR ESM distro
import VueVisualFilter from "@visual-filter/vue3/dist/component.esm.js"

// CSS
import "@visual-filter/vue3/dist/styles.css"
```

- For CDN users:

```html
<!-- CSS -->
<link
  rel="stylesheet"
  href="https://unpkg.com/@visual-filter/vue3@1.0.0/dist/styles.css"
/>
<!-- OR -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@visual-filter/vue3@1.0.0/dist/styles.css"
/>

<!-- JS -->
<script src="https://unpkg.com/@visual-filter/vue3@1.0.0/dist/component.min.js"></script>
<!-- OR -->
<script src="https://cdn.jsdelivr.net/npm/@visual-filter/vue3@1.0.0/dist/component.min.js"></script>
```

# Setting Up The Component

```js
const app = Vue.createApp({})

// Global installation
app.use(VueVisualFilter)
// OR
app.component(VueVisualFilter.name, VueVisualFilter)

app.mount("#app")

// Local installation in component's option
const app = Vue.createApp({
  components: { VueVisualFilter },
})

app.mount("#app")
```
