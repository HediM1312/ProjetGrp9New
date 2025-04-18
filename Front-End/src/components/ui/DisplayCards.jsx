import "./DisplayCards.css";

function DisplayCards({ cards }) {
  return (
    <div className="cards-container">
      {cards.map((card, idx) => (
        <div key={idx} className={`card ${card.className}`}>
          <div className={`icon ${card.iconClassName}`}>{card.icon}</div>
          <h2 className={`title ${card.titleClassName}`}>{card.title}</h2>
          <p className="description">{card.description}</p>
          <span className="date">{card.date}</span>
        </div>
      ))}
    </div>
  );
}

export default DisplayCards;
