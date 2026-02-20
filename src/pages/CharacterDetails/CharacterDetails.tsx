import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
  FaFilm,
  FaGlobe,
} from "react-icons/fa";
import { GiDna1, GiPerson } from "react-icons/gi";
import {
  fetchCharacter,
  fetchFilm,
  fetchPlanet,
  fetchSpecies,
} from "../../services/api";
import { useApp } from "../../context/AppContext";
import type { Character, Film, Planet, Species } from "../../types";

interface AttrProps {
  label: string;
  value: string | null | undefined;
}

const Attr = ({ label, value }: AttrProps) => {
  if (!value || value === "unknown" || value === "n/a") return null;
  return (
    <div className="flex justify-between items-baseline gap-4 text-sm">
      <span className="text-muted capitalize flex-shrink-0">{label}</span>
      <span className="font-medium capitalize text-right break-words">
        {value}
      </span>
    </div>
  );
};

const Card = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-surface border border-border rounded-xl p-6 animate-fade-in">
    <h2 className="flex items-center gap-2 font-orbitron text-[0.7rem] uppercase tracking-[2px] text-accent mb-5 pb-3.5 border-b border-border">
      {icon} {title}
    </h2>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

const CharacterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useApp();

  const [character, setCharacter] = useState<Character | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [homeworld, setHomeworld] = useState<Planet | null>(null);
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const char = await fetchCharacter(id);
        if (cancelled) return;
        setCharacter(char);
        const [filmsData, homeworldData, speciesData] = await Promise.all([
          Promise.all(char.films.map((url) => fetchFilm(url))),
          char.homeworld ? fetchPlanet(char.homeworld) : Promise.resolve(null),
          Promise.all(char.species.map((url) => fetchSpecies(url))),
        ]);
        if (!cancelled) {
          setFilms(filmsData);
          setHomeworld(homeworldData);
          setSpecies(speciesData);
        }
      } catch {
        if (!cancelled)
          setError("Failed to load character details. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-muted text-sm tracking-wide">
        <div className="w-12 h-12 rounded-full border-[3px] border-border border-t-accent animate-spin-fast" />
        <p>Accessing galactic records…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 my-8 p-6 text-center text-danger bg-danger/10 border border-danger/30 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  if (!character) return null;

  const favorited = isFavorite(character.url);
  const sortedFilms = [...films].sort((a, b) => a.episode_id - b.episode_id);

  const toggleFavorite = () => {
    if (favorited) removeFavorite(character.url);
    else addFavorite(character);
  };

  return (
    <div className="animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted text-sm mb-8 px-3 py-1.5 rounded-lg hover:text-accent hover:bg-accent/10 transition-all"
      >
        <FaArrowLeft /> Back
      </button>

      {/* Hero */}
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 p-6 sm:p-8 mb-8 bg-surface border border-border rounded-xl overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="relative w-[90px] h-[90px] rounded-full bg-surface-2 border-[3px] border-accent flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,232,31,0.25)]">
          <GiPerson className="text-5xl text-accent" />
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 font-orbitron text-[0.6rem] bg-accent text-black px-2 py-0.5 rounded font-bold whitespace-nowrap">
            #{id}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-orbitron text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            {character.name}
          </h1>
          <button
            onClick={toggleFavorite}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 text-sm font-semibold transition-all ${
              favorited
                ? "border-danger text-danger bg-danger/10"
                : "border-border hover:border-danger hover:text-danger hover:bg-danger/10"
            }`}
          >
            {favorited ? <FaHeart /> : <FaRegHeart />}
            {favorited ? "Remove from Favourites" : "Add to Favourites"}
          </button>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <Card title="Physical" icon={<GiPerson />}>
          <Attr
            label="Height"
            value={
              character.height !== "unknown" ? `${character.height} cm` : null
            }
          />
          <Attr
            label="Mass"
            value={character.mass !== "unknown" ? `${character.mass} kg` : null}
          />
          <Attr label="Hair color" value={character.hair_color} />
          <Attr label="Skin color" value={character.skin_color} />
          <Attr label="Eye color" value={character.eye_color} />
          <Attr label="Birth year" value={character.birth_year} />
          <Attr label="Gender" value={character.gender} />
        </Card>

        {homeworld && (
          <Card title="Homeworld" icon={<FaGlobe />}>
            <Attr label="Name" value={homeworld.name} />
            <Attr label="Climate" value={homeworld.climate} />
            <Attr label="Terrain" value={homeworld.terrain} />
            <Attr label="Gravity" value={homeworld.gravity} />
            <Attr
              label="Population"
              value={
                homeworld.population !== "unknown"
                  ? parseInt(homeworld.population, 10).toLocaleString()
                  : null
              }
            />
            <Attr
              label="Diameter"
              value={
                homeworld.diameter !== "unknown"
                  ? `${parseInt(homeworld.diameter, 10).toLocaleString()} km`
                  : null
              }
            />
          </Card>
        )}

        {species.length > 0 && (
          <Card title="Species" icon={<GiDna1 />}>
            {species.map((sp) => (
              <div key={sp.url} className="flex flex-col gap-3">
                <Attr label="Name" value={sp.name} />
                <Attr label="Classification" value={sp.classification} />
                <Attr label="Designation" value={sp.designation} />
                <Attr label="Language" value={sp.language} />
                <Attr
                  label="Avg. lifespan"
                  value={
                    sp.average_lifespan !== "unknown"
                      ? `${sp.average_lifespan} yrs`
                      : null
                  }
                />
              </div>
            ))}
          </Card>
        )}

        {sortedFilms.length > 0 && (
          <div className="bg-surface border border-border rounded-xl p-6 md:col-span-2 xl:col-span-3 animate-fade-in">
            <h2 className="flex items-center gap-2 font-orbitron text-[0.7rem] uppercase tracking-[2px] text-accent mb-5 pb-3.5 border-b border-border">
              <FaFilm /> Films ({sortedFilms.length})
            </h2>
            <div className="flex flex-col gap-4">
              {sortedFilms.map((film) => (
                <div
                  key={film.url}
                  className="flex flex-col md:flex-row gap-4 p-4 bg-surface-2 rounded-lg border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="bg-accent text-black px-3 py-1 rounded-full font-orbitron text-[0.7rem] font-bold whitespace-nowrap h-fit flex-shrink-0 w-fit">
                    Ep. {film.episode_id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1">
                      {film.title}
                    </h3>
                    <p className="text-muted text-xs mb-2">
                      Directed by {film.director} &bull; {film.release_date}
                    </p>
                    <p className="text-muted text-[0.8rem] italic leading-relaxed">
                      {film.opening_crawl
                        .replace(/\r\n/g, " ")
                        .slice(0, 220)
                        .trimEnd()}
                      …
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetails;
