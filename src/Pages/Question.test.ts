import {
  shouldMuteQuestionMedia,
  shouldRenderAnswer,
  shouldRenderQuestionPart,
} from "./Question";

describe("question presentation by view", () => {
  it("renders unrevealed question parts only for host and stream", () => {
    expect(shouldRenderQuestionPart("host", false)).toBe(true);
    expect(shouldRenderQuestionPart("contestant", false)).toBe(false);
    expect(shouldRenderQuestionPart("stream", false)).toBe(true);
  });

  it("renders revealed question parts in every view", () => {
    expect(shouldRenderQuestionPart("host", true)).toBe(true);
    expect(shouldRenderQuestionPart("contestant", true)).toBe(true);
    expect(shouldRenderQuestionPart("stream", true)).toBe(true);
  });

  it("keeps unrevealed answers exclusive to the host", () => {
    expect(shouldRenderAnswer("host", false)).toBe(true);
    expect(shouldRenderAnswer("contestant", false)).toBe(false);
    expect(shouldRenderAnswer("stream", false)).toBe(false);
  });

  it("renders revealed answers in every view", () => {
    expect(shouldRenderAnswer("host", true)).toBe(true);
    expect(shouldRenderAnswer("contestant", true)).toBe(true);
    expect(shouldRenderAnswer("stream", true)).toBe(true);
  });

  it("mutes host and stream media but autoplays contestant media", () => {
    expect(shouldMuteQuestionMedia("host")).toBe(true);
    expect(shouldMuteQuestionMedia("contestant")).toBe(false);
    expect(shouldMuteQuestionMedia("stream")).toBe(true);
  });
});
