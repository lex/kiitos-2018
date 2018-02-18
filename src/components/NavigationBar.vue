<template>
    <b-navbar id="nav-bar" variant="dark" type="dark" toggleable>
        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
        <b-navbar-brand tag="h3" class="mb-0">Kiitos-2018</b-navbar-brand>
        <b-dropdown id="ddown-left" :text="selectedFormat" variant="primary" class="m-2">
            <b-dropdown-item-button v-for="format of temperatureFormats" :id="format.value" @click="onClick" href="#">
                {{ format.text }}
            </b-dropdown-item-button>
        </b-dropdown>
    </b-navbar>
</template>

<script>
export default {
  name: 'navigation-bar',
  props: ['temperatureFormat', 'temperatureFormats', 'onClick'],
  data() {
    return {};
  },
  computed: {
    selectedFormat() {
      return this.temperatureFormats.filter(
        f => f.value === this.temperatureFormat,
      );
    },
  },
};
</script>

<style>
#unit-dropdown {
  display: inline-block;
}
#unit-dropdown li a {
  color: white;
}
</style>