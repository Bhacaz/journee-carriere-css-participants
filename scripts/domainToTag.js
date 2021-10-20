function domainToTag(domain) {
    const tagMapping = {
        "Arts": "#f44336",
        "Science": "#9c27b0",
        "Social": "#00bcd4",
        "Santé": "#4caf50",
        "Construction": "#ffeb3b"
    }
    console.log(domain)
    return tagMapping[domain];
}