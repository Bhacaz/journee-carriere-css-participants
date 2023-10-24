export function saveFavorites(participants) {
        const favoritesNames = participants.map((participant) => participant.name);
        localStorage.setItem('favorites', JSON.stringify(favoritesNames));
}

export function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
        return favorites
    }
    else {
        return []

        }
}
