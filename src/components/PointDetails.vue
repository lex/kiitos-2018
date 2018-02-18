<template>
  <div>
    <h2 id="point-name">
      {{ point.name }}
    </h2>

    <div v-if="latestObservation && highestObservation && lowestObservation">
      <b-container class="bv-example-row">
        <b-row>
          <b-col>
            <h4>
              Latest observation
            </h4>
            <p>
              {{ latestObservation.temperature }} K at {{ latestObservation.timestamp }}
            </p>
          </b-col>

          <b-col>
            <h4>
              Highest observation for the last 24 hours
            </h4>
            <p>
              {{ highestObservation.temperature }} K at {{ highestObservation.timestamp }}
            </p>
          </b-col>

          <b-col>
            <h4>
              Lowest observation for the last 24 hours
            </h4>
            <p>
              {{ lowestObservation.temperature }} K at {{ lowestObservation.timestamp }}
            </p>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <p v-else>
      No observations.
    </p>

    <div>
      <new-observation-form v-bind:form="form" v-bind:onSubmit="onSubmit" v-bind:error="error" />
    </div>

    <div v-if="details !== null && details.observations.length !== 0">
      <h2>
        History
      </h2>
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

  props: ['point', 'temperatureFormat'],

  data() {
    return {
      details: null,
      form: {
        observation: '',
      },
      error: null,
    };
  },

  mounted() {
    getDetails(this.point.id).then(details => {
      this.details = {
        ...details,
        observations: details.observations.map(o => ({
          temperature: parseFloat(o.temperature),
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
          this.error = null;
        })
        .catch(exception => {
          this.error = 'Please provide a valid temperature.';
          console.log(exception); // eslint-disable-line no-console
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
              f(o.temperature).toFixed(2),
            ),
          },
        ],
      };

      return chartData;
    },

    highestObservation() {
      if (this.details === null || this.details.observations === null) {
        return null;
      }

      return this.details.observations.reduce(
        (max, o) => (o.temperature > max.temperature ? o : max),
        this.details.observations[0],
      );
    },

    lowestObservation() {
      if (this.details === null || this.details.observations === null) {
        return null;
      }

      const g = this.details.observations.reduce(
        (min, o) => (o.temperature < min.temperature ? o : min),
        this.details.observations[0],
      );

      return g;
    },

    latestObservation() {
      if (this.details === null || this.details.observations === null) {
        return null;
      }

      return this.details.observations[this.details.observations.length - 1];
    },
  },
};
</script>

<style>
#point-name {
  margin-bottom: 40px;
}
</style>