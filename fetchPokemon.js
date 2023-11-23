const pokemonLimit = 20;
const speciesID = 0
const pokemonDetails = 1

const pokemonsEvolutionUrl = `https://pokeapi.co/api/v2/evolution-chain/?limit=${pokemonLimit}&offset=0`

async function getPokemons() {

    const pokemonsEvolutionResponse = await fetch(pokemonsEvolutionUrl)
    const pokemonsEvolutionArray = await pokemonsEvolutionResponse.json()

    await storePokemon(pokemonsEvolutionArray)

    displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
    displayPokemon(pokemonsEvoArray[curIndex].second[speciesID], pokemonsEvoArray[curIndex].second[pokemonDetails])
    displayPokemon(pokemonsEvoArray[curIndex].third[speciesID], pokemonsEvoArray[curIndex].third[pokemonDetails])

}

getPokemons();

//Store the Pokemons
const pokemonsEvoArray = []

async function storePokemon(pokemonsEvolutionArray) {
    for (let i = 0; i < pokemonLimit; i++) {
        const pokemonsEvolutionResp = await fetch(pokemonsEvolutionArray.results[i].url)
        const pokemonEvolution = await pokemonsEvolutionResp.json()

        const objectTemp = {}
        objectTemp["first"] = []

        const pokemonFirstSpeciesObject = {}

        const pokemonFirstSpeciesResp = await fetch(pokemonEvolution.chain.species.url)
        const pokemonFirstSpecies = await pokemonFirstSpeciesResp.json()

        pokemonFirstSpeciesObject.bio = replaceEmDashSymbols(pokemonFirstSpecies.flavor_text_entries[6].flavor_text)
        pokemonFirstSpeciesObject.genus = pokemonFirstSpecies.genera[7].genus
        pokemonFirstSpeciesObject.base_happiness = pokemonFirstSpecies.base_happiness
        pokemonFirstSpeciesObject.capture_rate = pokemonFirstSpecies.capture_rate
        pokemonFirstSpeciesObject.growth_rate = pokemonFirstSpecies.growth_rate.name

        pokemonFirstSpeciesObject.base_evolution = {
            id: getPokemonIDFromURL(pokemonEvolution.chain.species.url),
            name: pokemonFirstSpecies.name
        }

        const pokemonResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolution.chain.species.name}`)
        const pokemon = await pokemonResp.json()

        objectTemp["first"].push(pokemonFirstSpeciesObject)
        objectTemp["first"].push(pokemon)

        if (pokemonEvolution.chain["evolves_to"][0]) {
            //objectTemp["second"] = pokemonEvolution.chain["evolves_to"][0].species.url
            const pokemonSecondName = pokemonEvolution.chain["evolves_to"][0].species.name
            objectTemp["second"] = []

            const pokemonSecondSpeciesObject = {}

            const pokemonSecondSpeciesResp = await fetch(pokemonEvolution.chain["evolves_to"][0].species.url)
            const pokemonSecondSpecies = await pokemonSecondSpeciesResp.json()

            pokemonSecondSpeciesObject.bio = replaceEmDashSymbols(pokemonSecondSpecies.flavor_text_entries[6].flavor_text)
            pokemonSecondSpeciesObject.genus = pokemonSecondSpecies.genera[7].genus
            pokemonSecondSpeciesObject.base_happiness = pokemonSecondSpecies.base_happiness
            pokemonSecondSpeciesObject.capture_rate = pokemonSecondSpecies.capture_rate
            pokemonSecondSpeciesObject.growth_rate = pokemonSecondSpecies.growth_rate.name

            pokemonSecondSpeciesObject.base_evolution = {
                id: getPokemonIDFromURL(pokemonEvolution.chain.species.url),
                name: pokemonFirstSpecies.name
            }
            pokemonFirstSpeciesObject.first_evolution = {
                id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].species.url),
                name: pokemonSecondSpecies.name
            }

            const pokemonSecondResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonSecondName}`)
            const pokemonSecond = await pokemonSecondResp.json()

            objectTemp["second"].push(pokemonSecondSpeciesObject)
            objectTemp["second"].push(pokemonSecond)
            if (pokemonEvolution.chain["evolves_to"][0].evolves_to[0]) {
                //objectTemp["third"] = pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url
                const pokemonThirdName = pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.name
                objectTemp["third"] = []

                const pokemonThirdSpeciesObject = {}

                const pokemonThirdSpeciesResp = await fetch(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url)
                const pokemonThirdSpecies = await pokemonThirdSpeciesResp.json()

                pokemonThirdSpeciesObject.bio = replaceEmDashSymbols(pokemonThirdSpecies.flavor_text_entries[6].flavor_text)
                pokemonThirdSpeciesObject.genus = pokemonThirdSpecies.genera[7].genus
                pokemonThirdSpeciesObject.base_happiness = pokemonThirdSpecies.base_happiness
                pokemonThirdSpeciesObject.capture_rate = pokemonThirdSpecies.capture_rate
                pokemonThirdSpeciesObject.growth_rate = pokemonThirdSpecies.growth_rate.name
                console.log(pokemonThirdSpecies)

                pokemonFirstSpeciesObject.second_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url),
                    name: pokemonThirdSpecies.name
                }
                pokemonSecondSpeciesObject.first_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].species.url),
                    name: pokemonSecondSpecies.name
                }
                pokemonSecondSpeciesObject.second_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url),
                    name: pokemonThirdSpecies.name
                }
                pokemonThirdSpeciesObject.base_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain.species.url),
                    name: pokemonFirstSpecies.name
                }
                pokemonThirdSpeciesObject.first_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].species.url),
                    name: pokemonSecondSpecies.name
                }
                pokemonThirdSpeciesObject.second_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url),
                    name: pokemonThirdSpecies.name
                }

                const pokemonThirdResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonThirdName}`)
                const pokemonThird = await pokemonThirdResp.json()

                objectTemp["third"].push(pokemonThirdSpeciesObject)
                objectTemp["third"].push(pokemonThird)
            }
        }



        pokemonsEvoArray.push(objectTemp)

        //console.log(pokemonsEvoArray)
        // // console.log(pokemonInfo)
        // // console.log(pokemonSpecies)
        // // console.log(pokemonEvolution)

        // pokemonsTemp.push(pokemonInfo)
    }
    //console.log(pokemonsTemp)
    //})
}

async function fetchDetails() {

}

//Display pokemon
let curIndex = 0;
const listContainer = document.querySelector('#pokemonList')

const displayPokemon = (speciesInfo, pokemonInfo) => {

    const flipBox = document.createElement('div')
    const flipBoxInner = document.createElement('div')
    const flipBoxFront = document.createElement('div')
    const flipBoxBack = document.createElement('div')
    const li = document.createElement('li')

    flipBox.className = "flip-box"
    flipBoxInner.className = "flip-box-inner"
    flipBoxBack.className = "flip-box-back"
    flipBoxFront.className = "flip-box-front"

    flipBox.append(flipBoxInner)
    flipBoxInner.append(flipBoxFront, flipBoxBack)

    li.append(flipBox)
    listContainer.append(li)

    displayFront(speciesInfo, pokemonInfo, flipBoxFront)
    displayBack(speciesInfo, pokemonInfo, flipBoxBack)

}

function displayFront(speciesInfo, pokemonInfo, flipBoxFront) {

    const pokemonImgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonInfo.id}.png`
    const pokemonName = capitalizedStr(pokemonInfo.name)
    const pokemonNumber = pokemonInfo.id.toString().padStart(4, '0')

    flipBoxFront.innerHTML =
        `<div class="pokemonId">${pokemonNumber}</div>
        <img class="pokemonImgStyle" src="${pokemonImgSrc}" alt="${pokemonName}">
        <div class="pokemonName">${pokemonName}</div>
        <input type="button" class="learnMoreButton" value="Learn More">`
}

function displayBack(speciesInfo, pokemonInfo, flipBoxBack) {

    const div_container_grid_1 = document.createElement('div')
    const pokemonId = pokemonInfo.id.toString().padStart(4, '0')
    const pokemonImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonInfo.id}.png`
    const pokemonName = capitalizedStr(pokemonInfo.name)

    div_container_grid_1.innerHTML =
        `<div class="container-grid-1">
        <div class="item-grid-1 backPokemonNameFontStyle">${pokemonName}</div>
        <div class="item-grid-1 backPokemonIdFontStyle">${pokemonId}</div>
        <div class="item-grid-1"><img class="pokemonImgStyle" src="${pokemonImg}" alt="${pokemonName}"></div>
        </div>`

    const div_container_grid_2 = document.createElement('div')
    const typeColorObject = {
        normal: '#A8A878',
        fire: '#F08030',
        fighting: '#C03028',
        water: '#6890F0',
        grass: '#78C850',
        electric: '#F8D030',
        ice: '#98D8D8',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dark: '#705848',
        dragon: '#7038F8',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    }

    let typeHTML, abilityHTML = ``

    pokemonInfo.types.forEach((typesLabel) => {
        const span_types = document.createElement('span')
        span_types.style.background = typeColorObject[typesLabel.type.name]
        span_types.classList.add('pillShape')
        span_types.innerText = capitalizedStr(typesLabel.type.name)
        !typeHTML ? (typeHTML = `${span_types.outerHTML}`)
            : (typeHTML += ` ${span_types.outerHTML}`)
    })

    pokemonInfo.abilities.forEach((abilityLabel) => {
        const abilityName = capitalizedStr(abilityLabel.ability.name)
        !abilityHTML ?
            (abilityHTML = `<div class="item-grid-2-col-3-5">${abilityName},</div>`)
            : (abilityHTML = abilityHTML + `<div class="item-grid-2-col-3-5">${abilityName}</div>`)
    })

    div_container_grid_2.innerHTML =
        `<div class="container-grid-2">
            <div class="item-grid-2-col-1-5">
                ${typeHTML}
            </div>
            <div class="item-grid-2-col-1-5 backSubHeaderFontStyle">About</div>
            <hr class="item-grid-2-col-1-5 horizontal">
            <div class="item-grid-2-col-2-3 backListFontStyle">Species</div>
            <div class="item-grid-2-col-3-5">${speciesInfo.genus}</div>
            <div class="item-grid-2-col-2-3 backListFontStyle">Weight</div>
            <div class="item-grid-2-col-3-5">${pokemonInfo.weight}kg</div>
            <div class="item-grid-2-col-2-3 backListFontStyle">Abilities</div>
            ${abilityHTML}

            <div class="item-grid-2-col-1-5 backSubHeaderFontStyle">Base Stats</div>
            <hr class="item-grid-2-col-1-5 horizontal">
        </div>`

    const div_container_grid_3 = document.createElement('div')
    const statsObject = {}

    pokemonInfo.stats.forEach((statLabel) => {
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

    div_container_grid_3.innerHTML =
        `<div>   
        <div class="chart">
            <div class="bar" style="--bar-ratio: 100%;">
                <div class="section" style="--section-value: ${statsObject.hp.top};" data-value="20"></div>
                <div class="section hpColor" style="--section-value: ${statsObject.hp.bottom};" data-value="50"></div>
                <div class="label">HP</div>
            </div>
            <div class="bar">
                <div class="section" style="--section-value: ${statsObject.attack.top};" data-value="20"></div>
                <div class="section attkColor" style="--section-value: ${statsObject.attack.bottom};" data-value="50"></div>
                <div class="label">Att</div>
            </div>
            <div class="bar">
                <div class="section" style="--section-value: ${statsObject.defense.top};" data-value="20"></div>
                <div class="section defColor" style="--section-value: ${statsObject.defense.bottom};" data-value="50"></div>
                <div class="label">Def</div>
            </div>
            <div class="bar">
                <div class="section" style="--section-value: ${statsObject.specialAttack.top};" data-value="20"></div>
                <div class="section spAttkColor" style="--section-value: ${statsObject.specialAttack.bottom};" data-value="50"></div>
                <div class="label">S.Att</div>
            </div>
            <div class="bar">
                <div class="section" style="--section-value: ${statsObject.specialDefense.top};" data-value="20"></div>
                <div class="section spDefColor" style="--section-value: ${statsObject.specialDefense.bottom};" data-value="50"></div>
                <div class="label">S.Def</div>
            </div>
            <div class="bar">
                <div class="section" style="--section-value: ${statsObject.speed.top};" data-value="20"></div>
                <div class="section speedColor" style="--section-value: ${statsObject.speed.bottom};" data-value="50"></div>
                <div class="label">Spd</div>
            </div>
        </div>
        </div>`

    flipBoxBack.appendChild(div_container_grid_1)
    flipBoxBack.appendChild(div_container_grid_2)
    flipBoxBack.appendChild(div_container_grid_3)
    // pokemonInfo.types.forEach((typeLabel) => {
    //     console.log(`typeLabel.type.name: ${typeLabel.type.name}`)
    // })
}
//Buttons to interact
let nextIndex = 0;

function interactiveButtons() {
    document.addEventListener('keyup', event => {
        if (event.code === 'KeyF') {
            console.log('Space pressed')
            const cards = document.querySelectorAll('.flip-box-inner')
            cards.forEach(card => {
                console.log(card)
                card.classList.toggle("is-flipped")
            });
        }
    })

    const nextButton = document.querySelector('#nextButton')
    const prevButton = document.querySelector('#prevButton')
    nextButton.addEventListener('click', () => {
        listContainer.innerHTML = ""
        curIndex++

        displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
        displayPokemon(pokemonsEvoArray[curIndex].second[speciesID], pokemonsEvoArray[curIndex].second[pokemonDetails])
        displayPokemon(pokemonsEvoArray[curIndex].third[speciesID], pokemonsEvoArray[curIndex].third[pokemonDetails])
    })

    prevButton.addEventListener('click', () => {
        listContainer.innerHTML = ""
        curIndex--

        displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
        displayPokemon(pokemonsEvoArray[curIndex].second[speciesID], pokemonsEvoArray[curIndex].second[pokemonDetails])
        displayPokemon(pokemonsEvoArray[curIndex].third[speciesID], pokemonsEvoArray[curIndex].third[pokemonDetails])
    })

    const formSearchPokemon = document.querySelector('#formSearchPokemon')
    formSearchPokemon.addEventListener('keyup', (event) => {

        event.preventDefault()

        const recommendedPokemons = []
        pokemonsEvoArray.forEach((pokemon) => {
            for (const key in pokemon) {
                if (pokemon[key][1].name.toLowerCase().includes(searchPokemonName.value.toLowerCase())) {
                    console.log(pokemon[key])
                    recommendedPokemons.push(pokemon[key])
                }
            }
        })

        const result = recommendedPokemons.find((pokemon) => pokemon[1].name === searchPokemonName.value.toLowerCase());

        console.log("result", result)
        const recList = document.querySelector("#recomendationList")
        recList.innerHTML = ""

        if (result) {
            displaySearchedPokemon(result)
        } else {
            console.log("recommendedPokemons", recommendedPokemons)
            recommendedPokemons.forEach((pokemon) => {
                const li = document.createElement("li")
                li.innerText = pokemon[1].name

                li.addEventListener('click', (event) => {
                    recList.innerHTML = ""
                    displaySearchedPokemon(pokemon)
                })

                recList.append(li)
            })
        }

        //formSearchPokemon.reset()
    })
}

function buttonEvoImages() {

    const roundedImage = document.querySelectorAll('.roundedImage')

    roundedImage.forEach(pokemonImage => {
        pokemonImage.addEventListener('click', (event) => {
            // pokemonsEvoArray.forEach((pokemon) => {
            //     for (const key in pokemon) {
            //         if (pokemon[key][1].name === event.target.alt) {
            //            displaySearchedPokemon(pokemon[key])
            //         }
            //     }
            // })
            let pokemonFound;

            pokemonsEvoArray.find(pokemonEvo => {
                for (const pokemon in pokemonEvo) {
                    if (pokemonEvo[pokemon][1].name === event.target.alt) {
                        pokemonFound = pokemonEvo[pokemon]
                        return
                    }
                }
            })

            displaySearchedPokemon(pokemonFound)
        })
    })


}

interactiveButtons()


//Filter
async function displaySearchedPokemon(pokemon) {

    const searchedPokemonContainer = document.querySelector(".searchedPokemonContainer")

    let abilityHTML = ``

    pokemon[1].abilities.forEach((abilityLabel) => {
        const abilityName = capitalizedStr(abilityLabel.ability.name)
        !abilityHTML ?
            (abilityHTML = `<div class="item-grid-2-col-3-5">${abilityName},</div>`)
            : (abilityHTML = abilityHTML + `<div class="item-grid-2-col-3-5">${abilityName}</div>`)
    })


    const pokemonImgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon[1].id}.png`
    const pokemonImgBase = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon[0].base_evolution.id}.png`
    const pokemonImgSecond = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon[0].first_evolution.id}.png`
    const pokemonImgThird = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon[0].second_evolution.id}.png`

    const statsObject = {}

    pokemon[1].stats.forEach((statLabel) => {
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

    const pokemonBaseName = pokemon[0].base_evolution.name
    const pokemonFirstEvoName = pokemon[0].first_evolution.name
    const pokemonSecondEvoName = pokemon[0].second_evolution.name

    // Height needs to convert from meter to cm?
    searchedPokemonContainer.innerHTML =
        `<div class="pokemonColumns greenColor">
            <div class="container-grid-2">
                <img class="searchedPokemonImg item-grid-2-col-1-5" src="${pokemonImgSrc}" alt="${pokemon[1].name}">
            </div>
        </div>

        <div class="pokemonColumns">
            <div class="container-grid-2">
                <h2 class="item-grid-2-col-1-5">Bio</h2>
                <p class="item-grid-2-col-1-5">${pokemon[0].bio}</p>
            
                <div class="item-grid-2-col-1-2">Genus:</div>
                <div class="item-grid-2-col-2-4">${pokemon[0].genus}</div>
                <div class="item-grid-2-col-1-2">Height:</div>
                <div class="item-grid-2-col-2-4">${pokemon[1].height}</div>
                <div class="item-grid-2-col-1-2">Weight:</div>
                <div class="item-grid-2-col-2-4">${pokemon[1].weight}kg</div>
                <div class="item-grid-2-col-1-2">Abilities:</div>
                <div class="item-grid-2-col-2-4">${abilityHTML}</div>
                
                <h2 class="item-grid-2-col-1-5">Training</h2>
                <div class="item-grid-2-col-1-2">Base Exp:</div>
                <div class="item-grid-2-col-2-4">${pokemon[1].base_experience}</div>
                <div class="item-grid-2-col-1-2">Base Happiness:</div>
                <div class="item-grid-2-col-2-4">${pokemon[0].base_happiness}</div>
                <div class="item-grid-2-col-1-2">Catch Rate:</div>
                <div class="item-grid-2-col-2-4">${pokemon[0].capture_rate}</div>
                <div class="item-grid-2-col-1-2">Growth Rate:</div>
                <div class="item-grid-2-col-2-4">${pokemon[0].growth_rate}</div>
            </div>
        </div>
        <div class="pokemonColumns">
            <h2>Evolution</h2>
            <div class="container-grid-2">
                <button class="item-grid-2-col-1-2"><img class="roundedImage" src="${pokemonImgBase}" alt="${pokemonBaseName}"></button>
                <button class="item-grid-2-col-2-3"><img class="roundedImage" src="${pokemonImgSecond}" alt="${pokemonFirstEvoName}"></button>
                <button class="item-grid-2-col-3-4"><img class="roundedImage" src="${pokemonImgThird}" alt="${pokemonSecondEvoName}"></button>
            </div>
            <h2>Stats</h2>
            <div class="chart">
                <div class="bar" style="--bar-ratio: 100%;">
                    <div class="section" style="--section-value: ${statsObject.hp.top};" data-value="20"></div>
                    <div class="section hpColor" style="--section-value: ${statsObject.hp.bottom};" data-value="50"></div>
                    <div class="label">HP</div>
                </div>
                <div class="bar">
                    <div class="section" style="--section-value: ${statsObject.attack.top};" data-value="20"></div>
                    <div class="section attkColor" style="--section-value: ${statsObject.attack.bottom};" data-value="50"></div>
                    <div class="label">Att</div>
                </div>
                <div class="bar">
                    <div class="section" style="--section-value: ${statsObject.defense.top};" data-value="20"></div>
                    <div class="section defColor" style="--section-value: ${statsObject.defense.bottom};" data-value="50"></div>
                    <div class="label">Def</div>
                </div>
                <div class="bar">
                    <div class="section" style="--section-value: ${statsObject.specialAttack.top};" data-value="20"></div>
                    <div class="section spAttkColor" style="--section-value: ${statsObject.specialAttack.bottom};" data-value="50"></div>
                    <div class="label">S.Att</div>
                </div>
                <div class="bar">
                    <div class="section" style="--section-value: ${statsObject.specialDefense.top};" data-value="20"></div>
                    <div class="section spDefColor" style="--section-value: ${statsObject.specialDefense.bottom};" data-value="50"></div>
                    <div class="label">S.Def</div>
                </div>
                <div class="bar">
                    <div class="section" style="--section-value: ${statsObject.speed.top};" data-value="20"></div>
                    <div class="section speedColor" style="--section-value: ${statsObject.speed.bottom};" data-value="50"></div>
                    <div class="label">Spd</div>
                </div>
            </div>
        </div>`

    buttonEvoImages()
}


//Utility functions

function getPokemonIDFromURL(url) {
    return url.split("/")[6]
}

function replaceEmDashSymbols(text) {
    return text.replace(/\u2013|\u2014/g, "-");
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

