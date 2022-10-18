<template>
  <div id="app">
    <section id="header-section" class="hero is-primary">
      <div class="hero-body">
        <p class="title">Journée Carrière - Collège Saint-Sacrement</p>
        <p class="subtitle">
          Aide aux choix : Description des professionnel(le)s participants à la
          journée carrière. <br />16 novembre 2021
        </p>

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
                  id="p2"
                  class="button is-success is-rounded"
                  :class="{ 'is-inverted': selectedPeriod !== 'P2' }"
                  @click="radioSelectPeriod('P2')"
                >
                  P2
                </button>
                <button
                  id="p3"
                  class="button is-success is-rounded"
                  :class="{ 'is-inverted': selectedPeriod !== 'P3' }"
                  @click="radioSelectPeriod('P3')"
                >
                  P3
                </button>
                <button
                  id="p5"
                  class="button is-success is-rounded"
                  :class="{ 'is-inverted': selectedPeriod !== 'P5' }"
                  @click="radioSelectPeriod('P5')"
                >
                  P5
                </button>
                <button
                  id="p6"
                  class="button is-success is-rounded"
                  :class="{ 'is-inverted': selectedPeriod !== 'P6' }"
                  @click="radioSelectPeriod('P6')"
                >
                  P6
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
    <section v-if="list.length > 0" class="section flex-container">
      <masonry-wall :items="list" :column-width="325" :padding="16">
        <template #default="{ item }">
          <ParticipantCard :key="item.name" :participant="item" :search="search"> </ParticipantCard>
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
            return participant.period === this.selectedPeriod;
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
  },
  created() {
    fetch("./data/participants.json")
      .then((res) => res.json())
      .then((data) => {
        this.participants = data.map((d) => {
          return new Participant(d);
        });
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
      })
      .catch((err) => console.log(err));
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

#p2 {
  color: white;
  background-color: #1976d2;
}

#p2.is-inverted {
  color: #1976d2;
  background-color: white;
}

#p3 {
  color: white;
  background-color: #ba2d65;
}

#p3.is-inverted {
  color: #ba2d65;
  background-color: white;
}

#p5 {
  color: white;
  background-color: #087f23;
}

#p5.is-inverted {
  color: #087f23;
  background-color: white;
}

#p6 {
  color: white;
  background-color: #ab47bc;
}

#p6.is-inverted {
  color: #ab47bc;
  background-color: white;
}

.media-content {
  overflow-x: visible;
}

</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
