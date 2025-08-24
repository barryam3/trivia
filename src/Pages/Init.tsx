import type React from "react";
import { useState } from "react";

import Services from "../services";
import { useNavigate } from "react-router";

const Init: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    uid: "",
    gameTitle: "Jeopardy!",
    contestants: "",
    teams: "",
    singlecsv: "",
    doublecsv: "",
    finaltxt: "",
    disableBoard: false,
    enableDynamicScores: false,
    penalties: "scaling",
    unit: "$",
    scorekeepingWebhook: "",
    multiplier: 200,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: Number(event.target.value),
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.checked,
      };
    });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value as "" | "$",
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Services.games.addGame(state.uid, {
      title: state.gameTitle,
      contestants: state.contestants,
      singlecsv: state.singlecsv,
      doublecsv: state.doublecsv,
      finaltxt: state.finaltxt,
      teamsCSV: state.teams || "",
      enableDynamicScores: state.enableDynamicScores,
      disableBoard: state.disableBoard,
      flatPenalties: state.penalties === "flat",
      unit: state.unit as "" | "$",
      scorekeepingWebhook: state.scorekeepingWebhook,
      multiplier: state.multiplier,
    });
    window.open(`/game/${state.uid}/1/-1`);
    navigate(`/game/${state.uid}/1/-1?leader=true`);
  };

  return (
    <form id="init" onSubmit={handleSubmit}>
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="uid">uid</label>
            </td>
            <td>
              <input
                id="uid"
                type="text"
                name="uid"
                value={state.uid}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="gameTitle">Game Title:</label>
            </td>
            <td>
              <input
                id="gameTitle"
                type="text"
                name="gameTitle"
                value={state.gameTitle}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="contestants">Contestant Names .csv:</label>
            </td>
            <td>
              <textarea
                id="contestants"
                name="contestants"
                value={state.contestants}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="teams">Teams .csv:</label>
            </td>
            <td>
              <textarea
                id="teams"
                name="teams"
                value={state.teams}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="singlecsv">Single Jeopardy .csv:</label>
            </td>
            <td>
              <textarea
                id="singlecsv"
                name="singlecsv"
                value={state.singlecsv}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="doublecsv">Double Jeopardy .csv:</label>
            </td>
            <td>
              <textarea
                id="doublecsv"
                name="doublecsv"
                value={state.doublecsv}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="finaltxt">Final Jeopardy .txt:</label>
            </td>
            <td>
              <textarea
                id="finaltxt"
                name="finaltxt"
                value={state.finaltxt}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="disableBoard">
                Auto-advance (do not show board between questions)
              </label>
            </td>
            <td>
              <input
                id="disableBoard"
                type="checkbox"
                name="disableBoard"
                checked={state.disableBoard}
                onChange={handleCheckboxChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="enableDynamicScores">
                Enable Dynamic Scores (show only buzzed-in scores)
              </label>
            </td>
            <td>
              <input
                id="enableDynamicScores"
                type="checkbox"
                name="enableDynamicScores"
                checked={state.enableDynamicScores}
                onChange={handleCheckboxChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="penalties">Penalties</label>
            </td>
            <td>
              <select
                id="penalties"
                name="penalties"
                value={state.penalties.toString()}
                onChange={handleSelectChange}
              > 
                <option value="flat">Flat</option>
                <option value="scaling">Scaling</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="unit">Score Unit</label>
            </td>
            <td>
              <select
                id="unit"
                name="unit"
                value={state.unit}
                onChange={handleSelectChange}
              >
                <option value="$">Dollars</option>
                <option value="">Points</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="scorekeepingWebhook">Scorekeeping Webhook:</label>
            </td>
            <td>
              <input
                id="scorekeepingWebhook"
                type="text"
                name="scorekeepingWebhook"
                value={state.scorekeepingWebhook}
                onChange={handleChange}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="multiplier">Lowest question value:</label>
            </td>
            <td>
              <input
                id="multiplier"
                type="number"
                name="multiplier"
                value={state.multiplier}
                onChange={handleNumberChange}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <input type="submit" value="Submit" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default Init;
