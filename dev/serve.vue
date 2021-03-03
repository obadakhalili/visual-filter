<script>
export default {
  name: "ServeDev",
  data() {
    return {
      filteringOptions: {
        data: [
          {
            name: "First Name",
            type: "nominal",
            values: ["Obada", "Ahmad"]
          },
          {
            name: "Last Name",
            type: "nominal",
            values: ["Khalili", "Drhili"]
          },
          {
            name: "Grade",
            type: "numeric",
            values: [3.72, 3.5]
          }
        ],
        methods: {
          numeric: {
            "="(cellValue, argument) {
              return cellValue === Number(argument)
            },
            ">"(cellValue, argument) {
              return cellValue > Number(argument)
            },
            ">="(cellValue, argument) {
              return cellValue >= Number(argument)
            },
            "<"(cellValue, argument) {
              return cellValue < Number(argument)
            },
            "<="(cellValue, argument) {
              return cellValue <= Number(argument)
            }
          },
          nominal: {
            contains(cellValue, argument) {
              return cellValue.includes(argument)
            },
            startsWith(cellValue, argument) {
              return cellValue.startsWith(argument)
            },
            endsWith(cellValue, argument) {
              return cellValue.endsWith(argument)
            }
          }
        }
      }
    }
  },
  methods: {
    captureFilterUpdate(ctx) {
      // ctx object that contains in-reactive clones of filter, and data objects
      console.log(ctx)
    }
  }
}
</script>

<template>
  <div id="app">
    <VueVisualFilter
      :filtering-options="filteringOptions"
      @filter-update="captureFilterUpdate"
    >
      <template #groupTypes="{ groupTypes, group }">
        <el-select v-model="group.groupType" size="small">
          <el-option
            v-for="type in groupTypes"
            :key="type"
            :value="type"
            class="w-auto"
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
        <el-select v-model="condition.method" size="small">
          <el-option
            v-for="method in numericMethodNames || nominalMethodNames"
            :key="method"
            :value="method"
          ></el-option>
        </el-select>
      </template>
      <template #argumentUpdation="{ condition }">
        <el-input
          v-model="condition.argument"
          size="mini"
          placeholder="Input value"
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
    </VueVisualFilter>
  </div>
</template>
