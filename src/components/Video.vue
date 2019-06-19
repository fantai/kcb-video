<template>
  <div class="ft-video" :style="{ height: height }">
    <div v-show="!playing" class="poster" @click="clickPlay">
      <img :src="poster">
      <span class="play-btn">
        <Icon name="play" colorful></Icon>
      </span>
    </div>
    <video
      v-if="playing"
      :src="item.video"
      preload="metadata"
      controls
      playsinline
      x5-playsinline
    ></video>
  </div>
</template>
<script>
  import Icon from './Icon.vue';

  const WIDTH_HEIGHT_RATIO = 640 / 362;

  export default {
    components: { Icon },
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
      return {
        height: undefined,
      };
    },
    computed: {
      poster() {
        const { video, companyAbbrName } = this.item;
        return video.replace(`${companyAbbrName}.mp4`, `cover_${companyAbbrName}.jpg`);
      },
      playing() {
        return this.value === this.item;
      },
    },
    mounted() {
      const el = this.$el;
      const width = el.offsetWidth;
      this.height = `${width / WIDTH_HEIGHT_RATIO}px`;
    },
    methods: {
      clickPlay() {
        this.$emit('input', this.item);
        this.$nextTick(() => {
          this.$el.querySelector('video').play();
        });
      },
    },
  };
</script>
<style lang="less">
  .ft-video {
    position: relative;
    width: 100%;
    .poster {
      img {
        width: 100%;
      }
    }
    video {
      object-fit: fill;
      width: 100%;
      height: 100%;
    }
    .play-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 100%;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 1;
      font-size: 44px;
    }
  }
</style>
