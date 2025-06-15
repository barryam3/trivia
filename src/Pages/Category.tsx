import type React from "react";
import Services from "../services";
import { useLocation, useNavigate, useParams } from "react-router";

function useCategoryParams() {
  const params = useParams<"category" | "round">();
  return { category: Number(params.category), round: Number(params.round) };
}

function useCategory() {
  const round = Services.games.useRound();
  const params = useCategoryParams();
  return round?.categories[params.category];
}

const Category: React.FC = () => {
  const game = Services.games.useGame();
  const round = Services.games.useRound();
  const category = useCategory();
  const params = useCategoryParams();
  const navigate = useNavigate();
  const leader = Services.games.useLeader();
  const { search } = useLocation();
  const isLastCateogry =
    params.category === (round?.categories.length ?? 0) - 1;
  // If board is enabled, display all questions, then go to board.
  // If board is disabled, go to the first question in the category.
  const goToNext = () => {
    if (game.disableBoard && params.category >= 0) {
      // To next question.
      navigate({ pathname: `../${params.category}/0`, search });
    } else if (isLastCateogry) {
      // Go to Board.
      navigate({ pathname: "..", search });
    } else {
      // Go to next Category.
      navigate({ pathname: `../${params.category + 1}`, search });
    }
  };
  return (
    <div id="question">
      {params.category >= 0 ? (
        <div className="finalheader">{category?.title}</div>
      ) : (
        <div className="finalheader">
          {params.round === 1 ? "Jeopardy" : "Double Jeopardy"}
        </div>
      )}
      {leader && (
        <button id="nextbutton" onClick={goToNext} type="button">
          {isLastCateogry ? "Show Board" : "Show Next Category"}
        </button>
      )}
    </div>
  );
};

export default Category;
