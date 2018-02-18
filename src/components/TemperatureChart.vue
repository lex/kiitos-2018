<script>
import { Line } from 'vue-chartjs';

export default {
  name: 'temperature-chart',
  extends: Line,
  props: ['observations', 'options'],
  mounted() {
    const chartData = {
      labels: this.observations.map(o => o.timestamp),
      datasets: [
        {
          label: 'Temperature (C)',
          backgroundColor: '#0080fa',
          data: this.observations.map(o =>
            (parseFloat(o.temperature) - 273.15).toFixed(2),
          ),
        },
      ],
    };
    this.renderChart(chartData, this.options);
  },
};
</script>