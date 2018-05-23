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
      <el-button type="primary" plain @click="getCheckLatestData">Check Latest</el-button>
      <el-button type="success" plain @click="postUpgradeData('')">Upgrade</el-button>
      <el-button type="danger" plain @click="postUninstallData('')">Uninstall</el-button>
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
            <el-button @click="postUpgradeData([scope.row.package])" type="success" size="small">Upgrade</el-button>
            <el-button @click="postUninstallData([scope.row.package])" type="danger" size="small">Uninstall</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  const TAG_DEFAULT_LATEST = '---';
  const TAG_WAIT_LATEST = 'Checking the update...';
  const UPDATE_SUCCESS = 'SUCCESS';
  const UPDATE_FAILED = 'FAILED';
  const UPDATING = 'Updating...';
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
            this.getSimpleListData()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    methods: {
      getSimpleListData() {
        this.$axios.get('/simple_list')
          .then(response => {
            this.packageList = response.data.map(val => {
              val.summary = "Searching for summary...";
              return val
            });
            this.loading = false;
            this.postSummaryData()
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
            this.$message.error('Get Python package list error!');
          });
      },
      postSummaryData() {
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
      getPkgsFromSelection() {
        return this.multipleSelection.map(val => {
          return val.package
        })
      },
      getCheckLatestData() {
        this.packageList.forEach((val, index) => {
          val.latest = TAG_WAIT_LATEST;
          // update package list
          Vue.set(this.packageList, index, val);
        });
        this.$axios.get('/check_latest')
          .then(response => {
            let latestVersions = response.data;
            this.packageList.forEach((val, index) => {
              if (latestVersions.hasOwnProperty(val.package)) {
                val.latest = latestVersions[val.package].latest_version;
              } else {
                val.latest = TAG_DEFAULT_LATEST;
              }
              // update package list
              Vue.set(this.packageList, index, val);
            })
          })
          .catch(error => {
            console.log(error);
          });
      },
      postUpgradeData(pkg) {
        if (pkg === '') {
          pkg = this.getPkgsFromSelection()
        }
        this.packageList.forEach((val, index) => {
          if (pkg.indexOf(val.package) >= 0) {
            val.version = UPDATING;
            // update package list
            Vue.set(this.packageList, index, val);
          }
        });
        // console.log(pkg);
        let params = new URLSearchParams();
        params.append('list', JSON.stringify(pkg));
        this.$axios.post('/postUpgradeData', params)
          .then(response => {
            let upgradeDict = response.data;
            console.log(upgradeDict);
            this.packageList.forEach((val, index) => {
              if (upgradeDict.hasOwnProperty(val.package)) {
                let result = upgradeDict[val.package];
                if (result === 'success') {
                  if (val.latest === undefined || val.latest === TAG_DEFAULT_LATEST || val.latest === TAG_WAIT_LATEST) {
                    val.version = UPDATE_SUCCESS
                  } else {
                    val.version = UPDATE_SUCCESS + ' : ' + val.latest
                  }
                } else if (result === 'failed') {
                  val.version = UPDATE_FAILED
                }
                // update package list
                Vue.set(this.packageList, index, val);
              }
            })
          })
          .catch(error => {
            console.log(error);
            this.$message.error('Get Python package summary error!');
          });

      },
      postUninstallData(pkg) {
        if (pkg === '') {
          pkg = this.getPkgsFromSelection()
        }
        console.log(pkg);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      tableRowClassName({row, rowIndex}) {
        let style = '';
        if (row.latest !== undefined && row.latest !== TAG_DEFAULT_LATEST && row.latest !== TAG_WAIT_LATEST) {
          style = 'warning-row';
        }
        if (row.version.indexOf(UPDATE_SUCCESS) === 0) {
          style = 'success-row';
        } else if (row.version.indexOf(UPDATE_FAILED) === 0) {
          style = 'failed-row';
        } else if (row.version.indexOf(UPDATING) === 0) {
          style = 'updating-row';
        }
        return style
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
    background: #defdff;
  }

  .el-table .failed-row {
    background: #feebdd;
  }

  .el-table .success-row {
    background: #def9d7;
  }

  .el-table .updating-row {
    background: #e6e6e6;
  }
</style>
