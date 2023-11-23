const url = 'http://localhost:3000/dogs'
const pokeUrl = 'https://pokeapi.co/api/v2/pokemon?limit=1'
const pokemonURL_151 = 'https://pokeapi.co/api/v2/pokemon?limit=151'
const dummyUrl2 = 'https://dummyapi.io/data/v1/'

const listContainer = document.querySelector('#pokemonList')
let currentIndex = 5
const pokemonArray_temp = []

async function fetchPokemons() {
    const response = await fetch(pokeUrl)
    const response_151 = await fetch(pokemonURL_151)
    const pokemonArray = await response.json()
    const pokemonArray_151 = await response_151.json()

    pokemonArray.results.forEach((pokemon) => {
        pokemonArray_temp.push(pokemonArray_151)
        displayOnePokemon(pokemon)
    })
    console.log(pokemonArray_temp)

    interactiveButtons()

}
// /'https://pokeapi.co/api/v2/pokemon?limit=5&offset=10/'
function interactiveButtons() {
    // document.addEventListener('click', event => {
    //     if (event.code === 'Space') {
    //         console.log('Space pressed')
    //         const cards = document.querySelectorAll('.flip-box-inner')
    //         cards.forEach(card => {
    //             console.log(card)
    //             card.classList.toggle("is-flipped")
    //         });
    //     }
    // })

    const nextButton = document.querySelector('#nextButton')
    nextButton.addEventListener('click', async () => {
        listContainer.innerHTML = ""
        const fetchIndividualPokemon = await fetch(`${pokeUrl}&offset=${currentIndex}`)
        const pokemonArray = await fetchIndividualPokemon.json()

        pokemonArray.results.forEach((pokemon) => {
            displayOnePokemon(pokemon)
        })
        currentIndex += 5
    })

    const formSearchPokemon = document.querySelector('#formSearchPokemon')
    formSearchPokemon.addEventListener('submit', async (event) => {
        // const pokeUrl = 'https://pokeapi.co/api/v2/pokemon?limit=1'
        event.preventDefault()

        const array = pokemonArray_temp[0].results.filter((pokemon) => pokemon.name.toLowerCase().includes(searchPokemonName.value.toLowerCase()))
        console.log("array", array)
        const result = array.find(({ name }) => {
            console.log("name:", name)
            console.log("searchPokemonName.value.toLowerCase():", searchPokemonName.value.toLowerCase())
            if(name === searchPokemonName.value.toLowerCase()){
                return true
            }
        });
        console.log("result", result)
        const recList = document.querySelector("#recomendationList")
        recList.innerHTML = ""

        if (result) {
            displaySearchedPokemon(result)
        } else {
            //if it's 1 or 2 letters, give recommendation
            console.log(array)

            array.forEach((pokemon) => {
                const li = document.createElement("li")
                li.innerText = pokemon.name
                //li.id = el.name

                li.addEventListener('click', (event) => {
                    recList.innerHTML = ""
                    displaySearchedPokemon(pokemon)
                })

                recList.append(li)
            })
        }

        formSearchPokemon.reset()
    })
}

async function displaySearchedPokemon(pokemon) {

    const searchedPokemonUrl = `${pokemon.url}`
    const searchedPokemon = await fetch(searchedPokemonUrl)
    const pokemonInfo = await searchedPokemon.json()

    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonInfo.id}`
    const evolutionUrl = `https://pokeapi.co/api/v2/evolution-chain/${pokemonInfo.id}/`

    const fetchPokemonSpecies = await fetch(pokemonSpeciesUrl)
    const pokemonSpecies = await fetchPokemonSpecies.json()

    const fetchEvolution = await fetch(evolutionUrl)
    const pokemonEvolution = await fetchEvolution.json()

    const searchedPokemonContainer = document.querySelector(".searchedPokemonContainer")

    let abilityHTML = ``

    pokemonInfo.abilities.forEach((abilityLabel) => {
        const abilityName = capitalizedStr(abilityLabel.ability.name)
        !abilityHTML ?
            (abilityHTML = `<div class="item-grid-2-col-3-5">${abilityName},</div>`)
            : (abilityHTML = abilityHTML + `<div class="item-grid-2-col-3-5">${abilityName}</div>`)
    })   

    console.log(pokemonInfo.id)
    console.log(pokemonSpecies.flavor_text_entries[6].flavor_text)
    // console.log(pokemonEvolution)
    // console.log(pokemonEvolution.chain["evolves_to"][0].species.name)
    // console.log(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.name)
        // console.log(evolutionUrl.chain["evolves_to"].evolves_to.species.name)

        const pokemonImgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonInfo.id}.png`

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
        // Height needs to convert from meter to cm?
        searchedPokemonContainer.innerHTML=
        `<div class="pokemonColumns greenColor">
            <div class="container-grid-2">
                <img class="searchedPokemonImg item-grid-2-col-1-5" src="${pokemonImgSrc}" alt="${pokemonInfo.name}">
            </div>
        </div>

        <div class="pokemonColumns">
            <div class="container-grid-2">
                <h2 class="item-grid-2-col-1-5">Bio</h2>
                <p class="item-grid-2-col-1-5">${pokemonSpecies.flavor_text_entries[6].flavor_text}</p>
            
                <div class="item-grid-2-col-1-2">Genus:</div>
                <div class="item-grid-2-col-2-4">${pokemonSpecies.genera[7].genus}</div>
                <div class="item-grid-2-col-1-2">Height:</div>
                <div class="item-grid-2-col-2-4">${pokemonInfo.height}</div>
                <div class="item-grid-2-col-1-2">Weight:</div>
                <div class="item-grid-2-col-2-4">${pokemonInfo.weight}kg</div>
                <div class="item-grid-2-col-1-2">Abilities:</div>
                <div class="item-grid-2-col-2-4">${abilityHTML}</div>
                
                <h2 class="item-grid-2-col-1-5">Training</h2>
                <div class="item-grid-2-col-1-2">Base Exp:</div>
                <div class="item-grid-2-col-2-4">${pokemonInfo.base_experience}</div>
                <div class="item-grid-2-col-1-2">Base Happiness:</div>
                <div class="item-grid-2-col-2-4">${pokemonSpecies.base_happiness}</div>
                <div class="item-grid-2-col-1-2">Catch Rate:</div>
                <div class="item-grid-2-col-2-4">${pokemonSpecies.capture_rate}</div>
                <div class="item-grid-2-col-1-2">Growth Rate:</div>
                <div class="item-grid-2-col-2-4">${pokemonSpecies.growth_rate.name}</div>
            </div>
        </div>
        <div class="pokemonColumns">
            <h2>Evolution</h2>
            <div class="container-grid-2">
                <div class="item-grid-2-col-1-2"><img class="roundedImage" src="${pokemonImgSrc}" alt=""></div>
                <div class="item-grid-2-col-2-3"><img class="roundedImage" src="${pokemonImgSrc}" alt=""></div>
                <div class="item-grid-2-col-3-4"><img class="roundedImage" src="${pokemonImgSrc}" alt=""></div>
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


}

async function displayOnePokemon(pokemon) {
    const fetchIndividualPokemon = await fetch(pokemon.url)
    const pokemonInfo = await fetchIndividualPokemon.json()

    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonInfo.id}`

    const fetchPokemonSpecies = await fetch(pokemonSpeciesUrl)
    const pokemonSpecies = await fetchPokemonSpecies.json()

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


    displayBack(pokemonInfo, pokemonSpecies, flipBoxBack)
}

function displayFront(pokemonInfo, flipBoxFront) {

    const pokemonImgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonInfo.id}.png`
    const pokemonName = capitalizedStr(pokemonInfo.name)
    const pokemonNumber = pokemonInfo.id.toString().padStart(4, '0')

    flipBoxFront.innerHTML =
        `
        <div class="pokemonId">${pokemonNumber}</div>
        <img class="pokemonImgStyle" src="${pokemonImgSrc}" alt="${pokemonName}">
        <div class="pokemonName">${pokemonName}</div>
        <input type="button" class="learnMoreButton" value="Learn More">
    `
}

function displayBack(pokemonInfo, pokemonSpecies, flipBoxBack) {

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
            <div class="item-grid-2-col-3-5">${pokemonSpecies.genera[7].genus}</div>
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

fetchPokemons();