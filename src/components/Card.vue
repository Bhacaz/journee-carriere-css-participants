<template>
  <div class="card card-width">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4"><WordHighlighter :query="search">{{ participant.title }}</WordHighlighter></p>
            <p class="subtitle is-5"><WordHighlighter :query="search">{{ participant.name }}</WordHighlighter></p>
            <p class="subtitle is-6"><WordHighlighter :query="search">{{ participant.formation }}</WordHighlighter></p>
          </div>
        </div>

        <div class="content">
          <p><WordHighlighter :query="search">{{ participant.description }}</WordHighlighter></p>
          <p>
            <span
                class="tag"
                :style="{ backgroundColor: domainToTag(participant.domain) }"
            ><WordHighlighter :query="search">{{ participant.domain }}</WordHighlighter></span
            >
          </p>
          <p>
            <span class="tag is-info"><WordHighlighter :query="search">{{ participant.period }}</WordHighlighter></span>
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
</style>
