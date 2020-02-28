<template>
  <div id="app">
    <div class="sidebar">
      <div class="form-block">
        <ThemeInput 
          label="Starting location"
          v-model="startingLocation" 
          v-bind:disabled="isLoading" />
        <ThemeInput 
          label="Drop-off point"
          v-model="dropOffPoint" 
          v-bind:disabled="isLoading" />
      </div>

      <div class="description-block">
        <p>total distance: {{totalDistance || 'N/A'}}</p>
        <p>total time: {{totalTime || 'N/A'}}</p>
      </div>

      <div class="button-block">
        <ThemeButton theme="primary" v-on:click="onSubmit()" v-bind:disabled="isLoading || !canSubmit">
          {{ isLoading ? 'Loading...' : 'Submit' }}
        </ThemeButton>
        <ThemeButton theme="secondary" v-on:click="onReset()" v-bind:disabled="isLoading">
          Reset
        </ThemeButton>
      </div>

    </div>

    <GoogleMap v-bind:api-key="GOOGLE_API_KEY">
      <template slot-scope="{ google, map }">
        <GoogleMapRoute
          v-if="waypoints.length > 0"
          v-bind:google="google"
          v-bind:map="map"
          v-bind:waypoints="waypoints"
        />
      </template>
    </GoogleMap>
  </div>
</template>

<script>
  import { GOOGLE_API_KEY, MSG_TIMEOUT } from '@/constants';
  import { getRoute, postRoute } from '@/api';

  import ToastController from '@/mixins/ToastController';

  import GoogleMap from '@/components/GoogleMap.vue';
  import GoogleMapRoute from '@/components/GoogleMapRoute.vue';
  import ThemeButton from '@/components/ThemeButton.vue';
  import ThemeInput from '@/components/ThemeInput.vue';

  export default {
    components: {
      GoogleMap,
      GoogleMapRoute,
      ThemeButton,
      ThemeInput
    },

    mixins: [ ToastController ],

    data() {
      return {
        isLoading: false,
        startingLocation: '',
        dropOffPoint: '',
        totalDistance: null,
        totalTime: null,
        waypoints: []
      }
    },

    computed: {
      GOOGLE_API_KEY() {
        return GOOGLE_API_KEY
      },

      canSubmit() {
        return this.startingLocation && this.dropOffPoint
      }
    },

    methods: {
      onSubmit() {
        this.waypoints = [];
        this.totalDistance = null;
        this.totalTime = null;

        this.isLoading = true;
        postRoute(this.startingLocation, this.dropOffPoint)
          .then(({ token }) => {
            this.onPostRouteSuccess(token);
          })
          .catch(({ message }) => {
            this.$_ToastController_danger(message);
            this.isLoading = false;
          })
      },

      onPostRouteSuccess(token) {
        getRoute(token)
          .then(({ path, totalDistance, totalTime }) => {
            this.waypoints = path.map(([ lat, lng ]) => ({ lat, lng }));
            this.totalDistance = totalDistance;
            this.totalTime = totalTime;
            this.isLoading = false;
          })
          .catch(({ status, message }) => {
            if (status === 'timeout') {
              this.$_ToastController_warning(MSG_TIMEOUT);
              setTimeout(() => {
                this.onPostRouteSuccess(token)
              }, 2000);
            }
            else {
              this.$_ToastController_danger(message);
              this.isLoading = false;
            }
          })
      },

      onReset() {
        this.startingLocation = '';
        this.dropOffPoint = '';
        this.totalDistance = null;
        this.totalTim = null;
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/theme.scss";

  #app {
    height: 100vh; 

    .sidebar {
      box-sizing: border-box;
      z-index: 1;
      position: fixed;
      background-color: rgba($white, 0.8);
      transition: opacity 0.3s;
      padding: 10px;
      border-radius: 5px;

      @media (max-width: map-get($breakpoints, sm)) {
        margin: 10px;
        width: calc(100% - 20px);
        bottom: 10px;
      }

      @media (min-width: map-get($breakpoints, sm)) {
        width: 260px;
        left: 10px;
        top: 10px;
      }
    }

    .form-block {
      margin-bottom: 32px;

      .theme-input {
        margin-bottom: 12px;
      }
    }

    .description-block {
      margin-bottom: 48px;
    }

    .button-block {
      display: flex;
      justify-content: space-around;

      button {
        flex-basis: 0;
        flex-grow: 1;
        margin-left: 4px;
        margin-right: 4px;
      }
    }
  }
</style>
