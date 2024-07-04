<template>
  <div id="app">
    <AppHeader />
    
    <div class="container mt-4">
      <router-view />
    </div>
      
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/Header.vue';
import AppFooter from './components/Footer.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style>
/* Optional: add global styles for the entire application */

</style>
