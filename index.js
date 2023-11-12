const url = 'http://localhost:3000/dogs'
const pokeUrl = 'https://pokeapi.co/api/v2/pokemon?limit=5'
const dummyUrl2 = 'https://dummyapi.io/data/v1/'

let currentIndex = 5

//https://img.pokemondb.net/artwork/large/bulbasaur.jpg

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

    console.log(pokemonDetails.sprites.front_default)

    pokemonImg.src = pokemonDetails.sprites.other.home.front_default
    
    pokemonName.innerText = pokemonDetails.name
    pokemonName.className = 'pokemonName'

    pokemonNumber.innerText = pokemonDetails.id
    pokemonNumber.className = 'pokemonId'

    learnMoreButton.type = 'button'
    learnMoreButton.className = 'learnMoreButton'
    learnMoreButton.value = 'Learn More'

    pokemonRow.className = 'pokemonLi'
    pokemonRow.appendChild(pokemonNumber)
    pokemonRow.appendChild(pokemonImg)
    pokemonRow.appendChild(pokemonName)
    pokemonRow.appendChild(learnMoreButton)
    listContainer.appendChild(pokemonRow)
}

fetchPokemons();