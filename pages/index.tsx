import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { getPokemons } from '../lib/getsPokemons';

interface Pokemon {
    id: number;
    name: string;
    sprites: { front_default: string };
    types: { type: { name: string } }[];
}

export default function Home() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                setLoading(true);
                const pokemonData = await getPokemons();
                setPokemons(pokemonData);
            } catch (err) {
                setError('Error al encontrar Pokemones.');
            } finally {
                setLoading(false);
            }
        };

        fetchPokemons();
    }, []);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tarjetas de Pokémones</h1>
            <div className={styles.grid}>
                {pokemons.map((pokemon) => (
                    <div key={pokemon.id} className={styles.card}>
                        <Image
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            width={120}
                            height={120}
                        />
                        <h2>{pokemon.name}</h2>
                        <p>Types: {pokemon.types.map(t => t.type.name).join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}