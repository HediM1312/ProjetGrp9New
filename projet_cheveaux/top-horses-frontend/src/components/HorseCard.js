import "./HorseCard.css";

function HorseCard({ horse }) {
  return (
    <div className="horse-card">
      <h2>{horse.nom}</h2>
      <p>Cote : {horse.cote}</p>
      <p>Course : {horse.course}</p>
    </div>
  );
}

export default HorseCard;
