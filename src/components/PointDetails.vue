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

    <div v-if="details !== null && details.observations.length !== 0" style="max-width: 80%; display: inline-block">
      <b-form-select v-model="temperatureFormat" :options="temperatureFormats" class="mb-3" />
      <temperature-chart v-bind:chartData="this.chartData" v-bind:options="{responsive: true}" :width="800" v-bind:temperatureFormat="temperatureFormat" />
    </div>
  </div>
</template>

<script>
import { getDetails } from '../services/observations';
import TemperatureChart from './TemperatureChart';

import {
  kelvinToCelsius,
  kelvinToFahrenheit,
} from '../utils/temperature-converter';

export default {
  name: 'point-details',
  components: { TemperatureChart },
  props: {
    point: Object,
  },
  data() {
    return {
      details: null,
      temperatureFormat: 'celsius',
      temperatureFormats: [
        { value: 'celsius', text: 'Celsius' },
        { value: 'fahrenheit', text: 'Fahrenheit' },
        { value: 'kelvin', text: 'Kelvin' },
      ],
    };
  },
  mounted() {
    getDetails(this.point.id).then(details => {
      this.details = details;
    });
  },
  computed: {
    chartData() {
      if (this.details === null || this.details.observations === null) {
        return null;
      }

      let unit = 'K';
      let f = v => v;

      switch (this.temperatureFormat) {
        case 'celsius':
          f = kelvinToCelsius;
          unit = '°C';
          break;
        case 'fahrenheit':
          f = kelvinToFahrenheit;
          unit = '°F';
          break;
        default:
          break;
      }

      const chartData = {
        labels: this.details.observations.map(o => o.timestamp),
        datasets: [
          {
            label: `Temperature (${unit})`,
            backgroundColor: '#0080fa',
            data: this.details.observations.map(o =>
              f(parseFloat(o.temperature)).toFixed(2),
            ),
          },
        ],
      };

      return chartData;
    },
  },
};
</script>