
const Card = {
    props: ['participant'],
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
          <p>{{ participant.description }}...</p>
          <span class="tag is-info">{{ participant.period }}</span>
        </div>
      </div>
    </div>
    `
}
