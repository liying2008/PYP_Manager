<template>
  <el-dialog
    id="settings-container"
    width="60%"
    :title="$t('settings.title')"
    :visible.sync="dialogVisible"
    :before-close="handleClose">
    <el-row>
      <el-col :span="24">
        <el-button class="long-btn"
                   @click="clearSearchRecords">{{$t('settings.clearSearchRecords')}}
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <p>{{$t('settings.languageSettings')}}
          <el-radio v-model="lang" label="en">English</el-radio>
          <el-radio v-model="lang" label="zh">中文</el-radio>
        </p>

      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
  </span>
  </el-dialog>
</template>

<script>
  import {LOCAL_STORAGE_KEYWORDS, LOCAL_STORAGE_LANG} from '../constants';

  export default {
    name: 'Settings',
    props: ['show'],
    data() {
      return {
        lang: 'en'
      };
    },
    mounted() {
      this.lang = this.$i18n.locale;
    },
    computed: {
      dialogVisible() {
        return this.show;
      }
    },
    watch: {
      lang: function (newLang, oldLang) {
        // update language settings
        this.$i18n.locale = newLang;
        // save lang to local storage
        localStorage.setItem(LOCAL_STORAGE_LANG, newLang);
      }
    },
    methods: {
      handleClose() {
        this.$emit('closeDialog');
      },
      clearSearchRecords() {
        this.$confirm(this.$t('settings.deleteSearchRecordsPrompt'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          localStorage.removeItem(LOCAL_STORAGE_KEYWORDS)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('common.canceled')
          });
        });
      }
    }
  }
</script>

<style lang="scss">
  #settings-container {
    .long-btn {
      width: 100%;
    }
    .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      border-radius: 4px;
    }
  }
</style>
