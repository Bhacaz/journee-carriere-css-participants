export default class Participant {
    constructor({ name, title, domain, formation, description, period }) {
        this.name = name;
        this.title = title;
        this.domain = domain.split("\n\n");
        this.formation = formation;
        this.description = description;
        this.period = period;
        this.star = false;
    }

    toggleStar() {
        this.star = !this.star;
        if (this.star && typeof umami !== "undefined") {
            // eslint-disable-next-line no-undef
            umami.trackEvent(this.name, "participant-starred");
        }
    }
}
