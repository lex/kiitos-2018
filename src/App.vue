<template>
  <div id="app">
    <navigation-bar></navigation-bar>
    <points></points>
  </div>
</template>

<script>
import Points from './components/Points';
import NavigationBar from './components/NavigationBar';

export default {
  name: 'app',
  components: {
    Points,
    NavigationBar,
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
