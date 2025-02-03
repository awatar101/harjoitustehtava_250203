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

  // Hae elokuvat komponentin alustusvaiheessa
  useEffect(() => {
    fetchAllMovies();
  }, []);

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
      alert('Täytä kaikki kentät, kiitos');
      return;
    }

    const newMovie = { title, genre, releaseYear, director, rating };
    axios.post('http://127.0.0.1:5000/movies', newMovie)
      .then(response => {
        setData([...data, response.data]);
        resetForm();
      })
      .catch(error => {
        console.error('[NOK] - Virhe elokuvan lisäämisessä:', error);
      });
  };

  const handleUpdateMovie = () => {
    if (!title || !genre || !releaseYear || !director || !rating) {
      alert('Ole hyvä ja täytä kaikki vaaditut kentät!');
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
    if (window.confirm('Oletko varma, että haluat poistaa tämän elokuvan?')) {
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
    if (!movieId) {
      alert('Lisää elokuvan ID');
      return;
    }

    axios.get(`http://127.0.0.1:5000/movies/${movieId}`)
      .then(response => {
        setSingleMovie(response.data);
      })
      .catch(error => {
        console.error('[NOK] - Virhe elokuvan hakemisessa:', error);
        setSingleMovie(null);
      });
  };

  return (
    <div>
      <h1>Lista elokuvista</h1>
      {/* Näytä/piilota elokuvat */}
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Piilota kaikki elokuvat' : 'Näytä kaikki elokuvat'}
      </button>

      {/* Näytä elokuvat */}
      {showAll && (
        <ul>
          {data.map((movie) => (
            <li key={movie.id}>
              {movie.title} ({movie.genre}) ({movie.director}) ({movie.releaseYear}) ({movie.rating})
              <button onClick={() => startEditing(movie)}>Muokkaa</button>
              <button onClick={() => handleDeleteMovie(movie.id)}>Poista</button>
            </li>
          ))}
        </ul>
      )}

      {/* Elokuvan päivitys ja lisäys */}
      <div>
        <h2>{isEditing ? 'Päivitä elokuva' : 'Lisää uusi elokuva'}</h2>
        <input 
          type="text" 
          placeholder="Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Genre" 
          value={genre}
          onChange={(e) => setGenre(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Release Year" 
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Director" 
          value={director}
          onChange={(e) => setDirector(e.target.value)} 
        />  
        <input 
          type="text" 
          placeholder="Rating" 
          value={rating}
          onChange={(e) => setRating(e.target.value)} 
        />
        <button onClick={isEditing ? handleUpdateMovie : handleAddMovie}>
          {isEditing ? 'Päivitä' : 'Lisää'}
        </button>
        {isEditing && (
          <button onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </div>

      {/* Hae yksittäinen elokuva id:n perusteella*/}
      <div>
        <h2>Hae elokuva id:llä</h2>
        <input 
          type="text" 
          placeholder="Movie ID" 
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)} 
        />
        <button onClick={handleGetSingleMovie}>Get Movie</button>
        {singleMovie && (
          <div>
            <h3>{singleMovie.title} ({singleMovie.releaseYear})</h3>
            <p><strong>Director:</strong> {singleMovie.director}</p>
            <p><strong>Genre:</strong> {singleMovie.genre}</p>
            <p><strong>Rating:</strong> {singleMovie.rating}</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default ApiComponent;
