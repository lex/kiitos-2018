<template>
  <div>
    <h2>
      {{ point.name }}
    </h2>

    <p v-if="point.latest_observation !== null">
      Latest observation: {{ point.latest_observation.temperature }} K at {{ point.latest_observation.timestamp }}
    </p>
    <p v-else>
      No observations.
    </p>

    <div style="max-width: 80%; display: inline-block">
      <temperature-chart v-if="details !== null && details.observations.length !== 0" v-bind:observations="details.observations" v-bind:options="{responsive: true}" :width="800" />
    </div>
  </div>
</template>

<script>
import { getDetails } from '../services/observations';
import TemperatureChart from './TemperatureChart';

export default {
  name: 'point-details',
  components: { TemperatureChart },
  props: {
    point: Object,
  },
  data() {
    return {
      details: null,
    };
  },
  mounted() {
    getDetails(this.point.id).then(details => {
      this.details = details;
    });
  },
};
</script>