<template>
    <b-form @submit="onSubmit">
        <b-form-group id="inputGroup" label="Add new temperature:" label-for="observation" description="In Celsius please.">
            <b-form-input id="observation" type="text" v-model="form.observation" required placeholder="20.00">
            </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
</template>

<script>
export default {
  name: 'new-observation-form',
  props: ['onSubmit', 'form'],
  data() {
    return {};
  },
};
</script>