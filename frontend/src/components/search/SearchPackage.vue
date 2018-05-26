<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose(false)">取 消</el-button>
    <el-button type="primary" @click="handleClose(false)">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'SearchPackage',
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
          this.$confirm('确认关闭？')
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
