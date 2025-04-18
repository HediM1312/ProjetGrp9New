import { useState } from "react";
import useHorses from "./hooks/useHorses";
import DisplayCards from "./components/ui/DisplayCards";
import { Sparkles } from "lucide-react";
import { ShimmerButton } from "./components/ui/shimmer-button"; // adapte le chemin selon ton projet

function App() {
  const [showCards, setShowCards] = useState(false);
  const horses = useHorses();

  const cards = horses.map((horse) => ({
    icon: <Sparkles className="icon" />,
    title: horse.nom,
    description: `Cote : ${horse.cote}`,
    date: `Course : ${horse.course}`,
    iconClassName: "icon-blue",
    titleClassName: "title-blue",
    className: "",
  }));

  const handleClick = () => {
    setShowCards(true);
  };

  return (
    <div className="app">
      <h1>Top 5 Chevaux de course 🏇</h1>

      {!showCards ? (
        <div className="button-container">
          <ShimmerButton className="shadow-2xl" onClick={handleClick}>
            <span className="text-white text-lg font-medium">
              Voir les chevaux
            </span>
          </ShimmerButton>
        </div>
      ) : (
        <DisplayCards cards={cards} />
      )}
    </div>
  );
}

export default App;
