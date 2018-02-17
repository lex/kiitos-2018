<template>
  <div class="points">
    <p v-if="loading">Loading...</p>

    <div v-if="points">
      <b-card no-body>
        <b-tabs pills card vertical nav-wrapper-class="w-20">
          <b-tab v-for="point of points" :key="point.id" v-bind:title="point.name" v-bind:point="point">
            <point-details v-bind:point="point" />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import PointDetails from './PointDetails';

export default {
  name: 'points',
  components: { PointDetails },
  data() {
    return { points: [], loading: true };
  },
  mounted() {
    axios.get('http://127.0.0.1:5000/observation-points/').then((response) => {
      this.points = response.data;
      this.loading = false;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
