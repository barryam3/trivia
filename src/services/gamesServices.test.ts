import { getGameView } from "./gamesServices";

describe("getGameView", () => {
  it.each(["host", "contestant", "stream"] as const)(
    "parses the %s view",
    (view) => {
      expect(getGameView(`?view=${view}`)).toBe(view);
    }
  );

  it.each(["", "?view=unknown", "?leader=true"])(
    "falls back to contestant for %s",
    (search) => {
      expect(getGameView(search)).toBe("contestant");
    }
  );
});
