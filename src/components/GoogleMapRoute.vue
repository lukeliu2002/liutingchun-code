<script>
  import { MSG_UNEXPECTED_ERROR } from '@/constants';
  import ToastController from '@/mixins/ToastController';

  export default {
    props: {
      google: {
        type: Object,
        required: true
      },
      map: {
        type: Object,
        required: true
      },
      waypoints: {
        type: Array,
        required: true
      }
    },

    mixins: [ ToastController ],

    data() {
      return {
        directionsRenderer: null
      }
    },

    mounted() {
      const waypoints = this.waypoints.map(({ lat, lng }) => new this.google.maps.LatLng(lat, lng));
      const origin = waypoints.shift();
      const destination = waypoints.length > 0 ? waypoints.pop() : origin;

      const directionsService = new this.google.maps.DirectionsService();
      directionsService.route({
        origin,
        destination,
        waypoints: waypoints.map(waypoint => ({ location: waypoint })),
        travelMode: this.google.maps.TravelMode.DRIVING
      }, (response, status) => {
          if (status == this.google.maps.DirectionsStatus.OK) {
            this.directionsRenderer = new this.google.maps.DirectionsRenderer();
            this.directionsRenderer.setDirections(response);
            this.directionsRenderer.setMap(this.map);
          } else {
            this.$_ToastController_danger(MSG_UNEXPECTED_ERROR);
          }
      })
    },

    beforeDestroy() {
      if (this.directionsRenderer)
        this.directionsRenderer.setMap(null);
    },

    render() {
      return null;
    }
  };
</script>