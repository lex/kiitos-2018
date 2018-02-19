import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import moxios from 'moxios';
import PointDetails from '@/components/PointDetails';
import {
  kelvinToCelsius,
  celsiusToKelvin
} from '../../../src/utils/temperature-converter';
import baseUrl from '../../../src/utils/api';

Vue.use(BootstrapVue);

const point = {
  id: 1,
  latitude: '25.0925350',
  longitude: '55.1562243',
  name: 'Dubai'
};

const details = {
  ...point,
  observations: [
    {
      temperature: '515.0',
      timestamp: '2018-02-18T15:51:35.636154Z'
    },
    {
      temperature: '510.0',
      timestamp: '2018-02-18T15:52:35.636154Z'
    },
    {
      temperature: '512.0',
      timestamp: '2018-02-18T15:53:35.636154Z'
    }
  ]
};

const newObservation = {
  temperature: '23.0',
  timestamp: '2018-02-18T17:53:35.636154Z'
};

const temperatureFormat = 'celsius';

describe('PointDetails.vue', () => {
  beforeEach(() => {
    // import and pass your custom axios instance to this method
    moxios.install();
  });

  afterEach(() => {
    // import and pass your custom axios instance to this method
    moxios.uninstall();
  });
  describe('rendering', () => {
    it('should render correct name for observation point', () => {
      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();
      expect(vm.$el.querySelector('#point-name').textContent.trim()).to.equal(
        point.name
      );
    });

    it('should not render history without details', () => {
      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();
      expect(vm.$el.querySelector('#history')).to.equal(null);
    });

    it('should render history when details are available', () => {
      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();
      vm.details = details;
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('#history')).to.not.equal(null);
      });
    });

    it('should tell the user when there are no observations', () => {
      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();
      expect(
        vm.$el.querySelector('#no-observations').textContent.trim()
      ).to.equal('No observations.');
    });

    it('should show the latest observation when there is one', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });
      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        Vue.nextTick(() => {
          expect(
            vm.$el.querySelector('#observation-latest').textContent
          ).to.include(
            kelvinToCelsius(details.observations[2].temperature).toFixed(2)
          );
          done();
        });
      });
    });

    it('should show the highest observation when there is one', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });
      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        Vue.nextTick(() => {
          expect(
            vm.$el.querySelector('#observation-highest').textContent
          ).to.include(
            kelvinToCelsius(details.observations[0].temperature).toFixed(2)
          );
          done();
        });
      });
    });

    it('should show the lowest observation when there is one', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });
      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        Vue.nextTick(() => {
          expect(
            vm.$el.querySelector('#observation-lowest').textContent
          ).to.include(
            kelvinToCelsius(details.observations[1].temperature).toFixed(2)
          );
          done();
        });
      });
    });

    it('should show a chart', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });
      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        Vue.nextTick(() => {
          expect(vm.$el.querySelector('#temperature-chart')).not.to.equal(null);
          done();
        });
      });
    });

    it('should show temperatures in different units when the setting is changed', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });
      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        vm.temperatureFormat = 'kelvin';
        Vue.nextTick(() => {
          expect(
            vm.$el.querySelector('#observation-latest').textContent
          ).to.include(
            parseFloat(details.observations[2].temperature).toFixed(2)
          );
          done();
        });
      });
    });
  });

  describe('computed', () => {
    it('should determine the highest observation correctly', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });

      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        Vue.nextTick(() => {
          expect(vm.highestObservation.temperature).to.equal(
            parseFloat(details.observations[0].temperature)
          );
          done();
        });
      });
    });

    it('should determine the lowest observation correctly', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });

      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        Vue.nextTick(() => {
          expect(vm.lowestObservation.temperature).to.equal(
            parseFloat(details.observations[1].temperature)
          );
          done();
        });
      });
    });

    it('should determine the latest observation correctly', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });

      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();

      moxios.wait(() => {
        Vue.nextTick(() => {
          expect(vm.latestObservation.temperature).to.equal(
            parseFloat(details.observations[2].temperature)
          );
          done();
        });
      });
    });
  });

  describe('methods', () => {
    it('onSubmit should send temperature to backend and add it to the list of observations', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });
      moxios.stubRequest(`${baseUrl}observations/`, {
        status: 200,
        response: newObservation
      });

      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();
      vm.form = { observation: newObservation.temperature };

      vm.onSubmit({ preventDefault: () => {} });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();

        expect(request.config.method).to.equal('post');

        const response = JSON.parse(request.config.data);

        expect(parseFloat(response.point_id)).to.equal(point.id);
        expect(parseFloat(response.temperature)).to.equal(
          celsiusToKelvin(parseFloat(newObservation.temperature))
        );

        Vue.nextTick(() => {
          expect(
            vm.details.observations[vm.details.observations.length - 1]
              .temperature
          ).to.equal(newObservation.temperature);
          done();
        });
      });
    });

    it('onSubmit should not add a temperature and show a message if backend says so', done => {
      moxios.stubRequest(`${baseUrl}observation-points/1/`, {
        status: 200,
        response: details
      });
      moxios.stubRequest(`${baseUrl}observations/`, {
        status: 400,
        response: { error: 'error' }
      });

      const Constructor = Vue.extend(PointDetails);
      const props = { point, temperatureFormat };
      const vm = new Constructor({ propsData: props }).$mount();
      vm.form = { observation: newObservation.temperature };

      vm.onSubmit({ preventDefault: () => {} });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();

        expect(request.config.method).to.equal('post');

        const response = JSON.parse(request.config.data);

        expect(parseFloat(response.point_id)).to.equal(point.id);
        expect(parseFloat(response.temperature)).to.equal(
          celsiusToKelvin(parseFloat(newObservation.temperature))
        );

        Vue.nextTick(() => {
          expect(vm.details.observations.length).to.equal(
            details.observations.length
          );
          done();
        });
      });
    });
  });
});
