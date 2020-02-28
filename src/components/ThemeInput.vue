<template>
  <div class="theme-input">
    <label v-if="label">{{label}}</label>
    <div class="input-wrapper">
      <input v-model="vModel" v-bind:disabled="disabled">
      <i class="fas fa-times" 
        v-bind:class="{ 'disabled': disabled || !vModel }"
        v-on:click="onReset()" />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: String,
      disabled: Boolean,
      value: {
        type: String,
        required: true
      }
    },

    computed: {
      vModel: {
        get() {
          return this.value;
        },

        set(value) {
          this.$emit('input', value);
        }
      }
    },

    methods: {
      onReset() {
        this.vModel = '';
      }
    }
  }
</script>

<style lang="scss">
  @import "@/assets/theme.scss";

  .theme-input {
    label {
      display: inline-block;
      margin-bottom: 6px;
    }      

    .input-wrapper {
      display: flex;

      input {
        flex: 1 1 auto;
        box-sizing: border-box;
        display: block;
        width: 100%;
        padding: 5px 10px;
        line-height: 1.5;
        color: $gray-700;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid $gray-400;
        border-radius: 5px;

        &:disabled {
          background-color: $gray-200;
        }
      }

      i {
        flex: 0 0 auto;
        margin-left: 5px;
        text-align: right;
        align-self: center;

        &.disabled {
          color: $gray-400;
        }

        &:not(.disabled) {
          cursor: pointer;
        }
      }
    }
  }
</style>