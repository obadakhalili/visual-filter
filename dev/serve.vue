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
              return cellValue === argument
            },
            ">"(cellValue, argument) {
              return cellValue > argument
            },
            ">="(cellValue, argument) {
              return cellValue >= argument
            },
            "<"(cellValue, argument) {
              return cellValue < argument
            },
            "<="(cellValue, argument) {
              return cellValue <= argument
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
      ctx
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
        <select v-model="group.groupType">
          <option v-for="type in groupTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </template>
      <template #filterAddition="{ filterTypes, addFilter }">
        <select @change="addFilter($event.target.value)">
          <option v-for="type in filterTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </template>
      <template #groupDeletion="{ deleteGroup }">
        <button @click="deleteGroup">x</button>
      </template>
      <template #fieldUpdation="{ fieldNames, updateField }">
        <select @change="updateField($event.target.value)">
          <option v-for="field in fieldNames" :key="field" :value="field">
            {{ field }}
          </option>
        </select>
      </template>
      <template
        #methodUpdation="{ numericMethodNames, nominalMethodNames, updateMethod }"
      >
        <select @change="updateMethod($event.target.value)">
          <option
            v-for="method in numericMethodNames || nominalMethodNames"
            :key="method"
            :value="method"
          >
            {{ method }}
          </option>
        </select>
      </template>
      <template #argumentUpdation="{ argument, updateArgument }">
        <input
          type="text"
          @input="updateArgument($event.target.value)"
          :value="argument"
        />
      </template>
      <template #conditionDeletion="{ deleteCondition }">
        <button @click="deleteCondition">x</button>
      </template>
    </VueVisualFilter>
  </div>
</template>
