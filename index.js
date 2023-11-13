

const url = 'http://localhost:3000/dogs'
const pokeUrl = 'https://pokeapi.co/api/v2/pokemon?limit=5'
const dummyUrl2 = 'https://dummyapi.io/data/v1/'

let currentIndex = 5

async function fetchPokemons() {
    const response = await fetch(pokeUrl)

    const pokemonArray = await response.json()

    pokemonArray.results.forEach((pokemon) => {
        displayOnePokemon(pokemon)
    })

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
    const pokemonDetails = await fetchIndividualPokemon.json()

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
    flipBoxFront.className = "flip-box-front"
    flipBoxBack.className = "flip-box-back"

    //console.log(pokemonDetails.sprites.front_default)

    pokemonImg.src = `https://img.pokemondb.net/artwork/large/${pokemonDetails.name}.jpg`
    //pokemonDetails.sprites.other.home.front_default
    //https://img.pokemondb.net/artwork/large/bulbasaur.jpg
    pokemonName.innerText = capitalizedStr(pokemonDetails.name)
    pokemonName.className = 'pokemonName'

    pokemonNumber.innerText = pokemonDetails.id.toString().padStart(4,'0')
    pokemonNumber.className = 'pokemonId'

    learnMoreButton.type = 'button'
    learnMoreButton.className = 'learnMoreButton'
    learnMoreButton.value = 'Learn More'

    flipBox.appendChild(flipBoxInner)
    flipBoxInner.appendChild(flipBoxFront)
    flipBoxInner.appendChild(flipBoxBack)


    flipBoxBack.appendChild(pokemonNumber)
    flipBoxBack.appendChild(pokemonImg)
    flipBoxBack.appendChild(pokemonName)
    flipBoxBack.appendChild(learnMoreButton)

    flipBoxFront.appendChild(pokemonNumber)
    flipBoxFront.appendChild(pokemonImg)
    flipBoxFront.appendChild(pokemonName)
    flipBoxFront.appendChild(learnMoreButton)
    
    pokemonRow.appendChild(flipBox)
    listContainer.appendChild(pokemonRow)
}

fetchPokemons();