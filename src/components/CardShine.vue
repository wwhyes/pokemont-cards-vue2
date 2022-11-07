<template>
  <div class="card__shine" :class="[subtypes, supertype]" />
</template>

<script>
export default {
  name: 'CardShine',
  props: {
    subtypes: {
      type: String,
      default: 'basic'
    },
    supertype: {
      type: String,
      default: 'pokémon'
    }
  }
}
</script>

<style>
/* setup */
.card__shine {
  display: grid;
  overflow: hidden;
  transform: translateZ(1px);
  background: transparent;
  z-index: 3;
  mix-blend-mode: color-dodge;
  filter: brightness(.85) contrast(2.75) saturate(.65);
  background-size: cover;
  background-position: center;
  opacity: var(--o);
}

.card__shine:after {
  content: " ";
  grid-area: 1/1;
}
</style>
