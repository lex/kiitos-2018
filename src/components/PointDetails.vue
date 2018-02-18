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

    <div>
      <new-observation-form v-bind:form="form" v-bind:onSubmit="onSubmit" />
    </div>

    <div v-if="details !== null && details.observations.length !== 0">
      <h2>
        History
      </h2>
      <b-form-select v-model="temperatureFormat" :options="temperatureFormats" class="mb-3" />
      <temperature-chart v-bind:chartData="this.chartData" :options="{responsive: false, maintainAspectRatio: false}" :width="800" :height="400" v-bind:temperatureFormat="temperatureFormat" />
    </div>
  </div>
</template>

<script>
import { getDetails, addObservation } from '../services/observations';
import TemperatureChart from './TemperatureChart';
import NewObservationForm from './NewObservationForm';

import {
  kelvinToCelsius,
  kelvinToFahrenheit,
  celsiusToKelvin,
} from '../utils/temperature-converter';

export default {
  name: 'point-details',

  components: { TemperatureChart, NewObservationForm },

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
      form: {
        observation: '',
      },
    };
  },

  mounted() {
    getDetails(this.point.id).then(details => {
      this.details = {
        ...details,
        observations: details.observations.map(o => ({
          ...o,
          timestamp: new Date(o.timestamp),
        })),
      };
    });
  },

  methods: {
    onSubmit(e) {
      e.preventDefault();

      const temperature = celsiusToKelvin(parseFloat(this.form.observation));

      addObservation(this.point.id, temperature)
        .then(response => {
          this.details.observations.push({
            ...response,
            timestamp: new Date(response.timestamp),
          });

          this.form.observation = '';
        })
        .catch(exception => {
          console.log(exception);
        });
    },
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
        labels: this.details.observations.map(o => `${o.timestamp}`),
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