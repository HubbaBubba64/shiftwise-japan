import { describe, expect, it } from "vitest";
import { normalizeSiteUrl } from "./site";

describe("production site origin", () => {
  it("normalizes a production HTTPS origin", () => {
    expect(normalizeSiteUrl("https://shiftwise.example/", true)).toBe("https://shiftwise.example");
  });

  it.each([
    "http://shiftwise.example",
    "https://shiftwise.example/path",
    "https://shiftwise.example?preview=true",
    "https://user:secret@shiftwise.example",
    "not-a-url",
  ])("rejects an unsafe production value: %s", (value) => {
    expect(() => normalizeSiteUrl(value, true)).toThrow();
  });

  it.each(["http://localhost:3000", "https://127.0.0.1:3000", "https://[::1]"])(
    "rejects a local production origin: %s",
    (value) => expect(() => normalizeSiteUrl(value, true)).toThrow(/localhost origin/),
  );
});
