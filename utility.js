//Utility functions
const capitalizedStr = (str) => str.charAt(0).toUpperCase() + str.slice(1);

function getPokemonIDFromURL(url) {
    return url.split("/")[6]
}

function convertStatsToPercentage(stats) {
    stats.forEach((statLabel) => {
        let statNameArray = statLabel.stat.name.split('-')

        if (statNameArray[1]) {
            const newString = capitalizedStr(statNameArray[1])
            statNameArray[1] = newString
            statNameArray = statNameArray.join("")
        }

        statsObject[statNameArray] = { top: 0, bottom: 0 }
        statsObject[statNameArray].top = Math.round((255 - statLabel.base_stat) / 255 * 100)
        statsObject[statNameArray].bottom = Math.round(statLabel.base_stat / 255 * 100)
    })
}
