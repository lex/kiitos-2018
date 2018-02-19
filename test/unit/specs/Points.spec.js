import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import moxios from 'moxios';
import Points from '@/components/Points';
import baseUrl from '../../../src/utils/api';

Vue.use(BootstrapVue);

const points = [
  {
    id: 1,
    latest_observation: {
      temperature: '512.0',
      timestamp: '2018-02-18T15:53:35.636154Z'
    },
    latitude: '25.0925350',
    longitude: '55.1562243',
    name: 'Dubai'
  },
  {
    id: 2,
    latest_observation: {
      temperature: '512.0',
      timestamp: '2018-02-18T15:53:35.636154Z'
    },
    latitude: '25.0925350',
    longitude: '55.1562243',
    name: 'Other Dubai'
  }
];

const temperatureFormat = 'celsius';

describe('Points.vue', () => {
  describe('rendering', () => {
    beforeEach(() => {
      moxios.install();

      moxios.stubRequest(`${baseUrl}observation-points/`, {
        status: 200,
        response: points
      });
    });

    afterEach(() => {
      moxios.uninstall();
    });

    it('should render loading screen if no points have been fetched', () => {
      const Constructor = Vue.extend(Points);
      const props = { temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();
      expect(vm.$el.querySelector('#loading-screen')).not.to.equal(null);
    });

    it('should not render content if points have not been fetched', () => {
      const Constructor = Vue.extend(Points);
      const props = { temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();
      expect(vm.$el.querySelector('#content')).to.equal(null);
    });

    it('should not render loading screen if points have been fetched', done => {
      const Constructor = Vue.extend(Points);
      const props = { temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        Vue.nextTick(() => {
          expect(vm.$el.querySelector('#loading-screen')).to.equal(null);

          done();
        });
      });
    });

    it('should render all points if they have been fetched', done => {
      const Constructor = Vue.extend(Points);
      const props = { temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        Vue.nextTick(() => {
          expect(vm.$el.querySelector('#point-tabs').children.length).to.equal(
            points.length
          );

          done();
        });
      });
    });
  });
});
