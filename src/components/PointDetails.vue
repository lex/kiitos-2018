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

    <ul>
      <li v-for="(observation, i) of details.observations" :key="i">
        <p>
          {{ observation.timestamp }} {{ observation.temperature }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { getDetails } from '../services/observations';

export default {
  name: 'point-details',
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