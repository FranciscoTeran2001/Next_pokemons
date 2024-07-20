interface PokemonBasic {
    name: string;
    url: string;
}

interface PokemonDetail {
    id: number;
    name: string;
    sprites: {
        front_default: string;
    };
    types: {
        type: {
            name: string;
        };
    }[];
}

export async function getPokemons(): Promise<PokemonDetail[]> {
    const headers = new Headers({
        "Content-Type": "application/json"
    });

    const requestOptions: RequestInit = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    };

    try {
        
        const totalResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=0", requestOptions);
        const totalData = await totalResponse.json();
        const totalPokemons = totalData.count;

        
        const randomOffset = Math.floor(Math.random() * (totalPokemons - 10)); 
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${randomOffset}`, requestOptions);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        const data: { results: PokemonBasic[] } = await response.json();

        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                if (!res.ok) {
                    throw new Error(`Failed to fetch details for ${pokemon.name}: ${res.status}`);
                }
                const details: PokemonDetail = await res.json();
                return details;
            })
        );

        return pokemonDetails;
    } catch (error) {
        console.error('Failed to fetch pokemons:', error);
        throw error;
    }
}