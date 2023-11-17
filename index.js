const url = 'http://localhost:3000/dogs'
const pokeUrl = 'https://pokeapi.co/api/v2/pokemon?limit=5'
const dummyUrl2 = 'https://dummyapi.io/data/v1/'

const listContainer = document.querySelector('#pokemonList')
console.log(listContainer)
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


    const nextButton = document.querySelector('#nextButton')
    const frontBackButton = document.querySelector('#frontBackButton')

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
function displayPokemons() {
    const nextButton = document.querySelector('#nextButton')

    nextButton.addEventListener('click', async () => {
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

    const returnValueOfFlipBoxBack = displayFront(pokemonInfo)
    displayBack(pokemonInfo, pokemonSpecies, returnValueOfFlipBoxBack)
}

function displayFront(pokemonInfo) {

    const pokemonImg = document.createElement('img')
    const pokemonName = document.createElement('div')
    const pokemonNumber = document.createElement('div')
    const learnMoreButton = document.createElement('input')
    const pokemonRow = document.createElement('li')
    const flipBox = document.createElement('div')
    const flipBoxInner = document.createElement('div')
    const flipBoxFront = document.createElement('div')
    const flipBoxBack = document.createElement('div')

    flipBox.className = "flip-box"
    flipBoxInner.className = "flip-box-inner"
    flipBoxBack.className = "flip-box-back"
    flipBoxFront.className = "flip-box-front"

    //console.log(pokemonInfo.sprites.front_default)

    pokemonImg.src = `https://img.pokemondb.net/artwork/large/${pokemonInfo.name}.jpg`
    //pokemonInfo.sprites.other.home.front_default
    //https://img.pokemondb.net/artwork/large/bulbasaur.jpg
    pokemonName.innerText = capitalizedStr(pokemonInfo.name)
    pokemonName.className = 'pokemonName'

    pokemonNumber.innerText = pokemonInfo.id.toString().padStart(4, '0')
    pokemonNumber.className = 'pokemonId'

    learnMoreButton.type = 'button'
    learnMoreButton.className = 'learnMoreButton'
    learnMoreButton.value = 'Learn More'

    flipBox.appendChild(flipBoxInner)
    flipBoxInner.appendChild(flipBoxFront)
    flipBoxInner.appendChild(flipBoxBack)

    flipBoxFront.appendChild(pokemonNumber)
    flipBoxFront.appendChild(pokemonImg)
    flipBoxFront.appendChild(pokemonName)
    flipBoxFront.appendChild(learnMoreButton)

    pokemonRow.appendChild(flipBox)
    listContainer.appendChild(pokemonRow)

    return flipBoxBack
}

function displayBack(pokemonInfo, pokemonSpecies, returnValueOfFlipBoxBack) {

    const div_container_grid_1 = document.createElement('div')
    const pokemonId = pokemonInfo.id.toString().padStart(4, '0')
    const pokemonImg = `https://img.pokemondb.net/artwork/large/${pokemonInfo.name}.jpg`

    div_container_grid_1.innerHTML =
    `
    <div class="container-grid-1">
        <div class="item-grid-1 backPokemonNameFontStyle">${capitalizedStr(pokemonInfo.name)}</div>
        <div class="item-grid-1 backPokemonIdFontStyle">${pokemonId}</div>
        <div class="item-grid-1"><img src="${pokemonImg}"></div>
    </div>
    `
    const div_container_grid_2 = document.createElement('div')
    const typeColorObject = 
        {

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
        `
        <div class="container-grid-2">
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
        </div>
        `

        const div_container_grid_3 = document.createElement('div')

        // const statsPercentage = {
        //     hp: 0,
        //     att: 0,
        //     def: 0,
        //     satt: 0,
        //     sdef: 0,
        //     spd: 0,
        //     hpEmpty: 0,
        //     attEmpty: 0,
        //     defEmpty: 0,
        //     sattEmpty: 0,
        //     sdefEmpty: 0,
        //     spdEmpty: 0,
        // }
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
        // const statsPercentage = pokemonInfo.stats.map((statLabel) => {
        //     // console.log(statLabel.stat.name, statLabel.base_stat)
        //     const statsPercentage = {}
        //     const newStatLabel = statLabel.stat.name.split('-').join('')
        //     statsPercentage[newStatLabel] = Math.round(statLabel.base_stat/255*100)
        //     statsPercentage[`${newStatLabel}_topHalfOfBar`] = Math.round((255-statLabel.base_stat)/255*100)

        //     return statsPercentage
        // })


        div_container_grid_3.innerHTML = `
        <div class="container-grid-2">

        </div>    
         <div>   
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
        </div>            
        
        `

    returnValueOfFlipBoxBack.appendChild(div_container_grid_1)
    returnValueOfFlipBoxBack.appendChild(div_container_grid_2)
    returnValueOfFlipBoxBack.appendChild(div_container_grid_3)


    // pokemonInfo.types.forEach((typeLabel) => {
    //     console.log(`typeLabel.type.name: ${typeLabel.type.name}`)
    // })

}

fetchPokemons();