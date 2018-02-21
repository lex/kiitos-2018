<template>
  <div id="form">
    <b-form @submit="onSubmit">
      <b-form-group id="inputGroup" label="Add new temperature:" label-for="observation" :description="description">
        <b-form-input id="observation" type="text" v-model="form.observation" required :placeholder="placeholder">
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Add</b-button>
    </b-form>
    <b-alert id="error" show variant="danger" v-if="error">{{ error }}</b-alert>
  </div>
</template>

<script>
import {
  kelvinToCelsius,
  kelvinToFahrenheit,
  unitForFormat,
} from '../utils/temperature-converter';

export default {
  name: 'new-observation-form',
  props: ['onSubmit', 'form', 'error', 'temperatureFormat'],
  data() {
    return {};
  },
  computed: {
    placeholder() {
      const placeholderTemperature = 296.65;
      let formattedTemperature = 0.0;

      switch (this.temperatureFormat) {
        case 'celsius':
          formattedTemperature = kelvinToCelsius(placeholderTemperature);
          break;
        case 'fahrenheit':
          formattedTemperature = kelvinToFahrenheit(placeholderTemperature);
          break;
        default:
          formattedTemperature = placeholderTemperature;
          break;
      }

      return `${formattedTemperature.toFixed(2)}`;
    },
    description() {
      return `In the selected unit (${unitForFormat(this.temperatureFormat)})`;
    },
  },
};
</script>

<style>
#error {
  margin-top: 10px;
}
#form {
  margin: 0 auto;
  width: 40%;
}
</style>