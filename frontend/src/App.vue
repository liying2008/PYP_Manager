<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {LOCAL_STORAGE_LANG} from './components/constants';

  export default {
    name: 'App',
    created() {
      let lang = localStorage.getItem(LOCAL_STORAGE_LANG);
      if (lang != null) {
        this.$i18n.locale = lang;
      }
    }
  }
</script>

<style>
  body {
    width: 90%;
    display: block;
    margin: 0 auto;
  }
</style>
