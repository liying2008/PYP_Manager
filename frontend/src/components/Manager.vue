<template>
  <div class="manager-container">
    <p id="p_interpreter"><span class="interpreted-text">Python Interpreter: </span>
      <el-select id="selector" v-model="defaultInterpreter" placeholder="正在检测 Python 解释器路径">
        <el-option
          v-for="item in options"
          :key="item.path"
          :label="item.value"
          :value="item.path">
        </el-option>
      </el-select>
    </p>
    <p id="p_buttons">
      <span class="empty"></span>
      <el-button type="primary" plain @click="checkLatest">Check Latest</el-button>
      <el-button type="success" plain @click="upgrade('')">Upgrade</el-button>
      <el-button type="danger" plain @click="uninstall('')">Uninstall</el-button>
      <el-button type="primary" icon="el-icon-plus" circle></el-button>
      <el-button type="info" icon="el-icon-setting" circle></el-button>
    </p>
    <div class="manager-container-table">
      <!--Package list-->
      <el-table
        :data="packageList"
        :row-class-name="tableRowClassName"
        v-loading="loading"
        border
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
            <el-button @click="upgrade([scope.row.package])" type="success" size="small">Upgrade</el-button>
            <el-button @click="uninstall([scope.row.package])" type="danger" size="small">Uninstall</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  let defaultLatest = '---';
  export default {
    name: 'Manager',
    data() {
      return {
        loading: true,
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
            this.packageList = response.data.map(val => {
              val.summary = "Searching for summary...";
              return val
            });
            this.loading = false;
            this.get_summary()
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
            this.$message.error('Get Python package list error!');
          });
      },
      get_summary() {
        let list = this.packageList.map(val => {
          return val.package
        });
        let params = new URLSearchParams();
        params.append('list', JSON.stringify(list));
        // params.append('list', JSON.stringify(['Django']));
        this.$axios.post('/summary', params)
          .then(response => {
            let summaryDict = response.data;
            // console.log(summary_dict);
            this.packageList.forEach((val, index) => {
              val.summary = summaryDict[val.package].summary;
              // update package list
              Vue.set(this.packageList, index, val);
            })
          })
          .catch(error => {
            console.log(error);
            this.$message.error('Get Python package summary error!');
          });
      },
      get_pkgs_from_selection() {
        return this.multipleSelection.map(val => {
          return val.package
        })
      },
      checkLatest() {
        this.$axios.get('/check_latest')
          .then(response => {
            let latestVersions = response.data;
            this.packageList.forEach((val, index) => {
              if (latestVersions.hasOwnProperty(val.package)) {
                val.latest = latestVersions[val.package].latest_version;
              } else {
                val.latest = defaultLatest;
              }
              // update package list
              Vue.set(this.packageList, index, val);
            })
          })
          .catch(error => {
            console.log(error);
          });
      },
      upgrade(pkg) {
        if (pkg === '') {
          pkg = this.get_pkgs_from_selection()
        }
        console.log(pkg);
      },
      uninstall(pkg) {
        if (pkg === '') {
          pkg = this.get_pkgs_from_selection()
        }
        console.log(pkg);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      tableRowClassName({row, rowIndex}) {
        if (row.latest !== undefined && row.latest !== defaultLatest) {
          return 'warning-row';
        } else {
          return '';
        }
      }
    }
  }
</script>

<style lang="scss">
  $main_color: #409EFF;

  .manager-container {
    margin: 20px 26px 26px 20px;
    p#p_interpreter {
      display: flex;
      justify-content: center; /*水平居中*/
      align-items: center; /*垂直居中*/

      .el-select {
        flex: 1;
        margin-left: 2em;
        #selector {
          font-weight: bold;
          color: $main_color;
        }
      }
    }
    p#p_buttons {
      display: flex;
      justify-content: space-between;
      span.empty {
        flex: 1;
      }
    }
    .interpreted-text {
      font-weight: bold;
      font-family: monospace, sans-serif;
      font-size: 1.2em;
    }
  }

  .el-table .warning-row {
    background: oldlace;
  }
</style>
