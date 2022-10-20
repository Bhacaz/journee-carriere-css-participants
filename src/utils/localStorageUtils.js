export function saveFavorites(participants) {
        const favoritesNames = participants.map((participant) => participant.name);
        localStorage.setItem('favorites', JSON.stringify(favoritesNames));
}

export function getFavorites() {
    return localStorage.getItem('favorites');
}
