<template>
  <div style="padding: 50px">
    <CardList>
      <PokemontCard
        :key="0"
        v-bind="card1"
      />
      <PokemontCard
        :key="1"
        v-bind="card2"

      />
      <PokemontCard
        :key="2"
        v-bind="card3"
      />
    </CardList>
  </div>
</template>

<script>
import CardList from '@/components/CardList.vue'
import PokemontCard from '@/components/PokemontCard.vue'
import data from '@/assets/data.json'

export default {
  components: {
    CardList,
    PokemontCard
  },
  data () {
    const cards = data.map((item) => {
      const subtypes = Array.isArray(item.subtypes)
        ? item.subtypes.join(' ').toLowerCase()
        : item.subtypes.toLowerCase()

      return {
        img: item.images.large,
        number: item.number.toLowerCase(),
        supertype: item.supertype.toLowerCase(),
        subtypes,
        rarity: item.rarity.toLowerCase()
      }
    })
    return {
      card1: cards[6],
      card2: cards[16],
      card3: cards[26]
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body, html {
  height: 100%;
  padding: 0;
  margin: 0;
  scroll-behavior: smooth;
}

body {
  font-family: 'Roboto';
  background-color: rgb(57, 60, 66);
}

a {
  color: cyan;
}

main {
  color: white;
  padding: 50px;
  max-width: 1200px;
  margin: auto;
}

header {
  margin-bottom: 4rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  max-width: 900px;
  margin: auto;
}

header h2 {
  margin-top: 0;
  font-weight: 100;
}

@media screen and (min-width: 600px) {
  header {
    grid-template-columns: 50% 1fr;
  }
  .showcase {
    grid-column: 2;
    grid-row: 2/4;
  }
  .intro, .info {
    grid-column: 1;
  }
}

@media screen and (min-width: 900px) {
  header {
    grid-template-columns: 60% 1fr;
  }
}

.showcase {
  z-index: 99;
  max-width: min(330px, 80vw);
  margin: auto;
}

h1 {
  margin-top: 0;
  margin-bottom: 0.25em;
}

p {
  margin: 0 0 0.25em;
  line-height: 1.5;
}

p.small {
  font-size: 0.875rem;
  opacity: 0.75;
}

h1,
h2,
h3 {
  font-family: 'Roboto Condensed';
}

h2 {
  margin-top: 4em;
  margin-bottom: 0.25em;
}

h2 + p,
h2 + p + p {
  font-style: italic;
  margin-bottom: 1em;
}

hr {
  border: none;
  background: white;
  height: 1px;
  opacity: 0.25;
  margin: 1em -1em;
}

h1 sup {
  font-weight: 300;
  font-size: 0.5em;
}

h2 sup {
  font-weight: 300;
  font-size: 0.75em;
}

mark {
  background: #006065;
  color: white;
  font-style: italic;
  font-weight: bold;
  padding-inline: 0.25em;
  border-radius: 3px;
}
</style>
