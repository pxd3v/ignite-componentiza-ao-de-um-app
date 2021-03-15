import { useEffect, useState } from 'react';

import { Sidebar } from './components/SideBar';
import { Content } from './components/Content';

import { api } from './services/api';

import './styles/global.scss';
interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export function App() {
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      const newGenres = response.data 
      setGenres(newGenres);
      setSelectedGenre(newGenres[0])
    })
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenre.id}`).then(response => {
      setMovies(response.data);
    });
  }, [selectedGenre]);

  function handleClickButton(id: number) {
    const newGenre = genres.find(genre => genre.id === id)
    if(newGenre)
    setSelectedGenre(newGenre);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Sidebar handleClickButton={handleClickButton} genres={genres} selectedGenreId={selectedGenre.id}/>

      <Content movies={movies} title={selectedGenre.title}/>
    </div>
  )
}