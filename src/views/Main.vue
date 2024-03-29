<template>
  <div id="app">
    <section id="header-section" class="hero is-primary">
      <div class="hero-body">
        <p class="title">Journée Carrière - Collège Saint-Sacrement</p>
        <p class="subtitle">
          Aide aux choix : Description des professionnel(le)s participant à la
          journée carrière. <br /><em>14 novembre 2023</em>
        </p>
        <strong>Formulaire d'inscription: 👉 </strong>
        <a href="https://forms.gle/HRNDBw4bGmarHNRcA" target="_blank">Google Forms</a><br />
<!--        <a href="#">Google Forms (bientôt)</a><br />-->

        <section class="section" id="search-section">
          <div class="field container">
            <p class="control has-icons-left">
              <input
                class="input is-rounded"
                type="text"
                placeholder="Recherche"
                v-model="search"
                @input="$emit('update:search', $event.target.value)"
              />
              <span class="icon is-small is-left">
                <i class="fa fa-search" aria-hidden="true"></i>
              </span>
            </p>

            <div id="filters-container">
              <div id="buttons-periods-container" class="buttons has-addons">
                <button
                  id="h11"
                  class="button is-success is-rounded"
                  :class="{ 'is-inverted': selectedPeriod !== '11h' }"
                  @click="radioSelectPeriod('11h')"
                >
                  11h
                </button>
                <button
                  id="h12"
                  class="button is-success is-rounded"
                  :class="{ 'is-inverted': selectedPeriod !== '12h' }"
                  @click="radioSelectPeriod('12h')"
                >
                  12h
                </button>
                <button
                  id="h14"
                  class="button is-success is-rounded"
                  :class="{ 'is-inverted': selectedPeriod !== '14h' }"
                  @click="radioSelectPeriod('14h')"
                >
                  14h
                </button>
                <button
                  id="h15"
                  class="button is-success is-rounded"
                  :class="{ 'is-inverted': selectedPeriod !== '15h' }"
                  @click="radioSelectPeriod('15h')"
                >
                  15h
                </button>
              </div>

              <button
                class="button is-success is-inverted is-rounded"
                @click="toggleMultiSelect"
              >
                <span class="icon">
                  <i class="fa fa-filter"></i>
                </span>
                <span>{{ buttonText }}</span>
              </button>
            </div>

            <VueMultiselect
              id="multiselect-domains"
              v-if="showMultiSelect"
              v-model="domainsSelected"
              :options="domains"
              :close-on-select="false"
              :multiple="true"
              track-by="domain"
              label="name"
              placeholder="Domaine"
            >
            </VueMultiselect>
          </div>
        </section>
      </div>
    </section>
    <section class="section pb-0" v-if="participantStars.length > 0">
      <details>
        <summary><span class="pl-4">Favoris ({{participantStars.length}})</span></summary>
        <masonry-wall :items="participantStars" :column-width="325" :padding="16">
          <template #default="{ item }">
            <ParticipantCard :key="item.name" :participant="item" :search="search" @star-clicked="starClicked"> </ParticipantCard>
          </template>
        </masonry-wall>
      </details>
    </section>
    <section v-if="list.length > 0" class="section flex-container">
      <masonry-wall :items="list" :column-width="325" :padding="16">
        <template #default="{ item }">
          <ParticipantCard :key="item.name" :participant="item" :search="search" @star-clicked="starClicked"> </ParticipantCard>
        </template>
      </masonry-wall>
    </section>
  </div>
</template>

<script>
import ParticipantCard from "@/components/ParticipantCard.vue";
import VueMultiselect from "vue-multiselect";
import MasonryWall from "@yeger/vue-masonry-wall";
import Participant from "@/models/participant";
import { saveFavorites, getFavorites } from "@/utils/localStorageUtils";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Main",
  components: {
    ParticipantCard,
    VueMultiselect,
    MasonryWall,
  },
  data() {
    return {
      participants: [],
      participantStars: [],
      list: [],
      search: "",
      searchIndex: null,
      domains: [],
      domainsSelected: [],
      showMultiSelect: false,
      buttonText: "Domaines",
      selectedPeriod: null,
    };
  },
  methods: {
    buildIndex() {
      var documents = this.participants;
      // eslint-disable-next-line no-undef
      this.searchIndex = lunr(function () {
        this.ref("name");
        this.field("name");
        this.field("title");
        this.field("description");
        this.field("formation");
        this.field("domain");

        documents.forEach((doc) => {
          this.add(doc);
        });
      });
    },
    toggleMultiSelect() {
      this.showMultiSelect = !this.showMultiSelect;
    },
    resetListWithSelectedDomains() {
      if (this.domainsSelected.length === 0) {
        this.list = [];
        this.list.push(...this.participantsFromSelectedPeriod());
      } else {
        this.list = [];
        const domainName = this.domainsSelected.map((d) => d.domain);
        this.participantsFromSelectedPeriod().forEach((participant) => {
          participant.domain.forEach((domain) => {
            if (domainName.indexOf(domain) !== -1) {
              this.list.push(participant);
            }
          });
        });
      }
    },
    radioSelectPeriod(periodValue) {
      if (this.selectedPeriod === periodValue) {
        this.selectedPeriod = null;
        this.list = this.participantFromDomainsFilter();
      } else {
        this.selectedPeriod = periodValue;
        this.list = this.participantFromDomainsFilter().filter(
          (participant) => {
            return participant.hourPeriod() === this.selectedPeriod;
          }
        );
      }
    },
    participantFromDomainsFilter() {
      if (this.domainsSelected.length === 0) {
        return this.participants;
      } else {
        const domainName = this.domainsSelected.map((d) => d.domain);
        const tmpParticipants = [];
        this.participants.filter((participant) => {
          participant.domain.forEach((domain) => {
            if (domainName.indexOf(domain) !== -1) {
              tmpParticipants.push(participant);
            }
          });
        });
        return tmpParticipants;
      }
    },
    participantsFromSelectedPeriod() {
      if (this.selectedPeriod) {
        return this.participants.filter((participant) => {
          return participant.period === this.selectedPeriod;
        });
      } else {
        return this.participants;
      }
    },
    starClicked() {
      this.participantStars = this.participants.filter(
        (participant) => participant.star === true
      );
      saveFavorites(this.participantStars);
    }
  },
  created() {
    this.participants = Participant.fromJson();

    this.list.push(...this.participants);
    const listOfDomaines = {};
    this.participants.forEach((participant) => {
      participant.domain.forEach((domain) => {
        if (listOfDomaines[domain]) {
          listOfDomaines[domain] += 1;
        } else {
          listOfDomaines[domain] = 1;
        }
      });
    });
    Object.entries(listOfDomaines).forEach((entry) => {
      const [domain, count] = entry;
      this.domains.push({
        name: domain + " (" + count + ")",
        domain: domain,
      });
    });
    this.buildIndex();
    this.participantStars = this.participants.filter(
        (participant) => {
          if (getFavorites().includes(participant.name)) {
            participant.star = true;
            return participant;
          }
        }
    );
  },
  mounted() {
    this.$watch("search", () => {
      this.resetListWithSelectedDomains();
      if (this.search === "") {
        return;
      }

      this.resuls = this.searchIndex.search(this.search + "* " + this.search);
      const originalList = this.list;
      this.list = [];
      this.resuls.forEach((d) => {
        originalList.forEach((p) => {
          if (d.ref === p.name) this.list.push(p);
        });
      });
    });
    this.$watch("domainsSelected", () => {
      this.resetListWithSelectedDomains();
      if (this.domainsSelected.length > 0) {
        this.buttonText = "Domaines (" + this.domainsSelected.length + ")";
      } else {
        this.buttonText = "Domaines";
      }
    });
  },
  computed: {
    buttonStyle(periodValue) {
      if (this.selectedPeriod === periodValue) {
        return "is-selected";
      } else {
        return "";
      }
    },
  },
};
</script>

<style>
#app {
  flex: 1;
}

#header-section {
  background-image: url("~@/assets/img/layered-waves-haikei.svg");
  background-size: cover;
}

#search-section {
  padding-bottom: 0;
  padding-top: 1.5em;
}

#search-section .field {
  max-width: 35em;
}

#filters-container {
  justify-content: space-around;
  display: flex;
  padding-top: 1.5em;
  padding-bottom: 1.5em;
  flex-direction: row;
  flex-wrap: wrap;
}

.buttons {
  flex-wrap: nowrap;
}

#h11 {
  color: white;
  background-color: #1976d2;
}

#h11.is-inverted {
  color: #1976d2;
  background-color: white;
}

#h12 {
  color: white;
  background-color: #ba2d65;
}

#h12.is-inverted {
  color: #ba2d65;
  background-color: white;
}

#h14 {
  color: white;
  background-color: #087f23;
}

#h14.is-inverted {
  color: #087f23;
  background-color: white;
}

#h15 {
  color: white;
  background-color: #ab47bc;
}

#h15.is-inverted {
  color: #ab47bc;
  background-color: white;
}

.media-content {
  overflow-x: visible;
}

details {
  padding: 0 1rem;
}
details + details {
  border-top: none;
}
details[open] {
  padding-bottom: 1em;
}
summary {
  padding: 1rem 2em 1rem 0;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
}

</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
