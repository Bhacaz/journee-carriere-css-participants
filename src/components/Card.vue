<template>
  <div class="card card-width"
       :style="{ background: 'linear-gradient(165deg, rgba(255,255,255,1) 86%,' + periodToColorTag(participant.period) + '33 100%)' }"
  @click="showModal = !showModal">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4"><WordHighlighter highlightClass="highlighted-text" :query="search">{{ participant.title }}</WordHighlighter></p>
            <p class="subtitle is-5"><WordHighlighter highlightClass="highlighted-text" :query="search">{{ participant.name }}</WordHighlighter></p>
            <p class="subtitle is-6"><WordHighlighter highlightClass="highlighted-text" :query="search">{{ participant.formation }}</WordHighlighter></p>
          </div>
        </div>

        <div class="content">
          <p><WordHighlighter highlightClass="highlighted-text" :query="search">{{ cropDescription() }}</WordHighlighter></p>
          <p>
            <span
                v-for="domain of participant.domain"
                :key="domain"
                class="tag domain-tag"
                :style="{ backgroundColor: domainToTag(domain) }">
              <WordHighlighter highlightClass="highlighted-text" :query="search">{{ domain }}</WordHighlighter></span
            >
          </p>
          <p>
            <span class="tag is-info period-tag"
                  :style="{ backgroundColor: periodToColorTag(participant.period) }"
            >
              <WordHighlighter highlightClass="highlighted-text" :query="search">{{ participant.period }}</WordHighlighter>
            </span>
          </p>
        </div>
      </div>

    <div class="modal" :class=" { 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head" :class="{ 'color-animation': participant.name === 'Jean-Francis Bastien' }">
          <p class="modal-card-title">{{ participant.name }}</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <h3 class="title is-5">{{ participant.title }}</h3>
          <p>{{ participant.description }}</p>
          <p style="padding-top: 2em;">
                      <span
                          v-for="domain of participant.domain"
                          :key="domain"
                          class="tag domain-tag"
                          :style="{ backgroundColor: domainToTag(domain) }">
            {{ domain }}</span>
          </p>
        </section>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>
  </div>
</template>

<script>
import WordHighlighter from "vue-word-highlighter";

export default {
  name: "Card",
  props: ["participant", "search"],
  data() {
    return {
      showModal: false
    }
  },
  components: {
    WordHighlighter,
  },
  methods: {
    domainToTag(domain) {
      return {
        "Relation d’aide": "#f8bbd0",
        "Science de la santé humaine et animal": "#e1bee7",
        "Administration": "#c5cae9",
        "Commerce": "#c5e1a5",
        "Enseignement": "#b2ebf2",
        "Ingénierie et science pure": "#c8e6c9",
        "Science de la santé et animal": "#fff9c4",
        "Sciences humaines": "#ffe082",
        "Politique, justice et sécurité": "#ffab91",
        "Arts": "#c7a4ff",
        "Transport et entretien d'équipement motorisé": "#aab6fe",
        "Informatique et multimédia": "#88ffff",
        "Génie et science pure": "#b2fab4",
        "Gestion": "#ff7961",
        "Services administratifs et bureautique": "#6ec6ff",
        "Bâtiment et travaux publics": "#52c7b8",
        "Fabrication et transformation": "#ffff6b",
        "Sports, loisirs et divertissements": "#ffc046",
        "Agroalimentaire": "#6abf69",
      }[domain];
    },
    periodToColorTag(period) {
      return {
        P2: "#1976d2",
        P3: "#ba2d65",
        P5: "#087f23",
        P6: "#ab47bc",
      }[period];
    },
    cropDescription() {
      if (this.participant.description && this.participant.description.length >= 300) {
        return this.participant.description.substring(0, 300) + '...'
      } else {
        return this.participant.description
      }
    }
  },
};
</script>

<style>
.card-width {
  max-width: 24em;
}

.flex-container {
  justify-content: center;
}

.card {
  margin: 0.5em;
  height: 100%;
}

.highlighted-text {
  font-size: 125%;
  background-color: #48c78e22;
  padding: 0.1em;
  border-radius: 10px;
;
}

.domain-tag {
  margin-right: 1em;
  margin-bottom: 1em;
}

.period-tag {
  color: white;
}

.modal-card-body {
  padding-bottom: 2.5em;
}

.color-animation {
  animation: animateBg 10s linear infinite;
  background-image: linear-gradient(0deg,#cf5c5c,#c19b4a,#def2a0,#c6ee4a,#42eca6,#64b3d9,#208ea2,#498ada,#5b73df,#897ed3,#cf5c5c,#c19b4a);
  background-size: 100% 1100%;
}
@keyframes animateBg {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
}

</style>
