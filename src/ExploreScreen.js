import './ExploreScreen.css';

function ExploreScreen({ data }) {
  const categories = Array.from(new Set(data.map(d => d.category).filter(Boolean)));
  const counts = categories.map(cat => ({
    cat,
    count: data.filter(d => d.category === cat).length,
  }));

  return (
    <div className="Explore">
      <h1>Explore</h1>
      <p>Browse restaurants by category:</p>
      <div className="CategoryGrid">
        {counts.map(({ cat, count }) => (
          <div key={cat} className="CatCard">
            <div className="cat-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
            <div className="cat-count">{count} places</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreScreen;
