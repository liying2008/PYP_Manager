<template>
  <el-dialog
    title="Search Packages"
    :visible.sync="dialogVisible"
    width="60%"
    :before-close="handleClose">
    <span>This is a message</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose(false)">Cancel</el-button>
    <el-button type="primary" @click="handleClose(false)">Confirm</el-button>
  </span>
  </el-dialog>
</template>

<script>
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
      handleClose(needConfirm) {
        if (needConfirm) {
          this.$confirm('Are you sure to close this dialog?', 'Prompt', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          })
            .then(_ => {
              this.$emit('closeDialog');
            })
            .catch(_ => {
            });
        } else {
          this.$emit('closeDialog');
        }
      }
    }
  }
</script>

<style scoped>

</style>
