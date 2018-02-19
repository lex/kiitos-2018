<template>
  <div class="points">
    <div>
      <loading-screen id="loading-screen" v-if="loading" />

      <div id="content" v-if="!loading">
        <b-card no-body>
          <b-tabs id="point-tabs" pills card vertical nav-wrapper-class="w-20">
            <b-tab v-for="point of points" :key="point.id" :id="point.name" v-bind:title="point.name" v-bind:point="point">
              <point-details v-bind:point="point" v-bind:temperatureFormat="temperatureFormat" />
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import baseUrl from '../utils/api';
import PointDetails from './PointDetails';
import LoadingScreen from './LoadingScreen';

export default {
  name: 'points',
  props: ['temperatureFormat'],
  components: { PointDetails, LoadingScreen },
  data() {
    return { points: [], loading: true };
  },
  mounted() {
    axios
      .get(`${baseUrl}observation-points/`)
      .then(response => response.data)
      .then(points => {
        this.points = points;
        this.loading = false;
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
