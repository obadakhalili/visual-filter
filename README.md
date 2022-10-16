# The What

A headless unopinionated advanced Vue visual filtering component. It's built with customizability in mind.

# Demo and Code Example

- GIF.

<br>

![Demo GIF](https://madewithnetworkfra.fra1.digitaloceanspaces.com/spatie-space-production/27996/vue-visual-filter-k.gif)

# Prerequisites

- Node version 12.0.0 or higher.
- NPM.

# Installation, and Setting Up The Component

- [@visual-filter/vue2](https://github.com/obadakhalili/vue-visual-filter/tree/main/packages/vue2)
- [@visual-filter/vue3](https://github.com/obadakhalili/vue-visual-filter/tree/main/packages/vue3)

# Usage (for both @visual-filter/vue2, and @visual-filter/vue3)

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
  name: string
  type: "numeric" | "nominal"
  values: any[]
}
;[]
```

- `methods`: An object that contains the methods to be used to filter the data. Definition:

```ts
interface Methods {
  numeric: Record<string, (cellValue: any, argument: string) => boolean>
  nominal: Record<string, (cellValue: any, argument: string) => boolean>
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
    :filtering-options="filteringOptions"
    @filter-update="captureFilterUpdate"
  >
    <template #groupTypes="{ groupTypes, group }">
      <el-select v-model="group.groupType" size="small">
        <el-option
          v-for="type in groupTypes"
          :key="type"
          :value="type"
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
        :style="{ width: 'auto' }"
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
