import type React from "react";
import { useState } from "react";

import Services from "../services";
import { useNavigate } from "react-router-dom";

const Init: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    uid: "",
    contestants: "",
    singlecsv: "",
    doublecsv: "",
    finaltxt: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Services.games.addGame(
      state.uid,
      state.contestants,
      state.singlecsv,
      state.doublecsv,
      state.finaltxt
    );
    window.open(`/game/${state.uid}/1`);
    navigate(`/game/${state.uid}/1?leader=true`);
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
