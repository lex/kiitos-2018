<template>
  <div>
    <h2 id="point-name">
      {{ point.name }}
    </h2>

    <div v-if="latestObservation && highestObservation && lowestObservation">
      <b-container>
        <b-row>
          <b-col>
            <h4 class="observation-quick">
              Latest observation
            </h4>
            <p id="observation-latest">
              {{ formatTemperature(latestObservation.temperature) }} {{ temperatureUnit }} at {{ latestObservation.timestamp }}
            </p>
          </b-col>

          <b-col>
            <h4 class="observation-quick">
              Highest observation for the last 24 hours
            </h4>
            <p id="observation-highest">
              {{ formatTemperature(highestObservation.temperature) }} {{ temperatureUnit }} at {{ highestObservation.timestamp }}
            </p>
          </b-col>

          <b-col>
            <h4 class="observation-quick">
              Lowest observation for the last 24 hours
            </h4>
            <p id="observation-lowest">
              {{ formatTemperature(lowestObservation.temperature) }} {{ temperatureUnit }} at {{ lowestObservation.timestamp }}
            </p>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <p id="no-observations" v-else>
      No observations.
    </p>

    <div id="form">
      <new-observation-form v-bind:form="form" v-bind:temperatureFormat="temperatureFormat" v-bind:onSubmit="onSubmit" v-bind:error="error" />
    </div>

    <div id="history" v-if="details !== null && details.observations.length !== 0">
      <h2>
        History
      </h2>
      <div id="chart-div">
        <temperature-chart id="temperature-chart" v-bind:chartData="this.chartData" :options="{responsive: false, maintainAspectRatio: false}" :width="800" :height="400" v-bind:temperatureFormat="temperatureFormat" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import baseUrl from '../utils/api';
import TemperatureChart from './TemperatureChart';
import NewObservationForm from './NewObservationForm';

import {
  kelvinToCelsius,
  kelvinToFahrenheit,
  celsiusToKelvin,
  fahrenheitToKelvin,
  unitForFormat,
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
    axios
      .get(`${baseUrl}observation-points/${this.point.id}/`)
      .then(response => response.data)
      .then(details => {
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

      let f = v => v;

      switch (this.temperatureFormat) {
        case 'celsius':
          f = celsiusToKelvin;
          break;
        case 'fahrenheit':
          f = fahrenheitToKelvin;
          break;
        default:
          break;
      }

      const temperature = f(parseFloat(this.form.observation)).toFixed(10);
      const observation = { point_id: this.point.id, temperature };

      axios
        .post(`${baseUrl}observations/`, observation)
        .then(response => response.data)
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

    formatTemperature(temperature) {
      let f = v => parseFloat(v);

      switch (this.temperatureFormat) {
        case 'celsius':
          f = kelvinToCelsius;
          break;
        case 'fahrenheit':
          f = kelvinToFahrenheit;
          break;
        default:
          break;
      }

      return f(temperature).toFixed(2);
    },
  },

  computed: {
    chartData() {
      if (this.details === null || this.details.observations === null) {
        return null;
      }

      const chartData = {
        labels: this.details.observations.map(o => `${o.timestamp}`),
        datasets: [
          {
            label: `Temperature (${this.temperatureUnit})`,
            backgroundColor: '#0080fa',
            data: this.details.observations.map(o =>
              this.formatTemperature(o.temperature),
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

      const observation = this.details.observations.reduce(
        (max, o) => (o.temperature > max.temperature ? o : max),
        this.details.observations[0],
      );

      return observation;
    },

    lowestObservation() {
      if (this.details === null || this.details.observations === null) {
        return null;
      }

      const observation = this.details.observations.reduce(
        (min, o) => (o.temperature < min.temperature ? o : min),
        this.details.observations[0],
      );

      return observation;
    },

    latestObservation() {
      if (this.details === null || this.details.observations === null) {
        return null;
      }

      const observation = this.details.observations[
        this.details.observations.length - 1
      ];
      return observation;
    },

    temperatureUnit() {
      return unitForFormat(this.temperatureFormat);
    },
  },
};
</script>

<style>
#point-name {
  margin-bottom: 40px;
}
#history {
  margin-top: 40px;
}
h4.observation-quick {
  height: 80px;
}
</style>