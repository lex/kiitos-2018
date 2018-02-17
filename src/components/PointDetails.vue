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
  </div>
</template>

<script>
export default {
  name: 'point-details',
  props: {
    point: Object,
  },
  data() {
    return {
      observations: [],
    };
  },
};
</script>