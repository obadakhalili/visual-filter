# The What

An unopinionated Vue visual filtering component. It's built with customizability in mind.

# Demo and Code Example

- GIF.

<br>

[![demo-gif.gif](https://s4.gifyu.com/images/demo-gif.gif)](https://gifyu.com/image/Z18P)

- You can find a complete code example in the [dev dir](https://github.com/obadakhalili/vue-visual-filter/tree/main/dev), within the library repo.

# Prerequisites

- Node version 12.0.0 or higher.
- NPM.

# Installation

- From a package manager:

```sh
yarn add vue-visual-filter
# OR
npm install vue-visual-filter
```

```js
// JS
import VueVisualFilter from "vue-visual-filter";
// OR ESM distro
import VueVisualFilter from "vue-visual-filter/dist/vue-visual-filter.esm.js";

// CSS
import "vue-visual-filter/dist/styles.css";
```

- For CDN users:

```html
<!-- CSS -->
<link
  rel="stylesheet"
  href="https://unpkg.com/vue-visual-filter@0.8.2/dist/styles.css"
/>

<!-- JS -->
<script src="https://unpkg.com/vue-visual-filter@0.8.2/dist/vue-visual-filter.min.js"></script>
<!-- OR -->
<script src="https://cdn.jsdelivr.net/npm/vue-visual-filter@0.8.2/dist/vue-visual-filter.min.js"></script>
```

## Setting Up The Component

```js
const app = Vue.createApp({});

// Global installation
app.use(VueVisualFilter);
// OR
app.component(VueVisualFilter.name, VueVisualFilter);

app.mount("#app");

// Local installation in components option
const app = Vue.createApp({
  components: { VueVisualFilter },
});

app.mount("#app");
```

# Usage

Once you're set up, and ready to start using the component. Reference the component's name in your template:

```vue
<template>
  <vue-visual-filter
    :filtering-options="filteringOptions"
    @filter-update="captureFilterUpdate"
  ></vue-visual-filter>
</template>
```

## The `filteringOptions` Prop

It contains two options:

- `data`: An array of objects that stores the data to be filtered. Definition:

```ts
interface Data {
  name: string;
  type: "numeric" | "nominal";
  values: any[];
}[];
```

- `methods`: An object that contains the methods to be used to filter the data. Definition:

```ts
interface Methods {
  numeric: Record<string, (cellValue: any, argument: string) => boolean>;
  nominal: Record<string, (cellValue: any, argument: string) => boolean>;
}
```

## The `filter-update` Event

An event prop that receives a function to be called whenever the filter updates. The function contains one parameter, `ctx`, which has in-reactive clones of `filter`, and `data` objects.

## Filter `slots`

Vue provides a content distribution API called slots. And it's leveraged here to build a custom filter that its elements and styling are provided by you.

Example:

```vue
<template>
  <vue-visual-filter
    v-if="filteringOptions"
    :filtering-options="filteringOptions"
    @filter-update="captureFilterUpdate"
  >
    <template #groupTypes="{ groupTypes, group }">
      <el-select v-model="group.groupType" size="small">
        <el-option
          v-for="type in groupTypes"
          :key="type"
          :value="type"
          :style="{ width: 'auto' }"
        ></el-option>
      </el-select>
    </template>

    <template #filterAddition="{ filterTypes, addFilter }">
      <el-dropdown
        @command="addFilter"
        split-button
        trigger="click"
        type="primary"
        size="mini"
      >
        <i class="el-icon-plus"></i>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="filter in filterTypes"
              :key="filter"
              :command="filter"
            >
              {{ filter }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>

    <template #groupDeletion="{ deleteGroup }">
      <el-button
        @click="deleteGroup"
        type="danger"
        icon="el-icon-close"
        size="mini"
        circle
      ></el-button>
    </template>

    <template #fieldUpdation="{ fieldNames, condition, updateField }">
      <el-select
        @change="updateField"
        v-model="condition.fieldName"
        size="small"
      >
        <el-option
          v-for="name in fieldNames"
          :key="name"
          :value="name"
        ></el-option>
      </el-select>
    </template>

    <template
      #methodUpdation="{ numericMethodNames, nominalMethodNames, condition }"
    >
      <el-select
        v-if="numericMethodNames"
        v-model="condition.method"
        no-data-text="No methods"
        size="small"
      >
        <el-option
          v-for="method in numericMethodNames"
          :key="method"
          :value="method"
        ></el-option>
      </el-select>

      <el-select
        v-else
        v-model="condition.method"
        no-data-text="No methods"
        size="small"
      >
        <el-option
          v-for="method in nominalMethodNames"
          :key="method"
          :value="method"
        ></el-option>
      </el-select>
    </template>

    <template #argumentUpdation="{ condition }">
      <el-input
        v-model="condition.argument"
        size="mini"
        placeholder="Argument"
        class="w-auto"
      ></el-input>
    </template>

    <template #conditionDeletion="{ deleteCondition }">
      <el-button
        @click="deleteCondition"
        type="danger"
        icon="el-icon-close"
        size="mini"
        circle
      ></el-button>
    </template>
  </vue-visual-filter>
</template>
```

The example above uses the [element-plus](http://element-plus.org/) UI framework for the filter components. But you can provide whichever content fits your need best.

# TODOs

- [ ] Integrate unit testing.
- [ ] Provide Vue 2 support.
- [ ] Rewrite using the composition API
- [ ] Rewrite using TypeScript.
- [ ] Rewrite the filter applying algorithm.
