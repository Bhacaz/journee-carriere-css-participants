<template>
  <div class="card card-width"
       :style="{ background: 'linear-gradient(165deg, rgba(255,255,255,1) 86%,' + periodToColorTag(participant.period) + '33 100%)' }">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4"><WordHighlighter highlightClass="highlighted-text" :query="search">{{ participant.title }}</WordHighlighter></p>
            <p class="subtitle is-5"><WordHighlighter highlightClass="highlighted-text" :query="search">{{ participant.name }}</WordHighlighter></p>
            <p class="subtitle is-6"><WordHighlighter highlightClass="highlighted-text" :query="search">{{ participant.formation }}</WordHighlighter></p>
          </div>
        </div>

        <div class="content">
          <p><WordHighlighter highlightClass="highlighted-text" :query="search">{{ participant.description }}</WordHighlighter></p>
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
  </div>
</template>

<script>
import WordHighlighter from "vue-word-highlighter";

export default {
  name: "Card",
  props: ["participant", "search"],
  components: {
    WordHighlighter,
  },
  methods: {
    domainToTag(domain) {
      return {
        Arts: "#f48fb1",
        Science: "#b39ddb",
        Social: "#80deea",
        Santé: "#c5e1a5",
        Construction: "#fff59d",
      }[domain];
    },
    periodToColorTag(period) {
      return {
        P2: "#1976d2",
        P3: "#ba2d65",
        P5: "#087f23",
        P6: "#ab47bc",
      }[period];
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
}

.period-tag {
  color: white;
}

</style>
