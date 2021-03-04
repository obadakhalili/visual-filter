<script>
export default {
  name: "ServeDev",
  async beforeCreate() {
    this.users = await (
      await fetch("https://jsonplaceholder.typicode.com/users")
    ).json()

    for (let user of this.users) {
      for (let key in user) {
        if (user[key] === Object(user[key])) {
          delete user[key]
        }
        user.age = Math.ceil(Math.random() * 120)
      }
    }

    this.filteringOptions = {}
    this.filteringOptions.methods = {
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

    this.filteringOptions.data = Object.entries(this.users[0]).map(
      ([key, value]) => ({
        name: key,
        type: typeof value === "number" ? "numeric" : "nominal",
        values: []
      })
    )
    this.users.forEach((user) =>
      this.filteringOptions.data.forEach((field) =>
        field.values.push(user[field.name])
      )
    )
  },
  data() {
    return {
      users: null,
      filteringOptions: null
    }
  },
  computed: {
    userInfo() {
      return Object.keys(this.users?.[0] || {})
    }
  },
  methods: {
    captureFilterUpdate(ctx) {
      // ctx object that contains in-reactive clones of filter, and data objects
      this.users = Array(ctx.data[0].values.length)
        .fill(null)
        .map((_, index) =>
          ctx.data.reduce(
            (user, field) => ({
              ...user,
              [field.name]: field.values[index]
            }),
            {}
          )
        )
    }
  }
}
</script>

<template>
  <div id="app">
    <el-row>
      <el-col :span="15">
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
      </el-col>
      <el-col :span="9">
        <el-table :data="users" stripe>
          <el-table-column
            v-for="info in userInfo"
            :key="info"
            :prop="info"
            :label="info"
          ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
