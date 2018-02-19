import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import NavigationBar from '@/components/NavigationBar';

Vue.use(BootstrapVue);

const temperatureFormats = [
  { value: 'value1', text: 'value1text' },
  { value: 'value2', text: 'value2text' },
  { value: 'value3', text: 'value3text' }
];

const temperatureFormat = 'value1';

describe('NavigationBar.vue', () => {
  describe('rendering', () => {
    it('should list all available temperature formats', () => {
      const Constructor = Vue.extend(NavigationBar);
      const props = { temperatureFormats, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      temperatureFormats.forEach(f => {
        expect(vm.$el.querySelector(`#${f.value}`)).not.to.equal(null);
        expect(vm.$el.querySelector(`#${f.value}`).textContent.trim()).to.equal(
          f.text
        );
      });
    });

    it('should show the selected temperature format in the dropdown button', () => {
      const Constructor = Vue.extend(NavigationBar);
      const props = { temperatureFormats, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      expect(
        vm.$el.querySelector('#ddown-left__BV_toggle_').textContent
      ).to.equal(temperatureFormats[0].text);
    });

    it('should show the selected temperature format in the dropdown button after it has been changed', () => {
      const Constructor = Vue.extend(NavigationBar);
      const props = { temperatureFormats, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();
      vm.temperatureFormat = 'value2';

      Vue.nextTick(() => {
        expect(
          vm.$el.querySelector('#ddown-left__BV_toggle_').textContent
        ).to.equal(temperatureFormats[1].text);
      });
    });
  });
});
