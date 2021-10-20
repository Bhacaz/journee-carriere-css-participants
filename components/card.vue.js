
const Card = {
    props: ['participant'],
    methods: {
        domainToTag(domain) {
            return {
                "Arts": "#f48fb1",
                "Science": "#b39ddb",
                "Social": "#80deea",
                "Santé": "#c5e1a5",
                "Construction": "#fff59d"
            }[domain]
        }
    },
    template: `
    <div class="card card-width">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">{{ participant.title }}</p>
            <p class="subtitle is-5">{{ participant.name }}</p>
            <p class="subtitle is-6">{{ participant.formation }}</p>
          </div>
        </div>

        <div class="content">
          <p>{{ participant.description }}</p>
          <p>
            <span class="tag" :style="{ backgroundColor: domainToTag(participant.domain) }">{{ participant.domain }}</span>
          </p>
           <p>
            <span class="tag is-info">{{ participant.period }}</span>
          </p>
        </div>
      </div>
    </div>
    `
}
