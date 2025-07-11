import type React from "react";
import { useState } from "react";

import Services from "../services";
import { useNavigate } from "react-router";

const Init: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    uid: "",
    contestants: "",
    teams: "",
    singlecsv: "",
    doublecsv: "",
    finaltxt: "",
    disableBoard: false,
    enableDynamicScores: false,
    unit: "$",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value as "" | "$",
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Services.games.addGame(
      state.uid,
      state.contestants,
      state.singlecsv,
      state.doublecsv,
      state.finaltxt,
      state.teams || "",
      state.enableDynamicScores,
      state.disableBoard,
      state.unit as "" | "$",
    );
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
              <label htmlFor="disableBoard">Auto-advance (do not show board between questions)</label>
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
              <label htmlFor="enableDynamicScores">Enable Dynamic Scores (show only buzzed-in scores)</label>
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
