<template>
  <el-dialog
    id="settings-container"
    title="Settings"
    width="60%"
    :visible.sync="dialogVisible"
    :before-close="handleClose">
    <el-row>
      <el-col :span="24">
        <el-button class="long-btn"
                   @click="clearSearchRecords">Clear Search Records
        </el-button>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
  </span>
  </el-dialog>
</template>

<script>
  import {LOCAL_STORAGE_KEYWORDS} from "../constants";

  export default {
    name: 'Settings',
    props: ['show'],
    data() {
      return {};
    },
    computed: {
      dialogVisible() {
        return this.show;
      }
    },
    methods: {
      handleClose() {
        this.$emit('closeDialog');
      },
      clearSearchRecords() {
        this.$confirm('Are you sure you want to delete records of search packages?', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem(LOCAL_STORAGE_KEYWORDS)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled.'
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
  }
</style>
