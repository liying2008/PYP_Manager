<template>
  <div id="manager-container">
    <p id="p_interpreter"><span class="interpreted-text">{{$t('manager.interpreter')}}</span>
      <el-select id="selector" v-model="defaultInterpreter"
                 :placeholder="$t('manager.interpreterPlaceholder')">
        <el-option
          v-for="item in options"
          :key="item.path"
          :label="item.value"
          :value="item.path">
        </el-option>
      </el-select>
    </p>
    <div v-loading="loading">
      <p id="p_buttons">
      <span>
        <span id="tips" v-show="!hasCheckedUpgrade" v-html="$t('manager.checkLatestTip')"></span>
      </span>
        <el-button type="primary" plain @click="getCheckLatestData">{{$t('manager.checkLatest')}}</el-button>
        <el-button type="success" plain @click="postUpgradeData('')">{{$t('common.upgrade')}}</el-button>
        <el-button type="danger" plain @click="postUninstallData('')">{{$t('common.uninstall')}}</el-button>
        <el-button type="primary" icon="el-icon-plus" circle @click="searchDialogVisible=true"></el-button>
        <el-button type="info" icon="el-icon-setting" circle @click="settingsDialogVisible=true"></el-button>
      </p>
      <div class="manager-container-table">
        <!--Package list-->
        <el-table
          border
          tooltip-effect="dark"
          show-overflow-tooltip
          :data="packageList"
          :row-class-name="tableRowClassName"
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
            width="420"
            :label="$t('common.package')">
          </el-table-column>
          <el-table-column
            prop="version"
            :label="$t('common.version')"
            width="120">
          </el-table-column>
          <el-table-column
            prop="latest"
            width="120"
            :label="$t('manager.latest')">
          </el-table-column>
          <el-table-column
            prop="summary"
            :label="$t('common.summary')">
          </el-table-column>
          <el-table-column
            fixed="right"
            width="200"
            :label="$t('common.operation')">
            <template slot-scope="scope">
              <el-button @click="postUpgradeData([scope.row.package])" type="success" size="small"
                         :disabled="upgradeDisabled[scope.row.package]">{{$t('common.upgrade')}}
              </el-button>
              <el-button @click="postUninstallData([scope.row.package])" type="danger" size="small">
                {{$t('common.uninstall')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <search-package
        :show="searchDialogVisible"
        @closeDialog="searchDialogVisible=false">
      </search-package>
      <settings
        :show="settingsDialogVisible"
        @closeDialog="settingsDialogVisible=false">
      </settings>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import SearchPackage from './search/SearchPackage'
  import Settings from './settings/Settings'

  export default {
    name: 'Manager',
    data() {
      return {
        hasCheckedUpgrade: false,
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
        multipleSelection: [],
        searchDialogVisible: false,
        settingsDialogVisible: false,
        upgradeDisabled: {},
        // Some Constants
        TAG_DEFAULT_LATEST: this.$t('manager.tagDefaultLatest'),
        TAG_WAIT_LATEST: this.$t('manager.tagWaitLatest'),
        UPDATE_SUCCESS: this.$t('common.updateSuccess'),
        UPDATE_FAILED: this.$t('common.updateFailed'),
        UPDATING: this.$t('common.updating'),
        UNINSTALLING: this.$t('common.uninstalling'),
        UNINSTALL_FAILED: this.$t('common.uninstallFailed')
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
            this.defaultInterpreter = this.$t('manager.noInterpreter');
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
              val.summary = this.$t('manager.searchSummaryTip');
              this.upgradeDisabled[val.package] = true;
              return val
            });
            this.loading = false;
            this.postSummaryData()
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
            this.$message.error(this.$t('manager.packageListErr'));
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
              if (val.summary === '') {
                val.summary = this.$t('manager.noSummary')
              }
              // update package list
              Vue.set(this.packageList, index, val);
            })
          })
          .catch(error => {
            console.log(error);
            this.$message.error(this.$t('manager.getSummaryErr'));
          });
      },
      getPkgsFromSelection() {
        return this.multipleSelection.map(val => {
          return val.package
        })
      },
      getCheckLatestData() {
        this.packageList.forEach((val, index) => {
          val.latest = this.TAG_WAIT_LATEST;
          // update package list
          Vue.set(this.packageList, index, val);
        });
        this.$axios.get('/check_latest')
          .then(response => {
            let latestVersions = response.data;
            this.packageList.forEach((val, index) => {
              if (latestVersions.hasOwnProperty(val.package)) {
                val.latest = latestVersions[val.package].latest_version;
                this.upgradeDisabled[val.package] = false
              } else {
                val.latest = this.TAG_DEFAULT_LATEST;
                this.upgradeDisabled[val.package] = true
              }
              // update package list
              Vue.set(this.packageList, index, val);
              this.$message({
                message: this.$t('manager.checkUpdateSuccess'),
                type: 'success'
              });
              this.hasCheckedUpgrade = true;
            })
          })
          .catch(error => {
            console.log(error);
            this.hasCheckedUpgrade = true;
            this.$message.error(this.$t('manager.checkUpdateFail'));
          });
      },
      // if pkg can be upgraded
      canUpgrade(pkg) {
        return !this.upgradeDisabled[pkg]
      },
      postUpgradeData(pkg) {
        if (pkg === '') {
          pkg = this.getPkgsFromSelection()
        }
        pkg = pkg.filter(this.canUpgrade);
        if (pkg.length === 0) {
          let message = this.$t('manager.noUpgradePackage');
          if (!this.hasCheckedUpgrade) {
            message = this.$t('manager.checkLatestFirst')
          }
          this.$message({
            message: message,
            type: 'warning'
          });
          return
        }
        this.packageList.forEach((val, index) => {
          if (pkg.indexOf(val.package) >= 0) {
            val.version = this.UPDATING;
            // update package list
            Vue.set(this.packageList, index, val);
          }
        });
        // console.log(pkg);
        let params = new URLSearchParams();
        params.append('list', JSON.stringify(pkg));
        params.append('upgrade', '1');
        this.$axios.post('/install', params)
          .then(response => {
            let upgradeDict = response.data;
            console.log(upgradeDict);
            this.packageList.forEach((val, index) => {
              if (upgradeDict.hasOwnProperty(val.package)) {
                let result = upgradeDict[val.package];
                if (result === 'success') {
                  if (val.latest === undefined || val.latest === this.TAG_DEFAULT_LATEST || val.latest === this.TAG_WAIT_LATEST) {
                    val.version = this.UPDATE_SUCCESS
                  } else {
                    val.version = this.UPDATE_SUCCESS + ' : ' + val.latest
                  }
                } else if (result === 'failed') {
                  val.version = this.UPDATE_FAILED
                }
                // update package list
                Vue.set(this.packageList, index, val);
              }
            })
          })
          .catch(error => {
            console.log(error);
            this.$message.error(this.$t('manager.upgradeErr'));
          });
      },
      postUninstallData(pkg) {
        if (pkg === '') {
          pkg = this.getPkgsFromSelection()
        }
        if (pkg.length === 0) {
          this.$message({
            message: this.$t('manager.noPackageSelected'),
            type: 'warning'
          });
          return
        }
        this.$confirm(this.$t('manager.uninstallPrompt'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.uninstallPackages(pkg)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.canceled')
          });
        });
      },
      uninstallPackages(pkg) {
        this.packageList.forEach((val, index) => {
          if (pkg.indexOf(val.package) >= 0) {
            val.version = this.UNINSTALLING;
            // update package list
            Vue.set(this.packageList, index, val);
          }
        });
        // console.log(pkg);
        let params = new URLSearchParams();
        params.append('list', JSON.stringify(pkg));
        this.$axios.post('/uninstall', params)
          .then(response => {
            let uninstallDict = response.data;
            console.log(uninstallDict);
            let uninstallList = [];
            this.packageList.forEach((val, index) => {
              if (uninstallDict.hasOwnProperty(val.package)) {
                let result = uninstallDict[val.package];
                if (result === 'success') {
                  uninstallList.push(index);
                } else if (result === 'failed') {
                  val.version = this.UNINSTALL_FAILED;
                  // update package list
                  Vue.set(this.packageList, index, val);
                }
              }
            });
            uninstallList.forEach((val, index) => {
              // remove this item
              console.log('Uninstall: ', this.packageList[val - index]);
              this.packageList.splice(val - index, 1)
            })
          })
          .catch(error => {
            console.log(error);
            this.$message.error(this.$t('manager.uninstallErr'));
          });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      tableRowClassName({row, rowIndex}) {
        let style = '';
        if (row.latest !== undefined && row.latest !== this.TAG_DEFAULT_LATEST && row.latest !== this.TAG_WAIT_LATEST) {
          style = 'warning-row';
        }
        if (row.version.indexOf(this.UPDATE_SUCCESS) === 0) {
          style = 'success-row';
        } else if (row.version.indexOf(this.UPDATE_FAILED) === 0 ||
          row.version.indexOf(this.UNINSTALL_FAILED) === 0) {
          style = 'failed-row';
        } else if (row.version.indexOf(this.UPDATING) === 0) {
          style = 'installing-row';
        }
        return style
      }
    },
    components: {
      SearchPackage,
      Settings
    }
  }
</script>

<style lang="scss">
  $main_color: #409EFF;

  #manager-container {
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
      align-items: center;
      > span {
        flex: 1;
        display: flex;
        #tips {
          flex: 1;
          padding: 1em;
          margin: 0 2em 0 0;
          background-color: #fffae5;
          #cl {
            color: $main_color;
          }
        }
      }
    }
    .interpreted-text {
      font-weight: bold;
      font-family: monospace, sans-serif;
      font-size: 1.2em;
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

    .el-table .installing-row {
      background: #e6e6e6;
    }

  }
</style>
