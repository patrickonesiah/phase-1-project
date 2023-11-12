const url = 'http://localhost:3000/dogs'
const pokeUrl = 'https://pokeapi.co/api/v2/pokemon?limit=5/'
const dummyUrl2 = 'https://dummyapi.io/data/v1/'

//https://img.pokemondb.net/artwork/large/bulbasaur.jpg

async function getAllUsers() {
    const response = await fetch(pokeUrl)

    const pokemonArray = await response.json()

    pokemonArray.results.forEach((pokemon) => {
        displayOnePokemon(pokemon)
    })


}

async function displayOnePokemon(pokemon){
    const fetchIndividualPokemon = await fetch(pokemon.url)
    const pokemonDetails = await fetchIndividualPokemon.json()

    const listContainer = document.querySelector('#pokemonList')

    const pokemonImg = document.createElement('img')
    const pokemonName = document.createElement('p')
    const pokemonRow = document.createElement('li')

    console.log(pokemonDetails.sprites.front_default)

    pokemonImg.src = pokemonDetails.sprites.other.home.front_default
    pokemonName.innerText = pokemonDetails.name

    pokemonRow.className = 'pokemonLi'
    pokemonRow.appendChild(pokemonImg)
    pokemonRow.appendChild(pokemonName)
    listContainer.appendChild(pokemonRow)
}

getAllUsers();