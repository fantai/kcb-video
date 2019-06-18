<template>
  <video
    :poster="poster"
    class="ft-video" :src="item.video" :style="{ height: height }" preload="metadata" controls
  ></video>
</template>
<script>
  const WIDTH_HEIGHT_RATIO = 640 / 362;

  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
      value: {
        type: Object,
        default: undefined,
      },
    },
    data() {
      const { video, companyAbbrName } = this.item;
      const poster = video.replace(`${companyAbbrName}.mp4`, `cover_${companyAbbrName}.jpg`);
      return {
        height: undefined,
        poster,
      };
    },
    watch: {
      value() {
        const { value, item, $el } = this;
        if (value !== item) {
          // 暂停
          $el.pause();
        }
      },
    },
    mounted() {
      const el = this.$el;
      const width = el.offsetWidth;
      this.height = `${width / WIDTH_HEIGHT_RATIO}px`;
      el.addEventListener('play', () => this.$emit('input', this.item));
    },
  };
</script>
<style lang="less">
  .ft-video {
    width: 100%;
  }
</style>
