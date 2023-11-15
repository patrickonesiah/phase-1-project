const url = 'http://localhost:3000/dogs'
const pokeUrl = 'https://pokeapi.co/api/v2/pokemon?limit=2'
const dummyUrl2 = 'https://dummyapi.io/data/v1/'

let currentIndex = 5

const pokemonArray_temp = []

async function fetchPokemons() {
    const response = await fetch(pokeUrl)

    const pokemonArray = await response.json()
    
    pokemonArray.results.forEach((pokemon) => {
        pokemonArray_temp.push(pokemon)
        displayOnePokemon(pokemon)
    })
    console.log(pokemonArray_temp)
    displayNextPokemons()

}
// /'https://pokeapi.co/api/v2/pokemon?limit=5&offset=10/'
function displayNextPokemons(){
    const nextButton = document.querySelector('#nextButton')

    nextButton.addEventListener('click',async ()=>{
        const fetchIndividualPokemon = await fetch(`${pokeUrl}&offset=${currentIndex}`)
        const pokemonArray = await fetchIndividualPokemon.json()

        pokemonArray.results.forEach((pokemon) => {
            displayOnePokemon(pokemon)
        })
        currentIndex+=5
    })


}

async function displayOnePokemon(pokemon){
    const fetchIndividualPokemon = await fetch(pokemon.url)
    const pokemonInfo = await fetchIndividualPokemon.json()

    const returnValueOfFlipBoxBack = displayFront(pokemonInfo)
    displayBack(pokemonInfo,returnValueOfFlipBoxBack)
}

function displayFront(pokemonInfo){
    const listContainer = document.querySelector('#pokemonList')
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
    flipBoxBack.className = "flip-box-front"
    flipBoxFront.className = "flip-box-back"

    //console.log(pokemonInfo.sprites.front_default)

    pokemonImg.src = `https://img.pokemondb.net/artwork/large/${pokemonInfo.name}.jpg`
    //pokemonInfo.sprites.other.home.front_default
    //https://img.pokemondb.net/artwork/large/bulbasaur.jpg
    pokemonName.innerText = capitalizedStr(pokemonInfo.name)
    pokemonName.className = 'pokemonName'

    pokemonNumber.innerText = pokemonInfo.id.toString().padStart(4,'0')
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

function displayBack(pokemonInfo, returnValueOfFlipBoxBack){

//     <div class="container-grid-1">
//     <div class="item-grid-1 backPokemonNameFontStyle">Crabominable</div>
//     <div class="item-grid-1 backPokemonIdFontStyle">0001</div>
//     <div class="item-grid-1"><img
//             src="https://img.pokemondb.net/artwork/large/bulbasaur.jpg"></div>
// </div>

    const div_container_grid_1 = document.createElement('div')
    const div_backPokemonName = document.createElement('div')
    const div_backPokemonId = document.createElement('div')
    const div_backPokemonImg = document.createElement('img')

    div_container_grid_1.className = 'container-grid-1'
    div_backPokemonName.classList.add('item-grid-1','backPokemonNameFontStyle')
    div_backPokemonName.innerText = capitalizedStr(pokemonInfo.name)
    div_backPokemonId.classList.add('item-grid-1','backPokemonIdFontStyle')
    div_backPokemonId.innerText = pokemonInfo.id.toString().padStart(4,'0')
    div_backPokemonImg.classList.add('item-grid-1','gridColumn_1_3')
    div_backPokemonImg.src = `https://img.pokemondb.net/artwork/large/${pokemonInfo.name}.jpg`
    
    div_container_grid_1.appendChild(div_backPokemonName)
    div_container_grid_1.appendChild(div_backPokemonId)
    div_container_grid_1.appendChild(div_backPokemonImg)
    console.log('flipBoxBack: ', returnValueOfFlipBoxBack)
    
    

    const div_container_grid_2 = document.createElement('div')
    const div_types= document.createElement('div')
    const grid_2_col_1_5 = "item-grid-2-col-1-5"

    div_container_grid_2.className = "container-grid-2"
    div_types.className = grid_2_col_1_5


    pokemonInfo.types.forEach((typesLabel)=>{
        console.log(typesLabel.type.name)
        const span_types= document.createElement('span')
        span_types.classList.add('pillShape', 'fightingColor')
        span_types.innerText = typesLabel.type.name
        div_types.appendChild(span_types)
    })
    div_container_grid_2.appendChild(div_types)

    returnValueOfFlipBoxBack.appendChild(div_container_grid_1)
    returnValueOfFlipBoxBack.appendChild(div_container_grid_2)



    // div_container_grid_2.innerHTML = 
    // `<div class="${grid_2_col_1_5}">
    //     <span class="pillShape fightingColor"></span>
    //     <span class="pillShape iceColor"></span>
    // </div>`

    
    // console.log(pokemonInfo)

    // console.log(pokemonInfo.name) 
    // console.log(pokemonInfo.id)



    console.log(pokemonInfo.species)
    console.log(pokemonInfo.weight)
    pokemonInfo.abilities.forEach((abilityLabel)=>{
        console.log(abilityLabel.ability.name)
    })

    pokemonInfo.stats.forEach((statLabel)=>{
        console.log(statLabel.stat.name, statLabel.base_stat)
    })

    pokemonInfo.types.forEach((typeLabel)=>{
        console.log(`typeLabel.type.name: ${typeLabel.type.name}`)
    })

}

fetchPokemons();