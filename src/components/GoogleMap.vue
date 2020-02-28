<template>
  <div class="google-map">
    <div class="map-body" ref="googleMap"></div>
    <template v-if="this.google && this.map">
      <slot v-bind:google="google" v-bind:map="map" />
    </template>
  </div>
</template>

<script>
  import GoogleMapsApiLoader from "google-maps-api-loader";

  export default {
    props: {
      apiKey: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        google: null,
        map: null
      }
    },

    async mounted() {
      const googleMapApi = await GoogleMapsApiLoader({
        apiKey: this.apiKey
      });
      this.google = googleMapApi;
      this.initializeMap();
    },

    methods: {
      initializeMap() {
        const mapContainer = this.$refs.googleMap;
        this.map = new this.google.maps.Map(mapContainer, {
          zoom: 4,
          center: {lat: 0, lng: 0},
          fullscreenControl: false,
          mapTypeControl: false,
          zoomControlOptions: {
            position: this.google.maps.ControlPosition.TOP_RIGHT
          },
          streetViewControlOptions: {
            position: this.google.maps.ControlPosition.TOP_RIGHT
          },
        });
      }
    }
  }
</script>

<style lang="scss">
  .google-map {
    height: 100%;

    .map-body {
      height: 100%;
    }
  }
</style>