import participants from "./participants.json";

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
    }

    static fromJson() {
        return participants.map((participant) => new Participant(participant));
    }
}
