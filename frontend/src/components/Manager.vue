<template>
  <div class="manager-container">
    <p><span class="interpreted-text">Python Interpreter: </span>
      <el-select id="selector" v-model="defaultInterpreter" placeholder="正在检测 Python 解释器路径">
        <el-option
          v-for="item in options"
          :key="item.path"
          :label="item.value"
          :value="item.path">
        </el-option>
      </el-select>
    </p>
    <!--Package list-->
    <el-table
      :data="packageList"
      border
      stripe
      tooltip-effect="dark"
      show-overflow-tooltip
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        fixed
        sortable
        prop="package"
        label="Package"
        width="420">
      </el-table-column>
      <el-table-column
        prop="version"
        label="Version"
        width="120">
      </el-table-column>
      <el-table-column
        prop="latest"
        label="Latest"
        width="120">
      </el-table-column>
      <el-table-column
        prop="summary"
        label="Summary">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Operation"
        width="200">
        <template slot-scope="scope">
          <el-button @click="upgrade(scope.row)" type="text" size="small">Upgrade</el-button>
          <el-button @click="uninstall(scope.row)" type="text" size="small">Uninstall</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  export default {
    name: 'Manager',
    data() {
      return {
        options: [],
        defaultInterpreter: '',
        /*
        {
          package: 'Django',
          version: '1.11.13',
          latest: '1.11.13',
          summary: 'A high-level Python Web framework that encourages rapid development and clean, pragmatic design.',
        }
        */
        packageList: [],
        multipleSelection: []
      }
    },
    created() {
      this.$axios.get('/interpreters')
        .then(response => {
          let data = response.data;
          this.options = data.map(val => {
            val.value = 'Python ' + val.version + ' (' + val.path + ')';
            return val
          });
          if (this.options.length === 0) {
            this.defaultInterpreter = 'No Python Interpreter Was Detected.';
          } else {
            this.defaultInterpreter = this.options[0].value;
            this.get_simple_list()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    methods: {
      get_simple_list() {
        this.$axios.get('/simple_list')
          .then(response => {
            this.packageList = response.data;
          })
          .catch(error => {
            console.log(error);
          });
      },
      upgrade(row) {
        console.log(row);
      },
      uninstall(row) {
        console.log(row);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
  }
</script>

<style lang="scss">
  $main_color: #409EFF;
  body {
    margin: 0;
    padding: 0;
  }

  .manager-container {
    margin: 20px 26px 26px 20px;
    p {
      display: flex;
      .el-select {
        flex: 1;
        margin-left: 2em;
        #selector {
          font-weight: bold;
          color: $main_color;
        }
      }
    }
    .interpreted-text {
      font-weight: bold;
      font-family: monospace, sans-serif;
      font-size: 1.2em;
    }
  }
</style>
