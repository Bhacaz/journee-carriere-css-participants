import participants from "./participants.json";

export default class Participant {
    constructor({ name, title, domain, formation, description, period, link_reperes, holland_codes }) {
        this.name = name;
        this.title = title;
        this.domain = domain.split("; ");
        this.formation = formation;
        this.description = description;
        this.period = period;
        this.star = false;
        this.link_reperes = link_reperes;
        this.holland_codes = holland_codes;
    }

    toggleStar() {
        this.star = !this.star;
        if (this.star && typeof umami !== "undefined") {
            // eslint-disable-next-line no-undef
            umami.trackEvent(this.name, "participant-starred");
        }
    }

    hourPeriod() {
        return this.period.split('00')[0]
    }

    static fromJson() {
        return participants.map((participant) => new Participant(participant));
    }
}
