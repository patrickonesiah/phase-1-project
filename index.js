const url = 'http://localhost:3000/dogs'
const pokeUrl = 'https://pokeapi.co/api/v2/pokemon?limit=5'
const dummyUrl2 = 'https://dummyapi.io/data/v1/'

const listContainer = document.querySelector('#pokemonList')
let currentIndex = 5
const pokemonArray_temp = []

async function fetchPokemons() {
    const response = await fetch(pokeUrl)

    const pokemonArray = await response.json()

    pokemonArray.results.forEach((pokemon) => {
        pokemonArray_temp.push(pokemon)
        displayOnePokemon(pokemon)
    })

    interactiveButtons()

}
// /'https://pokeapi.co/api/v2/pokemon?limit=5&offset=10/'
function interactiveButtons() {
    document.addEventListener('keyup', event => {
        if(event.code === 'Space'){
            console.log('Space pressed')
            const cards = document.querySelectorAll('.flip-box-inner')
            cards.forEach(card => {
                console.log(card)
                card.classList.toggle("is-flipped")
            });
        }
    })

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
}

async function displayOnePokemon(pokemon) {
    const fetchIndividualPokemon = await fetch(pokemon.url)
    const pokemonInfo = await fetchIndividualPokemon.json()

    const pokemonSpeciesUrl =  `https://pokeapi.co/api/v2/pokemon-species/${pokemonInfo.id}`

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

    const pokemonImgSrc = `https://img.pokemondb.net/artwork/large/${pokemonInfo.name}.jpg`
    const pokemonName = capitalizedStr(pokemonInfo.name)
    const pokemonNumber = pokemonInfo.id.toString().padStart(4, '0')

    flipBoxFront.innerHTML = 
    `
        <div class="pokemonId">${pokemonNumber}</div>
        <img src="${pokemonImgSrc}">
        <div class="pokemonName">${pokemonName}</div>
        <input type="button" class="learnMoreButton" value="Learn More">
    `
}

function displayBack(pokemonInfo, pokemonSpecies, flipBoxBack) {

    const div_container_grid_1 = document.createElement('div')
    const pokemonId = pokemonInfo.id.toString().padStart(4, '0')
    const pokemonImg = `https://img.pokemondb.net/artwork/large/${pokemonInfo.name}.jpg`

    div_container_grid_1.innerHTML =
    `<div class="container-grid-1">
        <div class="item-grid-1 backPokemonNameFontStyle">${capitalizedStr(pokemonInfo.name)}</div>
        <div class="item-grid-1 backPokemonIdFontStyle">${pokemonId}</div>
        <div class="item-grid-1"><img src="${pokemonImg}"></div>
    </div>`

    const div_container_grid_2 = document.createElement('div')
    const typeColorObject = {
        normal:     '#A8A878',
        fire:       '#F08030',
        fighting:   '#C03028',
        water:      '#6890F0',
        grass:      '#78C850',
        electric:   '#F8D030',
        ice:        '#98D8D8',
        poison:     '#A040A0',
        ground:     '#E0C068',
        flying:     '#A890F0',
        psychic:    '#F85888',
        bug:        '#A8B820',
        rock:       '#B8A038',
        ghost:      '#705898',
        dark:       '#705848',
        dragon:     '#7038F8',
        steel:      '#B8B8D0',
        fairy:      '#EE99AC'      
    }

    let typeHTML, abilityHTML = ``

    pokemonInfo.types.forEach((typesLabel) => {
        const span_types = document.createElement('span')
        span_types.style.background = typeColorObject[typesLabel.type.name]
        span_types.classList.add('pillShape')
        span_types.innerText = capitalizedStr(typesLabel.type.name)
        !typeHTML ? (typeHTML = `${span_types.outerHTML}`)
        :(typeHTML += ` ${span_types.outerHTML}`)
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

            if(statNameArray[1]){

                const newString = capitalizedStr(statNameArray[1])
                statNameArray[1] = newString
                statNameArray = statNameArray.join("")
            }

            statsObject[statNameArray] = {top:0, bottom:0}
            statsObject[statNameArray].top = Math.round((255-statLabel.base_stat)/255*100)
            statsObject[statNameArray].bottom = Math.round(statLabel.base_stat/255*100)
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