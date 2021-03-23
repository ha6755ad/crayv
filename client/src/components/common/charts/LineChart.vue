<template>
  <div
    :id="id"
    :style="{
      height: '100%',
      width: '100%',
      ...lget(attrs, 'divStyle', {})
    }"
  >

  </div>
</template>

<script>
  import ApexCharts from 'apexcharts';
  import {date} from 'quasar';

  export default {
    name: 'LineChart',
    props: {
      id: { type: String, default: 'LineChart' },
      chart: { type: Object }
    },
    mounted() {
      this.renderChart(0);
    },
    computed: {
      attrs() {
        return this.$attrs;
      },
      stroke() {
        let prop = this.lget(this.chart, 'stroke');
        if (prop) return prop;
        else return {
          curve: 'smooth',
          colors: ['var(--q-color-primary)']
        };
      },
      markers() {
        let prop = this.lget(this.chart, 'markers');
        if (prop) return prop;
        else return {
          size: 4,
          colors: ['var(--q-color-secondary)'],
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: {
            size: 7,
          }
        };
      },
      fill() {
        let prop = this.lget(this.chart, 'fill');
        if (prop) return prop;
        else return {
          type: 'solid',
          opacity: .9,
          colors: ['#FDD835'],
          gradient: {
            shade: 'dark',
            gradientToColors: ['#FDD835'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        };
      },
      yaxis() {
        let prop = this.lget(this.chart, 'xaxis');
        if (prop) return prop;
        else {
          return {
            labels: {
              show: true,
              formatter: (value) => {
                return this.$dollarString(value, '$', 0);
              }
            },
          };
        }
      },
      xaxis() {
        let prop = this.lget(this.chart, 'xaxis');
        if (prop) return prop;
        else {
          let list = [];
          for (let i = 0; i < 12; i++) {
            list.push(date.formatDate(date.addToDate(new Date(), { month: i, year: -1 }), 'MM/YY\''));
          }
          return {
            labels: {
              show: true
            },
            categories: list
          };
        }
      },
      series() {
        let prop = this.lget(this.chart, 'series');
        if (prop) return prop;
        else return [{
          name: 'Home Value',
          data: [352000, 356000, 354000, 365000, 378000, 387000, 392000, 388000, 409000, 408000, 410000, 415000]
        }];
      }
    },
    methods: {
      renderChart(i) {
        let el = document.getElementById(this.id);
        if (el) {
          let options = {
            yaxis: this.yaxis,
            xaxis: this.xaxis,
            series: this.series,
            stroke: this.stroke,
            markers: this.markers,
            fill: this.fill,
            chart: {
              type: 'line',
              height: '100%'
            }
          };
          let chart = new ApexCharts(el, options);
          chart.render();
        } else {
          if (i < 10) {
            setTimeout(() => {
              this.renderChart(i + 1);
            }, 200);
          } else this.$quickNotify('Error loading line chart');
        }
      }
    }
  };
</script>

<style scoped>

</style>
