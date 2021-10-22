<template>
  <div id="app">
    <section id="header-section" class="hero is-primary">
      <div class="hero-body">
        <p class="title">Journée Carrière - Collège Saint-Sacrement</p>
        <p class="subtitle">Novembre 2021</p>

        <section class="section" id="search-section">
          <div class="field container">
            <div class="columns">
              <div class="column is-three-quarters">
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
              </div>
              <div class="column">
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
            </div>
          </div>

          <VueMultiselect
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
        </section>
      </div>
    </section>
    <section class="section flex-container">
      <Card
        v-for="participant in list"
        :key="participant.name"
        :participant="participant"
      >
      </Card>
    </section>
  </div>
</template>

<script>
import csvJSON from "@/scripts/csvJSON.js";
import Card from "@/components/Card.vue";
import VueMultiselect from "vue-multiselect";

export default {
  components: {
    Card,
    VueMultiselect,
  },
  data() {
    return {
      participants: [],
      list: [],
      search: "",
      searchIndex: null,
      domains: [],
      domainsSelected: null,
      selectedDomains: [],
      showMultiSelect: false,
      buttonText: "Domaines",
    };
  },
  methods: {
    buildIndex() {
      var documents = this.participants;
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
  },
  created() {
    fetch("./data/participants.csv")
      .then((res) => res.text())
      .then((data) => {
        this.participants.push(...csvJSON(data));
        this.list.push(...this.participants);
        const listOfDomaines = {};
        this.participants.forEach((participant) => {
          if (listOfDomaines[participant.domain]) {
            listOfDomaines[participant.domain] += 1;
          } else {
            listOfDomaines[participant.domain] = 1;
          }
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
      this.resuls = this.searchIndex.search(this.search + "* " + this.search);
      this.list = [];
      this.resuls.forEach((d) => {
        this.participants.forEach((p) => {
          if (d.ref === p.name) this.list.push(p);
        });
      });
    });

    this.$watch("domainsSelected", () => {
      if (this.domainsSelected.length === 0) {
        this.list = [];
        this.list.push(...this.participants);
      } else {
        this.list = [];
        const domainName = this.domainsSelected.map((d) => d.domain);
        this.participants.forEach((participant) => {
          if (domainName.indexOf(participant.domain) !== -1) {
            this.list.push(participant);
          }
        });
      }
      if (this.domainsSelected.length > 0) {
        this.buttonText = "Domaines (" + this.domainsSelected.length + ")";
      } else {
        this.buttonText = "Domaines";
      }
    });
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
  max-width: 24em;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
