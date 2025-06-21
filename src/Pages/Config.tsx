import type React from "react";
import { useState } from "react";

import configServices from "../services/configServices";

const Config: React.FC = () => {
  const [state, setState] = useState(configServices.getConfig());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    configServices.setConfig(state);
  };

  return (
    <form id="config" onSubmit={handleSubmit}>
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor="pinMappings">Pin Mappings</label>
            </td>
            <td>
              <input
                id="pinMappings"
                type="text"
                name="pinMappings"
                value={JSON.stringify(state.pinMappings)}
                onChange={(event) => {
                  setState((prevState) => ({
                    ...prevState,
                    pinMappings: JSON.parse(event.target.value),
                  }));
                }}
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

export default Config;
