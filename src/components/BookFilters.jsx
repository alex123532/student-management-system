// Search box + genre filter (+ optional "low stock only" toggle), reused by the
// Dashboard and the Books page.
export default function BookFilters({ query, onQuery, genre, onGenre, genres, lowOnly, onLowOnly }) {
  return (
    <div className="filters">
      <div className="filters__item filters__item--grow">
        <label htmlFor="filter-query">Search</label>
        <input
          id="filter-query"
          type="search"
          placeholder="Title, author or ISBN"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>
      <div className="filters__item">
        <label htmlFor="filter-genre">Genre</label>
        <select id="filter-genre" value={genre} onChange={(e) => onGenre(e.target.value)}>
          <option value="">All genres</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      {onLowOnly && (
        <label className="check" htmlFor="filter-low">
          <input id="filter-low" type="checkbox" checked={lowOnly} onChange={(e) => onLowOnly(e.target.checked)} />
          Low stock only
        </label>
      )}
    </div>
  );
}
