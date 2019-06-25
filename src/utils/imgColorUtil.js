import Vue from 'vue';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const store = new Vue({
  data: {
    cache: {},
  },
  methods: {
    getImageColor(imagePath) {
      let color = this.cache[imagePath];
      if (!color) {
        this.computeImageColor(imagePath);
        color = 'white'; // 默认白色
      }
      return color;
    },
    computeImageColor(imagePath) {
      const image = new Image();
      image.crossOrigin = '';
      image.onload = () => {
        ctx.clearRect(1, 1, 1, 1);
        ctx.drawImage(image, 0, 0);
        const colorData = ctx.getImageData(1, 1, 1, 1).data; // 获取x=1,y=1像素处的颜色
        Vue.set(this.cache, imagePath, `#${this.rgbToHex(colorData[0], colorData[1], colorData[2])}`);
        // this.cache[imagePath] = `#${this.rgbToHex(colorData[0], colorData[1], colorData[2])}`;
      };
      image.src = imagePath;
    },
    rgbToHex(r, g, b) {
      if (r > 255 || g > 255 || b > 255) {
        return 'FFFFFF';
      }
      // eslint-disable-next-line no-bitwise
      return ((r << 16) | (g << 8) | b).toString(16);
    },
  },
});

// eslint-disable-next-line import/prefer-default-export
export const { getImageColor } = store;
