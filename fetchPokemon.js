const pokemonLimit = 50;
const speciesID = 0
const pokemonDetails = 1

const pokemonsEvolutionUrl = `https://pokeapi.co/api/v2/evolution-chain/?limit=${pokemonLimit}&offset=0`

async function getPokemons() {

    const pokemonsEvolutionResponse = await fetch(pokemonsEvolutionUrl)
    const pokemonsEvolutionArray = await pokemonsEvolutionResponse.json()

    await storePokemon(pokemonsEvolutionArray)

    displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
    if (pokemonsEvoArray[curIndex].hasOwnProperty("second")) {
        displayPokemon(pokemonsEvoArray[curIndex].second[speciesID], pokemonsEvoArray[curIndex].second[pokemonDetails])
        if (pokemonsEvoArray[curIndex].hasOwnProperty("third")) {
            displayPokemon(pokemonsEvoArray[curIndex].third[speciesID], pokemonsEvoArray[curIndex].third[pokemonDetails])
        }
    }
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

        const bioFirstInfo = pokemonFirstSpecies.flavor_text_entries.find(element => element.language.name === "en")
        pokemonFirstSpeciesObject.bio = bioFirstInfo.flavor_text

        const genusFirstInfo = pokemonFirstSpecies.genera.find(element => element.language.name === "en")
        pokemonFirstSpeciesObject.genus = genusFirstInfo.genus

        pokemonFirstSpeciesObject.base_happiness = pokemonFirstSpecies.base_happiness
        pokemonFirstSpeciesObject.capture_rate = pokemonFirstSpecies.capture_rate
        pokemonFirstSpeciesObject.growth_rate = pokemonFirstSpecies.growth_rate.name

        pokemonFirstSpeciesObject.base_evolution = {
            id: getPokemonIDFromURL(pokemonEvolution.chain.species.url),
            name: pokemonFirstSpecies.name,
            colorName: pokemonFirstSpecies.color.name
        }

        const pokemonResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonEvolution.chain.species.name}`)
        const pokemon = await pokemonResp.json()

        pokemon.colorName = pokemonFirstSpecies.color.name

        objectTemp["first"].push(pokemonFirstSpeciesObject)
        objectTemp["first"].push(pokemon)

        if (pokemonEvolution.chain["evolves_to"][0]) {
            const pokemonSecondName = pokemonEvolution.chain["evolves_to"][0].species.name
            objectTemp["second"] = []

            const pokemonSecondSpeciesObject = {}

            const pokemonSecondSpeciesResp = await fetch(pokemonEvolution.chain["evolves_to"][0].species.url)
            const pokemonSecondSpecies = await pokemonSecondSpeciesResp.json()

            const bioSecondInfo = pokemonSecondSpecies.flavor_text_entries.find(element => element.language.name === "en")
            pokemonSecondSpeciesObject.bio = bioSecondInfo.flavor_text

            const genusSecondInfo = pokemonSecondSpecies.genera.find(element => element.language.name === "en")
            pokemonSecondSpeciesObject.genus = genusSecondInfo.genus


            pokemonSecondSpeciesObject.base_happiness = pokemonSecondSpecies.base_happiness
            pokemonSecondSpeciesObject.capture_rate = pokemonSecondSpecies.capture_rate
            pokemonSecondSpeciesObject.growth_rate = pokemonSecondSpecies.growth_rate.name

            pokemonSecondSpeciesObject.base_evolution = {
                id: getPokemonIDFromURL(pokemonEvolution.chain.species.url),
                name: pokemonFirstSpecies.name,
                colorName: pokemonFirstSpecies.color.name
            }
            pokemonSecondSpeciesObject.first_evolution = {
                id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].species.url),
                name: pokemonSecondSpecies.name,
                colorName: pokemonSecondSpecies.color.name
            }
            pokemonFirstSpeciesObject.first_evolution = {
                id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].species.url),
                name: pokemonSecondSpecies.name,
                colorName: pokemonSecondSpecies.color.name
            }

            const pokemonSecondResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonSecondName}`)
            const pokemonSecond = await pokemonSecondResp.json()

            pokemonSecond.colorName = pokemonSecondSpecies.color.name

            objectTemp["second"].push(pokemonSecondSpeciesObject)
            objectTemp["second"].push(pokemonSecond)
            if (pokemonEvolution.chain["evolves_to"][0].evolves_to[0]) {
                const pokemonThirdName = pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.name
                objectTemp["third"] = []

                const pokemonThirdSpeciesObject = {}

                const pokemonThirdSpeciesResp = await fetch(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url)
                const pokemonThirdSpecies = await pokemonThirdSpeciesResp.json()

                const bioInfo = pokemonThirdSpecies.flavor_text_entries.find(element => element.language.name === "en")
                pokemonThirdSpeciesObject.bio = bioInfo.flavor_text

                const genusInfo = pokemonThirdSpecies.genera.find(element => element.language.name === "en")
                pokemonThirdSpeciesObject.genus = genusInfo.genus

                pokemonThirdSpeciesObject.base_happiness = pokemonThirdSpecies.base_happiness
                pokemonThirdSpeciesObject.capture_rate = pokemonThirdSpecies.capture_rate
                pokemonThirdSpeciesObject.growth_rate = pokemonThirdSpecies.growth_rate.name

                pokemonFirstSpeciesObject.second_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url),
                    name: pokemonThirdSpecies.name,
                    colorName: pokemonThirdSpecies.color.name
                }
                pokemonSecondSpeciesObject.second_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url),
                    name: pokemonThirdSpecies.name,
                    colorName: pokemonThirdSpecies.color.name
                }
                pokemonThirdSpeciesObject.base_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain.species.url),
                    name: pokemonFirstSpecies.name,
                    colorName: pokemonFirstSpecies.color.name
                }
                pokemonThirdSpeciesObject.first_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].species.url),
                    name: pokemonSecondSpecies.name,
                    colorName: pokemonSecondSpecies.color.name
                }
                pokemonThirdSpeciesObject.second_evolution =
                {
                    id: getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url),
                    name: pokemonThirdSpecies.name,
                    colorName: pokemonThirdSpecies.color.name
                }

                const pokemonThirdResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonThirdName}`)
                const pokemonThird = await pokemonThirdResp.json()

                pokemonThird.colorName = pokemonThirdSpecies.color.name

                objectTemp["third"].push(pokemonThirdSpeciesObject)
                objectTemp["third"].push(pokemonThird)
            }
        }
        pokemonsEvoArray.push(objectTemp)
    }
}

//Display pokemon
let curIndex = 0;
const listContainer = document.querySelector('#pokemonList')

function displayPokemon(speciesInfo, pokemonInfo) {

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

    displayFront(pokemonInfo, flipBoxFront)
    displayBack(speciesInfo, pokemonInfo, flipBoxBack)

}

function displayFront(pokemonInfo, flipBoxFront) {

    const pokemonImgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonInfo.id}.png`
    const pokemonName = capitalizedStr(pokemonInfo.name)
    const pokemonNumber = pokemonInfo.id.toString().padStart(4, '0')

    flipBoxFront.innerHTML =
        `<div class="pokemonId">${pokemonNumber}</div>
        <img class="pokemonImgStyle" src="${pokemonImgSrc}" alt="${pokemonName}">
        <div class="pokemonName">${pokemonName}</div>
        <p class="learnMoreButton">Press the F key to learn more</p>`
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
}

//Buttons for interaction
let nextIndex = 0;

function interactiveButtons() {
    //Flip cards
    document.addEventListener('keydown', event => {
        if (event.code === 'KeyF') {
            const cards = document.querySelectorAll('.flip-box-inner')
            cards.forEach(card => {
                card.classList.toggle("is-flipped")
            });
        }
    })

    //Previous and Next button for Pokemon and Group
    const nextButtonShowOnlyOne = document.querySelector('#nextButtonShowOnlyOne')

    nextButtonShowOnlyOne.addEventListener('click', () => {
        const numberOfCards = document.querySelectorAll("#pokemonList >  li")

        if (numberOfCards.length === 1 && pokemonsEvoArray[curIndex].hasOwnProperty("second")) {
            displayPokemon(pokemonsEvoArray[curIndex].second[speciesID], pokemonsEvoArray[curIndex].second[pokemonDetails])
        }
        if (numberOfCards.length === 2 && pokemonsEvoArray[curIndex].hasOwnProperty("third")) {
            displayPokemon(pokemonsEvoArray[curIndex].third[speciesID], pokemonsEvoArray[curIndex].third[pokemonDetails])
        }
        if (pokemonsEvoArray[curIndex + 1]) {
            if (numberOfCards.length === 2 && !pokemonsEvoArray[curIndex].hasOwnProperty("third")) {
                curIndex++
                if (curIndex >= pokemonLimit) curIndex = pokemonLimit - 1
                listContainer.innerHTML = ""

                displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
            }
            if (numberOfCards.length === 3) {
                curIndex++
                if (curIndex >= pokemonLimit) curIndex = pokemonLimit - 1
                listContainer.innerHTML = ""

                displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
            }
        }

    })

    const prevButtonShowOnlyOne = document.querySelector('#prevButtonShowOnlyOne')

    prevButtonShowOnlyOne.addEventListener('click', () => {
        const numberOfCards = document.querySelectorAll("#pokemonList >  li")

        if (pokemonsEvoArray[curIndex - 1]) {
            if (numberOfCards.length === 1) {
                curIndex--
                if (curIndex < 0) curIndex = curIndex + 1
                listContainer.innerHTML = ""
                displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
                displayPokemon(pokemonsEvoArray[curIndex].second[speciesID], pokemonsEvoArray[curIndex].second[pokemonDetails])
                if (pokemonsEvoArray[curIndex].hasOwnProperty("third")) {
                    displayPokemon(pokemonsEvoArray[curIndex].third[speciesID], pokemonsEvoArray[curIndex].third[pokemonDetails])
                }
            }
        }
        if (numberOfCards.length === 2) {
            listContainer.innerHTML = ""
            displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
        }
        if (numberOfCards.length === 3) {
            listContainer.innerHTML = ""
            displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
            displayPokemon(pokemonsEvoArray[curIndex].second[speciesID], pokemonsEvoArray[curIndex].second[pokemonDetails])
        }

    })

    const nextButton = document.querySelector('#nextButton')

    nextButton.addEventListener('click', () => {
        listContainer.innerHTML = ""

        curIndex++

        if (curIndex >= pokemonLimit) curIndex = pokemonLimit - 1

        displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
        if (pokemonsEvoArray[curIndex].hasOwnProperty("second")) {
            displayPokemon(pokemonsEvoArray[curIndex].second[speciesID], pokemonsEvoArray[curIndex].second[pokemonDetails])
            if (pokemonsEvoArray[curIndex].hasOwnProperty("third")) {
                displayPokemon(pokemonsEvoArray[curIndex].third[speciesID], pokemonsEvoArray[curIndex].third[pokemonDetails])
            }
        }

    })

    const prevButton = document.querySelector('#prevButton')

    prevButton.addEventListener('click', () => {
        listContainer.innerHTML = ""
        curIndex--

        if (curIndex < 0) curIndex = curIndex + 1

        displayPokemon(pokemonsEvoArray[curIndex].first[speciesID], pokemonsEvoArray[curIndex].first[pokemonDetails])
        if (pokemonsEvoArray[curIndex].hasOwnProperty("second")) {
            displayPokemon(pokemonsEvoArray[curIndex].second[speciesID], pokemonsEvoArray[curIndex].second[pokemonDetails])
            if (pokemonsEvoArray[curIndex].hasOwnProperty("third")) {
                displayPokemon(pokemonsEvoArray[curIndex].third[speciesID], pokemonsEvoArray[curIndex].third[pokemonDetails])
            }
        }
    })

    //Find all Pokemon possibilities as client types 
    const formSearchPokemon = document.querySelector('#formSearchPokemon')
    formSearchPokemon.addEventListener('keyup', (event) => {

        event.preventDefault()

        const recommendedPokemons = []
        pokemonsEvoArray.forEach((pokemon) => {
            for (const key in pokemon) {
                if (pokemon[key][1].name.toLowerCase().includes(searchPokemonName.value.toLowerCase())) {
                    recommendedPokemons.push(pokemon[key])
                }
            }
        })

        const result = recommendedPokemons.find((pokemon) => pokemon[1].name === searchPokemonName.value.toLowerCase());

        const recList = document.querySelector("#recomendationList")
        recList.innerHTML = ""


        if (result) {
            const isFound = document.querySelector("#searchedPokemonContainer")
            if (!isFound) {
                const searchedPokemonContainer = document.createElement("div")
                searchedPokemonContainer.id = "searchedPokemonContainer"
                document.querySelector("#wrapperSearchedPokemon").append(searchedPokemonContainer)
            }
            displaySearchedPokemon(result)
        } else {

            recommendedPokemons.forEach((pokemon) => {
                const li = document.createElement("li")
                li.innerHTML = `<button>${pokemon[1].name}</button>`

                li.addEventListener('click', (event) => {
                    recList.innerHTML = ""

                    const isFound = document.querySelector("#searchedPokemonContainer")
                    if (!isFound) {
                        const searchedPokemonContainer = document.createElement("div")
                        searchedPokemonContainer.id = "searchedPokemonContainer"
                        document.querySelector("#wrapperSearchedPokemon").append(searchedPokemonContainer)
                    }

                    displaySearchedPokemon(pokemon)
                })

                recList.append(li)
            })
        }

    })
}

//Add event listener to the Pokemon evolution images
function buttonEvoImages() {

    const roundedImage = document.querySelectorAll('.roundedImage')
    roundedImage.forEach(pokemonImage => {
        pokemonImage.addEventListener('click', (event) => {

            let pokemonFound;
            pokemonsEvoArray.find(pokemonEvo => {
                for (const pokemon in pokemonEvo) {
                    if (pokemonEvo[pokemon][1].name === event.target.id.toLowerCase()) {
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


//Display additional information under Pokemon Search
function displaySearchedPokemon(pokemon) {

    const wrapperSearchedPokemon = document.querySelector("#wrapperSearchedPokemon")
    const searchedPokemonContainer = document.querySelector("#searchedPokemonContainer")
    searchedPokemonContainer.innerHTML = ""
    let abilityHTML = ``

    pokemon[1].abilities.forEach((abilityLabel) => {
        const abilityName = capitalizedStr(abilityLabel.ability.name)
        !abilityHTML ?
            (abilityHTML = `<div class="item-grid-2-col-3-5">${abilityName},</div>`)
            : (abilityHTML = abilityHTML + `<div class="item-grid-2-col-3-5">${abilityName}</div>`)
    })


    const pokemonImgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon[1].id}.png`
    const pokemonImgBase = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon[0].base_evolution.id}.png`

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

    const pokemonBaseName = capitalizedStr(pokemon[0].base_evolution.name)
    const pokemonName = capitalizedStr(pokemon[1].name)
    const pokemonHeight = pokemon[1].height * 10
    const pokemonId = pokemon[1].id.toString().padStart(4, '0')
    console.log(pokemon)
    searchedPokemonContainer.innerHTML =
        `<div class="pokemonColumns ${pokemon[1].colorName}">
            <div class="container-grid-2">
                <div class="item-grid-2-col-1-5 center searchedPokemonFontSize searchedPokemonMargin">#${pokemonId}</div>
                <div class="item-grid-2-col-1-5 center">
                    <img class="searchedPokemonImg" src="${pokemonImgSrc}" alt="${pokemon[1].name}">
                </div>
                <div class="item-grid-2-col-1-5 center searchedPokemonFontSize">${pokemonName}</div>
            </div>
        </div>

        <div class="pokemonColumns">
            <div class="container-grid-2">
                <h3 class="item-grid-2-col-1-5">Bio</h3>
                <p class="item-grid-2-col-1-5">${pokemon[0].bio}</p>
            
                <div class="item-grid-2-col-1-2">Genus:</div>
                <div class="item-grid-2-col-2-4">${pokemon[0].genus}</div>
                <div class="item-grid-2-col-1-2">Height:</div>
                <div class="item-grid-2-col-2-4">${pokemonHeight}cm</div>
                <div class="item-grid-2-col-1-2">Weight:</div>
                <div class="item-grid-2-col-2-4">${pokemon[1].weight}kg</div>
                <div class="item-grid-2-col-1-2">Abilities:</div>
                <div class="item-grid-2-col-2-4">${abilityHTML}</div>
                
                <h3 class="item-grid-2-col-1-5">Training</h3>
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
            <h3>Evolution</h3>
            <div class="container-grid-2 " id="evolutionRoundImage">
                <div class="item-grid-2-col-1-2 center">
                    <button>
                    <img class="roundedImage ${pokemon[0].base_evolution.colorName}" id="${pokemonBaseName}" src="${pokemonImgBase}" alt="${pokemonBaseName}">
                    </button>
                    <span>${pokemonBaseName}</span>
                </div>
            </div>
            <h3>Stats</h3>
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

    wrapperSearchedPokemon.appendChild(searchedPokemonContainer);

    const roundedImageElement = document.querySelector(`#evolutionRoundImage`)

    if (pokemon[0].hasOwnProperty("first_evolution")) {
        const pokemonFirstEvoName = capitalizedStr(pokemon[0].first_evolution.name)
        const imageSecond = document.createElement("div")
        const pokemonImgSecond = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon[0].first_evolution.id}.png`
        imageSecond.className = "item-grid-2-col-2-3 center"
        imageSecond.innerHTML = `<button><img class="roundedImage ${pokemon[0].first_evolution.colorName}" id="${pokemonFirstEvoName}" src="${pokemonImgSecond}" alt="${pokemonFirstEvoName}"></button>
                                <span>${pokemonFirstEvoName}</span>`
        roundedImageElement.append(imageSecond)

        
        if (pokemon[0].hasOwnProperty("second_evolution")) {
            const pokemonSecondEvoName = capitalizedStr(pokemon[0].second_evolution.name)
            const imageThird = document.createElement("div")
            const pokemonImgThird = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon[0].second_evolution.id}.png`
            
            imageThird.className = "item-grid-2-col-3-4 center"
            imageThird.innerHTML = `<button><img class="roundedImage ${pokemon[0].second_evolution.colorName}" id="${pokemonSecondEvoName}" src="${pokemonImgThird}" alt="${pokemonSecondEvoName}"></button>
                                    <span>${pokemonSecondEvoName}</span>`
            roundedImageElement.append(imageThird)

        }
    }

    buttonEvoImages()
}
