<template>
  <div class="components LiveGifts flex-h">
    <a class="iconfont iconjiantouleft GiftsPrev" @click="$emit('Close')"></a>
    <div class="flex-item">
      <div>
        <swiper :options="options" ref="GiftsSwiper">
          <swiper-slide v-for="(item, index) in List" :key="index">
            <div class="Img" @click="Trigger(item, index)" :class="{'active': item.active}">
              <img :src="item.imgPath2" class="centerLabel contain" alt="">
            </div>
          </swiper-slide>
          <swiper-slide v-for="(item, index) in (6 - (List.length % 6))" :key="`new-${index}`">
            <div class="Img None"></div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <a class="iconfont iconjiantouright GiftsNext" @click="$emit('Close')"></a>
  </div>
</template>

<script>
/*
*/
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'LiveGifts',
  props: {
    List: {
      default: () => {
        return []
      },
      type: Array
    }
  },
  data () {
    return {
      options: {
        slidesPerView: 6,
        slidesPerGroup: 6,
        spaceBetween: 10,
        initialSlide: null,
        navigation: {
          nextEl: `.GiftsNext`,
          prevEl: `.GiftsPrev`
        }
      }
    }
  },
  computed: {
    GiftsSwiper () {
      return this.$refs.GiftsSwiper.swiper
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  created () {
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    Trigger (item, index) {
      this.$emit('Trigger', { ...item, index })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'page.scss';
</style>
