<template>
  <div
    class="card card-width"
    :style="{
      background:
        'linear-gradient(165deg, rgba(255,255,255,1) 86%,' +
        periodToColorTag(participant.hourPeriod()) +
        '33 100%)',
    }"
  >
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <div class="columns is-mobile">
            <div class="column" @click="clickOnModal()">
                <h5 class="title is-5">
                  <WordHighlighter
                      highlightClass="highlighted-text"
                      :query="search"
                  >{{ participant.title }}</WordHighlighter
                  >
                </h5>
            </div>
            <div class="column has-text-right is-2 pl-0 pr-0 mr-3" style="width: 1rem;">
              <span class="icon is-small is-left" @click="clickOnStars()">
                  <i class="fa fa-lg" :class="[starIcon()]" aria-hidden="true"></i>
              </span>
          ️</div>
          </div>
          <p class="subtitle is-5" @click="clickOnModal()">
            <WordHighlighter
              highlightClass="highlighted-text"
              :query="search"
              >{{ participant.name }}</WordHighlighter
            >
          </p>
          <p class="subtitle is-6" @click="clickOnModal()">
            <WordHighlighter
              highlightClass="highlighted-text"
              :query="search"
              >{{ participant.formation }}</WordHighlighter
            >
          </p>
        </div>
      </div>

      <div class="content" @click="clickOnModal()">
        <p>
          <WordHighlighter highlightClass="highlighted-text" :query="search">{{
            cropDescription()
          }}</WordHighlighter>
        </p>
        <p>
          <span
            v-for="domain of participant.domain"
            :key="domain"
            class="tag domain-tag"
            :style="{ backgroundColor: domainToTag(domain) }"
          >
            <WordHighlighter
              highlightClass="highlighted-text"
              :query="search"
              >{{ domain }}</WordHighlighter
            ></span
          >
        </p>
        <p>
          <span
            class="tag is-info period-tag"
            :style="{ backgroundColor: periodToColorTag(participant.hourPeriod()) }"
          >
            <WordHighlighter
              highlightClass="highlighted-text"
              :query="search"
              >{{ participant.period }}</WordHighlighter
            >
          </span>
        </p>
      </div>
    </div>

    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="clickCloseModal()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ participant.name }}</p>
        </header>
        <section class="modal-card-body">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <h3 class="title is-5">{{ participant.title }}</h3>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <a :href="participant.link_reperes" target="_blank">
                  <img src="/img/reperes.png" alt="Répères" style="width: 3em;" />
                </a>
              </div>
            </div>
          </div>
          <p>{{ participant.description }}</p>
          <p style="padding-top: 2em">
            <span
              v-for="domain of participant.domain"
              :key="domain"
              class="tag domain-tag"
              :style="{ backgroundColor: domainToTag(domain) }"
            >
              {{ domain }}</span
            >
          </p>
          <div>
            <HollandCode :codes="participant.holland_codes" />
          </div>
        </section>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="clickCloseModal()"></button>
    </div>
  </div>
</template>

<script>
import WordHighlighter from "vue-word-highlighter";
import HollandCode from "@/components/HollandCode";

export default {
  name: "ParticipantCard",
  props: ["participant", "search"],
  emits: ["star-clicked"],
  data() {
    return {
      showModal: false,
    };
  },
  components: {
    WordHighlighter,
    HollandCode,
  },
  methods: {
    domainToTag(domain) {
      return {
        "Relation d’aide": "#f8bbd0",
        "Science de la santé humaine et animal": "#e1bee7",
        Administration: "#c5cae9",
        Commerce: "#c5e1a5",
        Enseignement: "#b2ebf2",
        "Ingénierie et science pure": "#c8e6c9",
        "Science de la santé et animal": "#fff9c4",
        "Sciences humaines": "#ffe082",
        "Politique, justice et sécurité": "#ffab91",
        Arts: "#c7a4ff",
        "Transport et entretien d'équipement motorisé": "#aab6fe",
        "Informatique et multimédia": "#88ffff",
        "Génie et science pure": "#b2fab4",
        Gestion: "#ff7961",
        "Services administratifs et bureautique": "#6ec6ff",
        "Bâtiment et travaux publics": "#52c7b8",
        "Fabrication et transformation": "#ffff6b",
        "Sports, loisirs et divertissements": "#ffc046",
        Agroalimentaire: "#6abf69",
      }[domain];
    },
    periodToColorTag(period) {
      return {
        "11h": "#1976d2",
        "12h": "#ba2d65",
        "14h": "#087f23",
        "15h": "#ab47bc",
      }[period];
    },
    cropDescription() {
      if (
        this.participant.description &&
        this.participant.description.length >= 300
      ) {
        return this.participant.description.substring(0, 300) + "...";
      } else {
        return this.participant.description;
      }
    },
    clickOnModal() {
      // track event only if modal was closed.
      if (!this.showModal && typeof umami !== "undefined") {
        // eslint-disable-next-line no-undef
        umami.trackEvent("participant-click - " + this.participant.name, { type: "participant-click" } );
      }
      this.showModal = !this.showModal;
    },
    clickCloseModal() {
      this.showModal = false;
    },
    clickOnStars() {
      this.participant.toggleStar();
      this.$emit("star-clicked")
    },
    starIcon() {
      return this.participant.star ? "fa-star has-text-warning" : "fa-star-o";
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

.highlighted-text {
  font-size: 125%;
  background-color: #48c78e22;
  padding: 0.1em;
  border-radius: 10px;
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

.full-width {
  width: 100%;
}

.modal-card {
  max-height: calc(100vh - 120px);
}

@keyframes animateBg {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% 100%;
  }
}
</style>
