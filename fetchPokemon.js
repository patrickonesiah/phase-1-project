//Fetch 151 Pokemons
const pokemonQuantity = 9;
const pokemons_151 = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonQuantity}&offset=0`

async function getPokemons(){

    const pokemonsResponse = await fetch(pokemons_151)
    const pokemonsArray = await pokemonsResponse.json()

    await storePokemon(pokemonsArray)
    pokemonsTemp.forEach((e)=>{
        console.log(e)
        displayPokemon(e)
    })

    console.log("pokemonsTemp: ", pokemonsTemp)
    interactiveButtons()
}

getPokemons();

//Store the Pokemons
const pokemonsTemp = []

async function storePokemon(pokemonsArray){
    //pokemonsArray.results.forEach(async (pokemon)=>{
    for(let i = 0; i < pokemonQuantity; i++){
        const pokemonInfoResp = await fetch(pokemonsArray.results[i].url)
        const pokemonInfo = await pokemonInfoResp.json()

        const pokemonSpeciesResp = await fetch(pokemonInfo.species.url)
        const pokemonSpecies = await pokemonSpeciesResp.json()

        const pokemonEvolutionResp = await fetch(pokemonSpecies.evolution_chain.url)
        const pokemonEvolution = await pokemonEvolutionResp.json()        

        pokemonInfo.bio = replaceEmDashSymbols(pokemonSpecies.flavor_text_entries[6].flavor_text)
        pokemonInfo.genus = pokemonSpecies.genera[7].genus
        pokemonInfo.base_happiness = pokemonSpecies.base_happiness
        pokemonInfo.capture_rate = pokemonSpecies.capture_rate
        pokemonInfo.growth_rate = pokemonSpecies.growth_rate.name
        
        pokemonInfo.evolution_base =  getPokemonIDFromURL(pokemonEvolution.chain.species.url)

        if(pokemonEvolution.chain["evolves_to"][0]){
            pokemonInfo.evolution_second = getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].species.url)
            if(pokemonEvolution.chain["evolves_to"][0].evolves_to[0]){
            pokemonInfo.evolution_third = getPokemonIDFromURL(pokemonEvolution.chain["evolves_to"][0].evolves_to[0].species.url)
            }
        }
        
        // console.log(pokemonInfo)
        // console.log(pokemonSpecies)
        // console.log(pokemonEvolution)
        
        pokemonsTemp.push(pokemonInfo)
    }
    console.log(pokemonsTemp)
    //})
}

//Display pokemon
let currentIndex = 0;
const listContainer = document.querySelector('#pokemonList')

const displayPokemon = (pokemonInfo) => {

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
    displayBack(pokemonInfo, flipBoxBack)

}

function displayFront(pokemonInfo, flipBoxFront) {

    const pokemonImgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonInfo.id}.png`
    const pokemonName = capitalizedStr(pokemonInfo.name)
    const pokemonNumber = pokemonInfo.id.toString().padStart(4, '0')

    flipBoxFront.innerHTML =
        `<div class="pokemonId">${pokemonNumber}</div>
        <img class="pokemonImgStyle" src="${pokemonImgSrc}" alt="${pokemonName}">
        <div class="pokemonName">${pokemonName}</div>
        <input type="button" class="learnMoreButton" value="Learn More">`
}

function displayBack(pokemonInfo, flipBoxBack) {

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
            <div class="item-grid-2-col-3-5">${pokemonInfo.genus}</div>
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
let nextIndex = 0;
//Buttons to interact
function interactiveButtons() {
    document.addEventListener('keyup', event => {
        if (event.code === 'Space') {
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

        nextIndex = currentIndex + 3

        for(currentIndex;currentIndex<nextIndex;currentIndex++){
            displayPokemon(pokemonsTemp[currentIndex])
        }
        
    })

    const formSearchPokemon = document.querySelector('#formSearchPokemon')
    formSearchPokemon.addEventListener('submit', async (event) => {
        // const pokeUrl = 'https://pokeapi.co/api/v2/pokemon?limit=1'
        event.preventDefault()

        const array = pokemonArray_temp[0].results.filter((pokemon) => pokemon.name.toLowerCase().includes(searchPokemonName.value.toLowerCase()))

        const result = array.find(({ name }) => name === searchPokemonName.value.toLowerCase());
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


//Utility functions

function getPokemonIDFromURL(url){
    return url.split("/")[6]
}

function replaceEmDashSymbols(text){
    return text.replace(/\u2013|\u2014/g, "-");
}

function convertStatsToPercentage(stats){
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

