<template>
  <div id="app">
    <navigation-bar v-bind:onClick="onUnitClick" v-bind:temperatureFormat="temperatureFormat" v-bind:temperatureFormats="temperatureFormats"></navigation-bar>
    <points v-bind:temperatureFormat="temperatureFormat"></points>
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
  created() {
    document.title = 'Kiitos-2018';
  },
  data() {
    return {
      temperatureFormat: 'celsius',
      temperatureFormats: [
        { value: 'celsius', text: 'Celsius' },
        { value: 'fahrenheit', text: 'Fahrenheit' },
        { value: 'kelvin', text: 'Kelvin' },
      ],
    };
  },
  methods: {
    onUnitClick(e) {
      const newFormat = e.target.id;
      this.temperatureFormat = newFormat;
    },
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
}
</style>
