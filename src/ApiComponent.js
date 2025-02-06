import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ApiComponent() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [director, setDirector] = useState('');
  const [rating, setRating] = useState('');
  const [genre, setGenre] = useState('');
  const [movieId, setMovieId] = useState('');
  const [singleMovie, setSingleMovie] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showId, setShowId] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchBy, setSearchBy] = useState('title');

  // Hae elokuvat komponentin alustusvaiheessa
  useEffect(() => {
    fetchAllMovies();
  }, []);

  const toggleShowId = () => {
    setShowId(!showId);
  };

  const fetchAllMovies = () => {
    axios.get('http://127.0.0.1:5000/movies')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('[NOK] - Virhe elokuvan hakemisessa:', error);
      });
  };

  const handleAddMovie = () => {
    if (!title || !genre || !releaseYear || !director || !rating) {
      alert('Tayta kaikki kentat, kiitos');
      return;
    }

    const newMovie = { title, genre, releaseYear, director, rating };
    axios.post('http://127.0.0.1:5000/movies', newMovie)
      .then(response => {
        setData([...data, response.data]);
        resetForm();
      })
      .catch(error => {
        console.error('[NOK] - Virhe elokuvan lisaamisessa:', error);
      });
  };

  const handleUpdateMovie = () => {
    if (!title || !genre || !releaseYear || !director || !rating) {
      alert('Ole hyva ja tayta kaikki vaaditut kentat!');
      return;
    }

    const updatedMovie = { title, genre, releaseYear, director, rating };
    axios.put(`http://127.0.0.1:5000/movies/${movieId}`, updatedMovie)
      .then(response => {
        setData(data.map(movie => movie.id === movieId ? response.data : movie));
        // Alusta pohja
        resetForm();
      })
      .catch(error => {
        console.error('[NOK] - Virhe elokuvan hakemisessa:', error);
      });
  };

  const handleDeleteMovie = (id) => {
    if (window.confirm('Oletko varma, etta haluat poistaa taman elokuvan?')) {
      axios.delete(`http://127.0.0.1:5000/movies/${id}`)
        .then(() => {
          setData(data.filter(movie => movie.id !== id));
        })
        .catch(error => {
          console.error('[NOK] - Virhe elokuvan hakemisessa:', error);
        });
    }
  };

  const startEditing = (movie) => {
    setIsEditing(true);
    setMovieId(movie.id);
    setTitle(movie.title);
    setGenre(movie.genre);
    setReleaseYear(movie.releaseYear);
    setDirector(movie.director);
    setRating(movie.rating);
  };

  const cancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setIsEditing(false);
    setMovieId('');
    setTitle('');
    setGenre('');
    setReleaseYear('');
    setDirector('');
    setRating('');
  };

  const handleGetSingleMovie = () => {
    if (!searchTerm) {
      alert('Lisaa hakuehto');
      return;
    }

    const queryParam = `${searchBy}=${encodeURIComponent(searchTerm)}`;
    console.log(`Searching for movie with ${queryParam}`);
    axios.get(`http://127.0.0.1:5000/movies/search?${queryParam}`)
      .then(response => {
        console.log('Search result:', response.data);
        setSingleMovie(response.data);
      })
      .catch(error => {
        console.error('[NOK] - Virhe elokuvan hakemisessa:', error);
        setSingleMovie(null);
      });
  };

  const handleSearch = () => {
    if (!searchTerm) {
      alert('Ole hyva ja syota hakuehto');
      return;
    }

    const queryParam = `${searchBy}=${encodeURIComponent(searchTerm)}`;
    console.log(`Etsitaan elokuvia: ${queryParam}`);
    axios
      .get(`http://127.0.0.1:5000/movies/search?${queryParam}`)
      .then((response) => {
        console.log('Etsinnan tulokset:', response.data);
        setSearchResults(response.data.results);
      })
      .catch((error) => {
        console.error('[NOK] - Virhe, elokuvaa ei loydy:', error);
      });
  };

  return (
    <div>
      <h1>Lista elokuvista</h1>
      {/* Nayta/piilota elokuvat */}
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Piilota kaikki elokuvat' : 'Nayta kaikki elokuvat'}
      </button>

      {/* Nayta elokuvat */}
      <button onClick={toggleShowId}>
        {showId ? 'Piilota ID' : 'Nayta ID'}
      </button>
      {showAll && (
        <ul>
          {data.map((movie) => (
            <li key={movie.id}>
              {showId && <span>{movie.id} </span>}
              {movie.title} ({movie.genre}) ({movie.director}) ({movie.releaseYear}) ({movie.rating})
              <button onClick={() => startEditing(movie)}>Muokkaa</button>
              <button onClick={() => handleDeleteMovie(movie.id)}>Poista</button>
            </li>
          ))}
        </ul>
      )}

      {/* Elokuvan paivitys ja lisays */}
      <div>
        <h2>{isEditing ? 'Paivita elokuva' : 'Lisaa uusi elokuva'}</h2>
        <input 
          type="text" 
          placeholder="Nimi" 
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Luokka" 
          value={genre}
          onChange={(e) => setGenre(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Valmistumisvuosi" 
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Ohjaaja" 
          value={director}
          onChange={(e) => setDirector(e.target.value)} 
        />  
        <input 
          type="text" 
          placeholder="Arvostelu" 
          value={rating}
          onChange={(e) => setRating(e.target.value)} 
        />
        <button onClick={isEditing ? handleUpdateMovie : handleAddMovie}>
          {isEditing ? 'Paivita' : 'Lisaa'}
        </button>
        {isEditing && (
          <button onClick={cancelEdit}>
            Peruuta
          </button>
        )}
      </div>

      {/* Etsi elokuva hakuehdon perusteella */}
      <div>
        <h2>Etsi elokuva</h2>
        <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
          <option value="id">ID</option>
          <option value="title">Nimi</option>
          <option value="director">Ohjaaja</option>
          <option value="genre">Luokka</option>
          <option value="releaseYear">Julkaisuvuosi</option>
          <option value="rating">Arvostelu</option>
        </select>
        <input
          type="text"
          placeholder={`Etsitaan ${searchBy}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Etsi elokuva</button>
      </div>

      {searchResults.length > 0 && (
        <div>
          <h3>Haun tulokset</h3>
          <ul>
            {searchResults.map((movie) => (
              <li key={movie.id}>
                {movie.title} ({movie.releaseYear})
                <button onClick={() => startEditing(movie)}>Muokkaa</button>
                <button onClick={() => handleDeleteMovie(movie.id)}>Poista</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ApiComponent;