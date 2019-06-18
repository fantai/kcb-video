<template>
  <component :is="svg" :class="{ colorful: colorful }" class="ft-icon"/>
</template>
<script>
  export default {
    props: {
      name: {
        type: String,
        default: undefined,
      },
      colorful: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      import(/* webpackMode: "eager" */`@/assets/icons/${this.name}.svg`).then((data) => {
        this.svg = data.default;
      });
      return {
        svg: undefined,
      };
    },
  };
</script>
<style lang="less">
  .ft-icon {
    width: 1em;
    height: 1em; /* or any other relative font sizes */

    /* You would have to include the following two lines to make this work in Safari */
    max-width: 100%;
    max-height: 100%;

    &:not(.colorful) * {
      fill: currentColor !important;
    }
  }
</style>
