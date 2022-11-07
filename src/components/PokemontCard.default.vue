<template>
  <div
    ref="thisCard"
    class="card"
    :class="{ active, interacting, loading }"
    :data-number="number"
    :data-subtypes="subtypes"
    :data-supertype="supertype"
    :data-rarity="rarity"
    :data-gallery="gallery"
    :style="styles"
  >

    <div class="card__translater">
      <div
        ref="rotator"
        class="card__rotator"
        @mouseenter="activate"
        @mousemove="interact"
        @mouseout="deactivate"
      >
        <img class="card__back" :src="cardBack" alt="" />
        <div class="card__front">
          <img :src="`${img.startsWith('http') ? '' : base}${img}`" alt="" loading="lazy" @load="imageLoader" />
          <Shine :subtypes="subtypes" :supertype="supertype" />
          <Glare :subtypes="subtypes" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { spring } from '@/utils/motion.js'
import Shine from './CardShine.vue'
import Glare from './CardGlare.vue'
import { resetBaseOrientation } from '@/store/orientation.js'
import { round } from '@/helpers/Math.js'

const cardBack = () => 'https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg'
const springR = { stiffness: 0.066, damping: 0.25 }
const springD = { stiffness: 0.033, damping: 0.45 }
export default {
  name: 'PokemontCard',
  props: {
    cardBack: {
      type: String,
      default: cardBack
    },
    img: {
      type: String,
      default: cardBack
    },
    number: {
      type: String,
      default: cardBack
    },
    subtypes: {
      type: String,
      default: 'basic'
    },
    supertype: {
      type: String,
      default: 'pokémon'
    },
    rarity: {
      type: String,
      default: 'common'
    },
    showcase: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Shine,
    Glare
  },
  data () {
    return {
      base: 'https://images.pokemontcg.io/',
      debounce: undefined,
      active: false,
      interacting: false,
      firstPop: true,
      loading: true,
      springRotate: spring({ x: 0, y: 0 }, springR),
      springGlare: spring({ x: 50, y: 50, o: 0 }, springR),
      springBackground: spring({ x: 50, y: 50 }, springR),
      springRotateDelta: spring({ x: 0, y: 0 }, springD),
      springTranslate: spring({ x: 0, y: 0 }, springD),
      springScale: 1
    }
  },
  computed: {
    ...mapGetters(['activeCard']),
    isActiveCard () {
      return this.$store.getters.activeCard && this.$store.getters.activeCard === this.$refs.thisCard
    },
    gallery () {
      return this.number.startsWith('tg')
    },
    styles () {
      const { springGlare, springTranslate, springRotate, springRotateDelta, springBackground, springScale } = this
      return `
        --mx: ${springGlare.value.x}%;
        --my: ${springGlare.value.y}%;
        --tx: ${springTranslate.value.x}px;
        --ty: ${springTranslate.value.y}px;
        --s: ${springScale};
        --o: ${springGlare.value.o};
        --rx: ${springRotate.value.x + springRotateDelta.value.x}deg;
        --ry: ${springRotate.value.y + springRotateDelta.value.y}deg;
        --pos: ${springBackground.value.x}% ${springBackground.value.y}%;
        --posx: ${springBackground.value.x}%;
        --posy: ${springBackground.value.y}%;
        --hyp: ${Math.sqrt((springGlare.value.y - 50) * (springGlare.value.y - 50) + (springGlare.value.x - 50) * (springGlare.value.x - 50)) / 50};
      `
    }
  },
  methods: {
    imageLoader () {
      this.loading = false
    },
    activate (e) {
      console.log(this.$refs.thisCard)
      this.$store.dispatch('setActiveCard', this.$refs.thisCard)
      resetBaseOrientation()
    },
    interact (e) {
      if (!this.isActiveCard) return

      this.interacting = true

      const $el = e.target
      const rect = $el.getBoundingClientRect() // get element's current size/position

      const absolute = {
        x: e.clientX - rect.left, // get mouse position from left
        y: e.clientY - rect.top // get mouse position from right
      }
      const percent = {
        x: round((100 / rect.width) * absolute.x),
        y: round((100 / rect.height) * absolute.y)
      }
      const center = {
        x: percent.x - 50,
        y: percent.y - 50
      }

      this.springBackground.stiffness = springR.stiffness
      this.springBackground.damping = springR.damping
      this.springBackground.set({
        x: round(50 + percent.x / 4 - 12.5),
        y: round(50 + percent.y / 3 - 16.67)
      })

      this.springRotate.stiffness = springR.stiffness
      this.springRotate.damping = springR.damping
      this.springRotate.set({
        x: round(-(center.x / 3.5)),
        y: round(center.y / 2)
      })

      this.springGlare.stiffness = springR.stiffness
      this.springGlare.damping = springR.damping
      this.springGlare.set({
        x: percent.x,
        y: percent.y,
        o: 1
      })
    },
    interactEnd (e, delay = 500) {
      const snapStiff = 0.01
      const snapDamp = 0.06

      setTimeout(() => {
        this.interacting = false

        this.springRotate.stiffness = snapStiff
        this.springRotate.damping = snapDamp
        this.springRotate.set({
          x: 0,
          y: 0
        })

        this.springGlare.stiffness = snapStiff
        this.springGlare.damping = snapDamp
        this.springGlare.set({
          x: 50,
          y: 50,
          o: 0
        })

        this.springBackground.stiffness = snapStiff
        this.springBackground.damping = snapDamp
        this.springBackground.set({
          x: 50,
          y: 50
        })
      }, delay)
    },
    deactivate (e) {
      this.interactEnd()
      this.$store.dispatch('clearActiveCard')
    }
  },
  watch: {
    '$store.getters.activeCard' (activeCard) {
      if (activeCard === this.$refs.thisCard) {
        this.active = true
      } else {
        this.active = false
      }
    }
  },
  mounted () {
    // console.log(spring({ x: 0, y: 0 }, springR))

    if (this.showcase) {
      const s = 0.02
      const d = 0.5
      let r = 0
      setTimeout(() => {
        this.interacting = true
        this.active = true
        this.springRotate.stiffness = s
        this.springRotate.damping = d
        this.springGlare.stiffness = s
        this.springGlare.damping = d
        this.springBackground.stiffness = s
        this.springBackground.damping = d

        const circle = setInterval(() => {
          r += 0.05
          this.springRotate.set({ x: Math.sin(r) * 25, y: Math.cos(r) * 25 })
          this.springGlare.set({ x: 55 + Math.sin(r) * 55, y: 55 + Math.cos(r) * 55, o: 0.8 })
          this.springBackground.set({ x: 20 + Math.sin(r) * 20, y: 20 + Math.cos(r) * 20 })
        }, 20)

        setTimeout(() => {
          clearInterval(circle)
          this.interactEnd(0)
        }, 4000)

        this.$refs.thisCard.scrollIntoView({
          behaviour: 'smooth',
          block: 'center'
        })
      }, 2000)
    }
  }
}
</script>

<style>
:root {
  --mx: 50%;
  --my: 50%;
  --s: 1;
  --o: 0;
  --tx: 0px;
  --ty: 0px;
  --rx: 0deg;
  --ry: 0deg;
  --pos: 50% 50%;
  --posx: 50%;
  --posy: 50%;
  --hyp: 0;
}

.card {
  --radius: 4.55% / 3.5%;
  z-index: calc( var(--s) * 100 );
  transform: translate3d(0,0,0.1px);
  will-change: transform, visibility;
  transform-style: preserve-3d;
}

.card.interacting {
  z-index: calc( var(--s) * 120 );
}

.card.active .card__translater,
.card.active .card__rotator {
  touch-action: none;
}

.card__translater,
.card__rotator {
  display: grid;
  perspective: 600px;
  transform-origin: center;
  will-change: transform;
}

.card__translater {
  width: auto;
  position: relative;
  transform: translate3d(var(--tx), var(--ty), 0) scale(var(--s));
}

.card__rotator {
  --glow: #69d1e9;
  transform: rotateY(var(--rx)) rotateX(var(--ry));
  transform-style: preserve-3d;
  box-shadow: 0px 10px 20px -5px black;
  border-radius: var(--radius);
  outline: none;
  transition: box-shadow 0.4s ease, outline 0.2s ease;
}

.card.active .card__rotator {
  box-shadow: 0 0 10px 0px var(--glow), 0 0 10px 0px var(--glow), 0 0 30px 0px var(--glow);
}

.card__rotator:focus {
  box-shadow: 0 0 10px 0px var(--glow), 0 0 10px 0px var(--glow), 0 0 30px 0px var(--glow);
}

.card.active .card__rotator:focus {
  box-shadow: 0px 10px 30px 3px black;
}

.card__rotator * {
  width: 100%;
  display: grid;
  grid-area: 1/1;
  border-radius: var(--radius);
  image-rendering: optimizeQuality;
  transform-style: preserve-3d;
  outline: 1px solid transparent;
}

.card__back {
  transform: rotateY(180deg);
  backface-visibility: visible;
}

.card__front,
.card__front * {
  backface-visibility: hidden;
}

.card__front {
  opacity: 1;
  transition: opacity .2s ease-out;
}

.loading .card__front {
  opacity: 0;
}

.loading .card__back {
  transform: rotateY(0deg);
}
</style>
