export default {
  methods: {
    $_ToastController_success(text) {
      this.$toasted.show(text, {
        iconPack: 'fontawesome', 
        icon: 'fa-check',
        className: 'custom-success',
        position: 'top-center', 
        duration : 5000
      });
    },

    $_ToastController_danger(text) {
      this.$toasted.show(text, {
        iconPack: 'fontawesome', 
        icon: 'fa-times',
        className: 'custom-danger',
        position: 'top-center', 
        duration : 5000
      });
    },

    $_ToastController_warning(text) {
      this.$toasted.show(text, {
        iconPack: 'fontawesome', 
        icon: 'fa-exclamation-triangle',
        className: 'custom-warning',
        position: 'top-center', 
        duration : 5000
      });
    }
  }
}