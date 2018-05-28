<template>
  <el-dialog
    title="Search Packages"
    width="80%"
    height="100%"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="handleClose">
    <el-container id="search-container">
      <el-header>
        <div style="margin-top: 14px;">
          <el-autocomplete placeholder="Please enter the package name" class="inline-input" v-model="searchPackage"
                           :fetch-suggestions="querySearch"
                           @keyup.native.enter="postSearchData">
            <template slot="prepend">Package Name:</template>
            <el-button slot="append" icon="el-icon-search" @click="postSearchData"></el-button>
          </el-autocomplete>
        </div>
      </el-header>
      <el-main>
        <el-table
          :data="tableData"
          v-loading="loading"
          border
          :row-class-name="tableRowClassName"
          max-height="540"
          style="width: 100%">
          <el-table-column
            fixed
            prop="package"
            label="Package"
            width="220">
          </el-table-column>
          <el-table-column
            prop="version"
            label="Version"
            width="120">
          </el-table-column>
          <el-table-column
            prop="installed"
            label="Installed?"
            width="200">
          </el-table-column>
          <el-table-column
            prop="summary"
            label="Summary">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="Operation"
            width="160">
            <template slot-scope="scope">
              <el-button @click="postInstallData(scope.row.package)" type="text" size="small"
                         :disabled="!operationBtnState[scope.row.package].canInstall">
                {{operationBtnState[scope.row.package].installText}}
              </el-button>
              <el-button @click="postUninstallData(scope.row.package)" type="text" size="small"
                         :disabled="!operationBtnState[scope.row.package].canUninstall">
                Uninstall
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <span slot="footer" class="dialog-footer">
  </span>
  </el-dialog>
</template>

<script>
  import Vue from 'vue'
  import {LOCAL_STORAGE_KEYWORDS} from "../constants";

  const SUCCESS = 'SUCCESS';
  const FAILED = 'FAILED';
  const UPDATING = 'Updating...';
  const INSTALLING = 'Installing...';
  const UNINSTALLING = 'Uninstalling...';
  const UNINSTALL_FAILED = 'FAILED';

  const OP_INSTALL = 'Install';
  const OP_UPGRADE = 'Upgrade';

  export default {
    name: 'SearchPackage',
    props: ['show'],
    data() {
      return {
        loading: false,
        savedKeywords: [],
        operationBtnState: {},
        searchPackage: '',
        /*
        {
          package: 'Django',
          version: '1.11.13',
          installed: 'INSTALLED: 0.0.1',
          summary: 'A high-level Python Web framework that encourages rapid development and clean, pragmatic design.',
        }
        */
        tableData: []
      };
    },
    computed: {
      dialogVisible() {
        return this.show;
      }
    },
    mounted() {
      this.savedKeywords = this.readSearchKeyword();
    },
    methods: {
      handleClose() {
        this.$emit('closeDialog');
      },
      querySearch(queryString, cb) {
        let savedKeywords = this.savedKeywords;
        let results = queryString ? savedKeywords.filter(this.createFilter(queryString)) : savedKeywords;
        // Call callback function to return the data for the suggestion list
        cb(results);
      },
      createFilter(queryString) {
        return (keyword) => {
          return (keyword.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
        };
      },
      // Save search keyword to localStorage
      saveSearchKeyword(keyword) {
        let str = localStorage.getItem(LOCAL_STORAGE_KEYWORDS);
        if (str == null) {
          str = '[]'
        }
        let keywords = JSON.parse(str);
        let hasContained = keywords.some((val, index) => (val.value === keyword));
        if (!hasContained) {
          keywords.push({value: keyword});
          localStorage.setItem(LOCAL_STORAGE_KEYWORDS, JSON.stringify(keywords));
          this.savedKeywords = keywords;
        }
      },
      // Read search keyword from localStorage
      readSearchKeyword() {
        let str = localStorage.getItem(LOCAL_STORAGE_KEYWORDS);
        if (str == null) {
          str = '[]'
        }
        return JSON.parse(str);
      },
      postSearchData() {
        let p = this.searchPackage.trim();
        if (p === '') {
          this.$message({
            message: 'Please enter the package name first.',
            type: 'warning'
          });
          return
        }
        // store search keyword to lcoal storage
        this.saveSearchKeyword(p);
        this.loading = true;
        let params = new URLSearchParams();
        params.append('p', p);
        this.$axios.post('/search', params)
          .then(response => {
            // console.log(response.data);
            this.tableData = response.data.map(val => {
              let thisItemState = {};
              if (val.is_installed) {
                val.installed = 'INSTALLED: ' + val.installed_version;
                if (val.installed_version === val.version) {
                  thisItemState.installText = OP_INSTALL;
                  thisItemState.canInstall = false;
                } else {
                  thisItemState.installText = OP_UPGRADE;
                  thisItemState.canInstall = true;
                }
                thisItemState.canUninstall = true;
              } else {
                val.installed = '';
                thisItemState.installText = OP_INSTALL;
                thisItemState.canInstall = true;
                thisItemState.canUninstall = false;
              }
              this.operationBtnState[val.package] = thisItemState;
              this.loading = false;
              return val
            })
          })
          .catch(error => {
            console.log(error.message);
            this.loading = false;
          })
      },
      postInstallData(pkg) {
        let text = this.operationBtnState[pkg].installText;
        let msg = '';
        if (text === OP_INSTALL) {
          // Install package
          msg = INSTALLING;
        } else if (text === OP_UPGRADE) {
          // Upgrade package
          msg = UPDATING
        }
        let length = this.tableData.length;
        for (let i = 0; i < length; i++) {
          let val = this.tableData[i];
          if (pkg === val.package) {
            val.installed = msg;
            // update package list
            Vue.set(this.tableData, i, val);
            break
          }
        }
        // console.log(pkg);
        pkg = [pkg];
        let params = new URLSearchParams();
        params.append('list', JSON.stringify(pkg));
        if (text === OP_UPGRADE) {
          params.append('upgrade', '1');
        }
        this.$axios.post('/install', params)
          .then(response => {
            let upgradeDict = response.data;
            // console.log(upgradeDict);
            for (let i = 0; i < length; i++) {
              let val = this.tableData[i];
              if (upgradeDict.hasOwnProperty(val.package)) {
                let result = upgradeDict[val.package];
                if (result === 'success') {
                  val.installed = SUCCESS;
                  this.operationBtnState[val.package].installText = OP_INSTALL;
                  this.operationBtnState[val.package].canInstall = false;
                  this.operationBtnState[val.package].canUninstall = true;
                } else if (result === 'failed') {
                  val.installed = FAILED
                }
                // update package list
                Vue.set(this.tableData, i, val);
                break
              }
            }
          })
          .catch(error => {
            console.log(error);
            this.$message.error('Upgrade Python package(s) error!');
          });
      },
      postUninstallData(pkg) {
        this.$confirm('This operation will uninstall this package, will it continue?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.uninstallPackage(pkg)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled.'
          });
        });
      },
      uninstallPackage(pkg) {
        let length = this.tableData.length;
        for (let i = 0; i < length; i++) {
          let val = this.tableData[i];
          if (pkg === val.package) {
            val.installed = UNINSTALLING;
            // update package list
            Vue.set(this.tableData, i, val);
            break
          }
        }
        // console.log(pkg);
        pkg = [pkg];
        let params = new URLSearchParams();
        params.append('list', JSON.stringify(pkg));
        this.$axios.post('/uninstall', params)
          .then(response => {
            let uninstallDict = response.data;
            console.log(uninstallDict);
            for (let i = 0; i < length; i++) {
              let val = this.tableData[i];
              if (uninstallDict.hasOwnProperty(val.package)) {
                let result = uninstallDict[val.package];
                if (result === 'success') {
                  val.installed = SUCCESS;
                  this.operationBtnState[val.package].installText = OP_INSTALL;
                  this.operationBtnState[val.package].canInstall = true;
                  this.operationBtnState[val.package].canUninstall = false;
                } else if (result === 'failed') {
                  val.installed = UNINSTALL_FAILED;
                }
                // update package list
                Vue.set(this.tableData, i, val);
                break
              }
            }
          })
          .catch(error => {
            console.log(error);
            this.$message.error('Uninstall Python package(s) error!');
          });
      },
      tableRowClassName({row, rowIndex}) {
        let style = '';
        if (row.installed !== undefined && row.installed !== '') {
          style = 'warning-row';
        }
        if (row.installed.indexOf(SUCCESS) === 0) {
          style = 'success-row';
        } else if (row.installed.indexOf(FAILED) === 0 ||
          row.installed.indexOf(UNINSTALL_FAILED) === 0) {
          style = 'failed-row';
        } else if (row.installed.indexOf(UPDATING) === 0 ||
          row.installed.indexOf(INSTALLING) === 0) {
          style = 'installing-row';
        }
        return style
      }
    }
  }
</script>

<style lang="scss">
  #search-container {
    .inline-input {
      width: 100%;
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
