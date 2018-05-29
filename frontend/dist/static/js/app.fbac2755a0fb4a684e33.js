webpackJsonp([1],{"/uab":function(t,e){t.exports={common:{prompt:"Prompt",confirm:"Confirm",cancel:"Cancel",canceled:"Canceled.",upgrade:"Upgrade",install:"Install",uninstall:"Uninstall",package:"Package",version:"Version",summary:"Summary",operation:"Operation",updateSuccess:"SUCCESS",updateFailed:"FAILED",updating:"Updating...",uninstalling:"Uninstalling...",uninstallFailed:"FAILED"},manager:{interpreter:"Python Interpreter: ",interpreterPlaceholder:"Detecting the Python interpreter path",noInterpreter:"No Python Interpreter Was Detected.",checkLatestTip:'Click the <span id="cl">Check Latest</span> button to Check for updates.',checkLatest:"Check Latest",latest:"Latest",tagDefaultLatest:"---",tagWaitLatest:"Checking the update...",searchSummaryTip:"Searching for summary...",noSummary:"(No Summary)",getSummaryErr:"Get Python package summary error!",packageListErr:"Get Python package list error!",checkUpdateSuccess:"Check update successful.",checkUpdateFail:"Check update failed.",noUpgradePackage:"There is no upgrade package.",checkLatestFirst:'Please click the "Check Latest" button first.',upgradeErr:"Upgrade Python package(s) error!",noPackageSelected:"No packages were selected.",uninstallPrompt:"This operation will uninstall the selected package, will it continue?",uninstallErr:"Uninstall Python package(s) error!"},search:{title:"Search Packages",inputPlaceholder:"Please enter the package name",inputPrepend:"Package Name:",isInstalled:"Installed?",success:"SUCCESS",failed:"FAILED",updating:"Updating...",installing:"Installing...",uninstalling:"Uninstalling...",uninstallFailed:"FAILED",opInstall:"Install",opUpgrade:"Upgrade",needInput:"Please enter the package name first.",installed:"INSTALLED: ",upgradeErr:"Upgrade Python package(s) error!",uninstallPrompt:"This operation will uninstall the selected package, will it continue?",uninstallErr:"Uninstall Python package(s) error!"},settings:{title:"Settings",clearSearchRecords:"Clear Search Records",deleteSearchRecordsPrompt:"Are you sure you want to delete records of search packages?",languageSettings:"Language Settings: "}}},IjJi:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("woOf"),s=a.n(n),i=(a("uMhA"),a("7+uW")),l=a("TXmL"),r={name:"App",created:function(){var t=localStorage.getItem("lang");null!=t&&(this.$i18n.locale=t)}},o={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var c=a("VU/8")(r,o,!1,function(t){a("kt2N")},null,null).exports,p=a("/ocq"),u=a("mvHQ"),d=a.n(u),g={name:"SearchPackage",props:["show"],data:function(){return{loading:!1,savedKeywords:[],operationBtnState:{},searchPackage:"",tableData:[],SUCCESS:this.$t("search.success"),FAILED:this.$t("search.failed"),UPDATING:this.$t("search.updating"),INSTALLING:this.$t("search.installing"),UNINSTALLING:this.$t("search.uninstalling"),UNINSTALL_FAILED:this.$t("search.uninstallFailed")}},computed:{dialogVisible:function(){return this.show}},mounted:function(){this.savedKeywords=this.readSearchKeyword()},methods:{handleClose:function(){this.$emit("closeDialog")},querySearch:function(t,e){var a=this.savedKeywords;e(t?a.filter(this.createFilter(t)):a)},createFilter:function(t){return function(e){return-1!==e.value.toLowerCase().indexOf(t.toLowerCase())}},saveSearchKeyword:function(t){var e=localStorage.getItem("keywords");null==e&&(e="[]");var a=JSON.parse(e);a.some(function(e,a){return e.value===t})||(a.push({value:t}),localStorage.setItem("keywords",d()(a)),this.savedKeywords=a)},readSearchKeyword:function(){var t=localStorage.getItem("keywords");return null==t&&(t="[]"),JSON.parse(t)},postSearchData:function(){var t=this,e=this.searchPackage.trim();if(""!==e){this.saveSearchKeyword(e),this.loading=!0;var a=new URLSearchParams;a.append("p",e),this.$axios.post("/search",a).then(function(e){t.tableData=e.data.map(function(e){var a={};return e.is_installed?(e.installed=t.$t("search.installed")+e.installed_version,e.installed_version===e.version?(a.installText="install",a.canInstall=!1):(a.installText="upgrade",a.canInstall=!0),a.canUninstall=!0):(e.installed="",a.installText="install",a.canInstall=!0,a.canUninstall=!1),t.operationBtnState[e.package]=a,t.loading=!1,e})}).catch(function(e){console.log(e.message),t.loading=!1})}else this.$message({message:this.$t("search.needInput"),type:"warning"})},postInstallData:function(t){var e=this,a=this.operationBtnState[t].installText,n="";"install"===a?n=this.INSTALLING:"upgrade"===a&&(n=this.UPDATING);for(var s=this.tableData.length,l=0;l<s;l++){var r=this.tableData[l];if(t===r.package){r.installed=n,i.default.set(this.tableData,l,r);break}}t=[t];var o=new URLSearchParams;o.append("list",d()(t)),"upgrade"===a&&o.append("upgrade","1"),this.$axios.post("/install",o).then(function(t){for(var a=t.data,n=0;n<s;n++){var l=e.tableData[n];if(a.hasOwnProperty(l.package)){var r=a[l.package];"success"===r?(l.installed=e.SUCCESS,e.operationBtnState[l.package].installText="install",e.operationBtnState[l.package].canInstall=!1,e.operationBtnState[l.package].canUninstall=!0):"failed"===r&&(l.installed=e.FAILED),i.default.set(e.tableData,n,l);break}}}).catch(function(t){console.log(t),e.$message.error(e.$t("search.upgradeErr"))})},postUninstallData:function(t){var e=this;this.$confirm(this.$t("search.uninstallPrompt"),this.$t("common.prompt"),{confirmButtonText:this.$t("common.confirm"),cancelButtonText:this.$t("common.cancel"),type:"warning"}).then(function(){e.uninstallPackage(t)}).catch(function(){e.$message({type:"info",message:e.$t("common.canceled")})})},uninstallPackage:function(t){for(var e=this,a=this.tableData.length,n=0;n<a;n++){var s=this.tableData[n];if(t===s.package){s.installed=this.UNINSTALLING,i.default.set(this.tableData,n,s);break}}t=[t];var l=new URLSearchParams;l.append("list",d()(t)),this.$axios.post("/uninstall",l).then(function(t){var n=t.data;console.log(n);for(var s=0;s<a;s++){var l=e.tableData[s];if(n.hasOwnProperty(l.package)){var r=n[l.package];"success"===r?(l.installed=e.SUCCESS,e.operationBtnState[l.package].installText="install",e.operationBtnState[l.package].canInstall=!0,e.operationBtnState[l.package].canUninstall=!1):"failed"===r&&(l.installed=e.UNINSTALL_FAILED),i.default.set(e.tableData,s,l);break}}}).catch(function(t){console.log(t),e.$message.error(e.$t("search.uninstallErr"))})},tableRowClassName:function(t){var e=t.row,a=(t.rowIndex,"");return void 0!==e.installed&&""!==e.installed&&(a="warning-row"),0===e.installed.indexOf(this.SUCCESS)?a="success-row":0===e.installed.indexOf(this.FAILED)||0===e.installed.indexOf(this.UNINSTALL_FAILED)?a="failed-row":0!==e.installed.indexOf(this.UPDATING)&&0!==e.installed.indexOf(this.INSTALLING)||(a="installing-row"),a}}},h={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{width:"80%",height:"100%",title:t.$t("search.title"),visible:t.dialogVisible,"close-on-click-modal":!1,"before-close":t.handleClose},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("el-container",{attrs:{id:"search-container"}},[a("el-header",[a("div",{staticStyle:{"margin-top":"14px"}},[a("el-autocomplete",{staticClass:"inline-input",attrs:{"fetch-suggestions":t.querySearch,placeholder:t.$t("search.inputPlaceholder")},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.postSearchData(e):null}},model:{value:t.searchPackage,callback:function(e){t.searchPackage=e},expression:"searchPackage"}},[a("template",{slot:"prepend"},[t._v(t._s(t.$t("search.inputPrepend")))]),t._v(" "),a("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:t.postSearchData},slot:"append"})],2)],1)]),t._v(" "),a("el-main",[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{border:"","max-height":"540",data:t.tableData,"row-class-name":t.tableRowClassName}},[a("el-table-column",{attrs:{fixed:"",prop:"package",width:"220",label:t.$t("common.package")}}),t._v(" "),a("el-table-column",{attrs:{prop:"version",width:"120",label:t.$t("common.version")}}),t._v(" "),a("el-table-column",{attrs:{prop:"installed",width:"200",label:t.$t("search.isInstalled")}}),t._v(" "),a("el-table-column",{attrs:{prop:"summary",label:t.$t("common.summary")}}),t._v(" "),a("el-table-column",{attrs:{fixed:"right",width:"160",label:t.$t("common.operation")},scopedSlots:t._u([{key:"default",fn:function(e){return["install"===t.operationBtnState[e.row.package].installText?a("el-button",{attrs:{type:"text",size:"small",disabled:!t.operationBtnState[e.row.package].canInstall},on:{click:function(a){t.postInstallData(e.row.package)}}},[t._v("\n              "+t._s(t.$t("search.opInstall"))+"\n            ")]):a("el-button",{attrs:{type:"text",size:"small",disabled:!t.operationBtnState[e.row.package].canInstall},on:{click:function(a){t.postInstallData(e.row.package)}}},[t._v("\n              "+t._s(t.$t("search.opUpgrade"))+"\n            ")]),t._v(" "),a("el-button",{attrs:{type:"text",size:"small",disabled:!t.operationBtnState[e.row.package].canUninstall},on:{click:function(a){t.postUninstallData(e.row.package)}}},[t._v("\n              "+t._s(t.$t("common.uninstall"))+"\n            ")])]}}])})],1)],1)],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"})],1)},staticRenderFns:[]};var m={name:"Settings",props:["show"],data:function(){return{lang:"en"}},mounted:function(){this.lang=this.$i18n.locale},computed:{dialogVisible:function(){return this.show}},watch:{lang:function(t,e){this.$i18n.locale=t,localStorage.setItem("lang",t)}},methods:{handleClose:function(){this.$emit("closeDialog")},clearSearchRecords:function(){var t=this;this.$confirm(this.$t("settings.deleteSearchRecordsPrompt"),this.$t("common.prompt"),{confirmButtonText:this.$t("common.confirm"),cancelButtonText:this.$t("common.cancel"),type:"warning"}).then(function(){localStorage.removeItem("keywords")}).catch(function(){t.$message({type:"info",message:t.$t("common.canceled")})})}}},f={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-dialog",{attrs:{id:"settings-container",width:"60%",title:t.$t("settings.title"),visible:t.dialogVisible,"before-close":t.handleClose},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("el-row",[a("el-col",{attrs:{span:24}},[a("el-button",{staticClass:"long-btn",on:{click:t.clearSearchRecords}},[t._v(t._s(t.$t("settings.clearSearchRecords"))+"\n      ")])],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{span:24}},[a("p",[t._v(t._s(t.$t("settings.languageSettings"))+"\n        "),a("el-radio",{attrs:{label:"en"},model:{value:t.lang,callback:function(e){t.lang=e},expression:"lang"}},[t._v("English")]),t._v(" "),a("el-radio",{attrs:{label:"zh"},model:{value:t.lang,callback:function(e){t.lang=e},expression:"lang"}},[t._v("中文")])],1)])],1),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"})],1)},staticRenderFns:[]};var k={name:"Manager",data:function(){return{hasCheckedUpgrade:!1,loading:!0,options:[],defaultInterpreter:"",packageList:[],multipleSelection:[],searchDialogVisible:!1,settingsDialogVisible:!1,upgradeDisabled:{},TAG_DEFAULT_LATEST:this.$t("manager.tagDefaultLatest"),TAG_WAIT_LATEST:this.$t("manager.tagWaitLatest"),UPDATE_SUCCESS:this.$t("common.updateSuccess"),UPDATE_FAILED:this.$t("common.updateFailed"),UPDATING:this.$t("common.updating"),UNINSTALLING:this.$t("common.uninstalling"),UNINSTALL_FAILED:this.$t("common.uninstallFailed")}},created:function(){var t=this;this.$axios.get("/interpreters").then(function(e){var a=e.data;t.options=a.map(function(t){return t.value="Python "+t.version+" ("+t.path+")",t}),0===t.options.length?t.defaultInterpreter=t.$t("manager.noInterpreter"):(t.defaultInterpreter=t.options[0].value,t.getSimpleListData())}).catch(function(t){console.log(t)})},methods:{getSimpleListData:function(){var t=this;this.$axios.get("/simple_list").then(function(e){t.packageList=e.data.map(function(e){return e.summary=t.$t("manager.searchSummaryTip"),t.upgradeDisabled[e.package]=!0,e}),t.loading=!1,t.postSummaryData()}).catch(function(e){console.log(e),t.loading=!1,t.$message.error(t.$t("manager.packageListErr"))})},postSummaryData:function(){var t=this,e=this.packageList.map(function(t){return t.package}),a=new URLSearchParams;a.append("list",d()(e)),this.$axios.post("/summary",a).then(function(e){var a=e.data;t.packageList.forEach(function(e,n){e.summary=a[e.package].summary,""===e.summary&&(e.summary=t.$t("manager.noSummary")),i.default.set(t.packageList,n,e)})}).catch(function(e){console.log(e),t.$message.error(t.$t("manager.getSummaryErr"))})},getPkgsFromSelection:function(){return this.multipleSelection.map(function(t){return t.package})},getCheckLatestData:function(){var t=this;this.packageList.forEach(function(e,a){e.latest=t.TAG_WAIT_LATEST,i.default.set(t.packageList,a,e)}),this.$axios.get("/check_latest").then(function(e){var a=e.data;t.packageList.forEach(function(e,n){a.hasOwnProperty(e.package)?(e.latest=a[e.package].latest_version,t.upgradeDisabled[e.package]=!1):(e.latest=t.TAG_DEFAULT_LATEST,t.upgradeDisabled[e.package]=!0),i.default.set(t.packageList,n,e),t.$message({message:t.$t("manager.checkUpdateSuccess"),type:"success"}),t.hasCheckedUpgrade=!0})}).catch(function(e){console.log(e),t.hasCheckedUpgrade=!0,t.$message.error(t.$t("manager.checkUpdateFail"))})},canUpgrade:function(t){return!this.upgradeDisabled[t]},postUpgradeData:function(t){var e=this;if(""===t&&(t=this.getPkgsFromSelection()),0===(t=t.filter(this.canUpgrade)).length){var a=this.$t("manager.noUpgradePackage");return this.hasCheckedUpgrade||(a=this.$t("manager.checkLatestFirst")),void this.$message({message:a,type:"warning"})}this.packageList.forEach(function(a,n){t.indexOf(a.package)>=0&&(a.version=e.UPDATING,i.default.set(e.packageList,n,a))});var n=new URLSearchParams;n.append("list",d()(t)),n.append("upgrade","1"),this.$axios.post("/install",n).then(function(t){var a=t.data;console.log(a),e.packageList.forEach(function(t,n){if(a.hasOwnProperty(t.package)){var s=a[t.package];"success"===s?void 0===t.latest||t.latest===e.TAG_DEFAULT_LATEST||t.latest===e.TAG_WAIT_LATEST?t.version=e.UPDATE_SUCCESS:t.version=e.UPDATE_SUCCESS+" : "+t.latest:"failed"===s&&(t.version=e.UPDATE_FAILED),i.default.set(e.packageList,n,t)}})}).catch(function(t){console.log(t),e.$message.error(e.$t("manager.upgradeErr"))})},postUninstallData:function(t){var e=this;""===t&&(t=this.getPkgsFromSelection()),0!==t.length?this.$confirm(this.$t("manager.uninstallPrompt"),this.$t("common.prompt"),{confirmButtonText:this.$t("common.confirm"),cancelButtonText:this.$t("common.cancel"),type:"warning"}).then(function(){e.uninstallPackages(t)}).catch(function(){e.$message({type:"info",message:e.$t("common.canceled")})}):this.$message({message:this.$t("manager.noPackageSelected"),type:"warning"})},uninstallPackages:function(t){var e=this;this.packageList.forEach(function(a,n){t.indexOf(a.package)>=0&&(a.version=e.UNINSTALLING,i.default.set(e.packageList,n,a))});var a=new URLSearchParams;a.append("list",d()(t)),this.$axios.post("/uninstall",a).then(function(t){var a=t.data;console.log(a);var n=[];e.packageList.forEach(function(t,s){if(a.hasOwnProperty(t.package)){var l=a[t.package];"success"===l?n.push(s):"failed"===l&&(t.version=e.UNINSTALL_FAILED,i.default.set(e.packageList,s,t))}}),n.forEach(function(t,a){console.log("Uninstall: ",e.packageList[t-a]),e.packageList.splice(t-a,1)})}).catch(function(t){console.log(t),e.$message.error(e.$t("manager.uninstallErr"))})},handleSelectionChange:function(t){this.multipleSelection=t},tableRowClassName:function(t){var e=t.row,a=(t.rowIndex,"");return void 0!==e.latest&&e.latest!==this.TAG_DEFAULT_LATEST&&e.latest!==this.TAG_WAIT_LATEST&&(a="warning-row"),0===e.version.indexOf(this.UPDATE_SUCCESS)?a="success-row":0===e.version.indexOf(this.UPDATE_FAILED)||0===e.version.indexOf(this.UNINSTALL_FAILED)?a="failed-row":0===e.version.indexOf(this.UPDATING)&&(a="installing-row"),a}},components:{SearchPackage:a("VU/8")(g,h,!1,function(t){a("q0QW")},null,null).exports,Settings:a("VU/8")(m,f,!1,function(t){a("VrMh")},null,null).exports}},v={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"manager-container"}},[a("p",{attrs:{id:"p_interpreter"}},[a("span",{staticClass:"interpreted-text"},[t._v(t._s(t.$t("manager.interpreter")))]),t._v(" "),a("el-select",{attrs:{id:"selector",placeholder:t.$t("manager.interpreterPlaceholder")},model:{value:t.defaultInterpreter,callback:function(e){t.defaultInterpreter=e},expression:"defaultInterpreter"}},t._l(t.options,function(t){return a("el-option",{key:t.path,attrs:{label:t.value,value:t.path}})}))],1),t._v(" "),a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}]},[a("p",{attrs:{id:"p_buttons"}},[a("span",[a("span",{directives:[{name:"show",rawName:"v-show",value:!t.hasCheckedUpgrade,expression:"!hasCheckedUpgrade"}],attrs:{id:"tips"},domProps:{innerHTML:t._s(t.$t("manager.checkLatestTip"))}})]),t._v(" "),a("el-button",{attrs:{type:"primary",plain:""},on:{click:t.getCheckLatestData}},[t._v(t._s(t.$t("manager.checkLatest")))]),t._v(" "),a("el-button",{attrs:{type:"success",plain:""},on:{click:function(e){t.postUpgradeData("")}}},[t._v(t._s(t.$t("common.upgrade")))]),t._v(" "),a("el-button",{attrs:{type:"danger",plain:""},on:{click:function(e){t.postUninstallData("")}}},[t._v(t._s(t.$t("common.uninstall")))]),t._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-plus",circle:""},on:{click:function(e){t.searchDialogVisible=!0}}}),t._v(" "),a("el-button",{attrs:{type:"info",icon:"el-icon-setting",circle:""},on:{click:function(e){t.settingsDialogVisible=!0}}})],1),t._v(" "),a("div",{staticClass:"manager-container-table"},[a("el-table",{staticStyle:{width:"100%"},attrs:{border:"","tooltip-effect":"dark","show-overflow-tooltip":"",data:t.packageList,"row-class-name":t.tableRowClassName},on:{"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),t._v(" "),a("el-table-column",{attrs:{fixed:"",sortable:"",prop:"package",width:"420",label:t.$t("common.package")}}),t._v(" "),a("el-table-column",{attrs:{prop:"version",label:t.$t("common.version"),width:"120"}}),t._v(" "),a("el-table-column",{attrs:{prop:"latest",width:"120",label:t.$t("manager.latest")}}),t._v(" "),a("el-table-column",{attrs:{prop:"summary",label:t.$t("common.summary")}}),t._v(" "),a("el-table-column",{attrs:{fixed:"right",width:"200",label:t.$t("common.operation")},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"success",size:"small",disabled:t.upgradeDisabled[e.row.package]},on:{click:function(a){t.postUpgradeData([e.row.package])}}},[t._v(t._s(t.$t("common.upgrade"))+"\n            ")]),t._v(" "),a("el-button",{attrs:{type:"danger",size:"small"},on:{click:function(a){t.postUninstallData([e.row.package])}}},[t._v("\n              "+t._s(t.$t("common.uninstall"))+"\n            ")])]}}])})],1)],1),t._v(" "),a("search-package",{attrs:{show:t.searchDialogVisible},on:{closeDialog:function(e){t.searchDialogVisible=!1}}}),t._v(" "),a("settings",{attrs:{show:t.settingsDialogVisible},on:{closeDialog:function(e){t.settingsDialogVisible=!1}}})],1)])},staticRenderFns:[]};var S=a("VU/8")(k,v,!1,function(t){a("IjJi")},null,null).exports;i.default.use(p.a);var L=new p.a({routes:[{path:"/",name:"Manager",component:S}]}),b=a("mtWM"),$=a.n(b),_=(a("tvR6"),a("zL8q")),w=a.n(_),y=a("wUZ8"),U=a.n(y),I=a("Vi3T"),D=a.n(I);i.default.prototype.$axios=$.a,$.a.defaults.baseURL="http://127.0.0.1:8000/pyp/",$.a.defaults.withCredentials=!0,i.default.use(l.a),i.default.config.productionTip=!1;var T=new l.a({locale:"en",messages:{zh:s()(a("xZXS"),D.a),en:s()(a("/uab"),U.a)}});i.default.use(w.a,{i18n:function(t,e){return T.t(t,e)}}),new i.default({el:"#app",router:L,i18n:T,render:function(t){return t(c)}})},VrMh:function(t,e){},kt2N:function(t,e){},q0QW:function(t,e){},tvR6:function(t,e){},uMhA:function(t,e){},xZXS:function(t,e){t.exports={common:{prompt:"提示",confirm:"确定",cancel:"取消",canceled:"已取消。",upgrade:"更新",install:"安装",uninstall:"卸载",package:"名称",version:"版本",summary:"摘要",operation:"操作",updateSuccess:"成功",updateFailed:"失败",updating:"正在更新...",uninstalling:"正在卸载...",uninstallFailed:"卸载失败"},manager:{interpreter:"Python 解释器：",interpreterPlaceholder:"正在检测 Python 解释器路径",noInterpreter:"未检测到安装的 Python 解释器。",checkLatestTip:'点击 <span id="cl">检查更新</span> 按钮获取最新版本号。',checkLatest:"检查更新",latest:"最新版本",tagDefaultLatest:"---",tagWaitLatest:"正在检查更新...",searchSummaryTip:"正在获取摘要信息...",noSummary:"(无摘要)",getSummaryErr:"获取摘要信息失败！",packageListErr:"获取已安装的包列表失败！",checkUpdateSuccess:"检查更新成功。",checkUpdateFail:"检查更新失败！",noUpgradePackage:"没有可升级的包。",checkLatestFirst:"请先点击“检查更新”按钮",upgradeErr:"更新失败！",noPackageSelected:"未选择任何包。",uninstallPrompt:"此操作将会删除所选包，是否继续？",uninstallErr:"卸载失败！"},search:{title:"搜索包",inputPlaceholder:"请输入包的名称",inputPrepend:"包名称：",isInstalled:"已安装？",success:"成功",failed:"失败",updating:"正在更新...",installing:"正在安装...",uninstalling:"正在卸载...",uninstallFailed:"卸载失败",opInstall:"安装",opUpgrade:"更新",needInput:"请先输入要搜索的包的名称",installed:"已安装：",upgradeErr:"更新失败！",uninstallPrompt:"此操作将会删除所选包，是否继续？",uninstallErr:"卸载失败！"},settings:{title:"设置",clearSearchRecords:"清空搜索记录",deleteSearchRecordsPrompt:"确定要删除所有的搜索记录吗？",languageSettings:"语言设置："}}}},["NHnr"]);
//# sourceMappingURL=app.fbac2755a0fb4a684e33.js.map