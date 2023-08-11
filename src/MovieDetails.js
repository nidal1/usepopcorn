import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { KEY } from './App';

export function MovieDetails({
  watchedMovies,
  selectedId,
  onCloseMovie,
  onAddWatched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState('');
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const isThisMovieExistInWatched = () =>
    [...watchedMovies]?.filter((w) => w.imdbID === selectedId).length;

  console.log();

  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
    };

    onAddWatched(newMovie);
    onCloseMovie();
  }

  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );

        const data = await res.json();
        if (data.Response === 'False') throw new Error(data.Error);

        setMovie(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = title;

    return () => (document.title = 'usePopcorn');
  }, [title]);

  return (
    <div className="details">
      {isLoading && !error && <Loader />}
      {!isLoading && error && <ErrorMessage message={error.message} />}

      {!isLoading && !error && (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt="" />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>&star;</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            {!isThisMovieExistInWatched() && (
              <div className="rating">
                <StarRating
                  maxRating={10}
                  size={21}
                  color="yellow"
                  onSetRating={setUserRating}
                />

                {userRating && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to the list
                  </button>
                )}
              </div>
            )}
            {isThisMovieExistInWatched() && (
              <div className="rating">
                <p>you rated this movie</p>
              </div>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
