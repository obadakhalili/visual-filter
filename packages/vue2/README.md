# Installation

- From a package manager:

```sh
yarn add @visual-filter/vue2
# OR
npm install @visual-filter/vue2
```

```js
// JS
import VueVisualFilter from "@visual-filter/vue2"
// OR ESM distro
import VueVisualFilter from "@visual-filter/vue2/dist/component.esm.js"

// CSS
import "@visual-filter/vue2/dist/styles.css"
```

- For CDN users:

```html
<!-- CSS -->
<link rel="stylesheet" href="" />

<!-- JS -->
<script src=""></script>
<!-- OR -->
<script src=""></script>
```

# Setting Up The Component

```js
const app = Vue.createApp({})

// Global installation
Vue.use(VueVisualFilter)
// OR
Vue.component(VueVisualFilter.name, VueVisualFilter)

new Vue({}).$mount("#app")

// Local installation in component's option
new Vue({
  components: { VueVisualFilter },
}).$mount("#app")
```
