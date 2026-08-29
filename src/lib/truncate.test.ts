/**
 * Runnable check for the teaser truncation:
 *   node --test src/lib/truncate.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { truncateWords } from "./truncate.ts";

test("returns text shorter than the limit unchanged", () => {
  assert.equal(truncateWords("one two three", 20), "one two three");
});

test("returns text at exactly the limit unchanged", () => {
  const exact = Array.from({ length: 20 }, (_, i) => `w${i}`).join(" ");
  assert.equal(truncateWords(exact, 20), exact);
});

test("cuts to the limit and appends an ellipsis", () => {
  const long = Array.from({ length: 25 }, (_, i) => `w${i}`).join(" ");
  const out = truncateWords(long, 20);
  assert.equal(out.split(/\s+/).length, 20);
  assert.ok(out.endsWith("…"));
  assert.ok(out.startsWith("w0 w1"));
});

test("does not leave a comma or full stop before the ellipsis", () => {
  assert.equal(truncateWords("alpha beta, gamma", 2), "alpha beta…");
  assert.equal(truncateWords("alpha beta. gamma", 2), "alpha beta…");
});

test("collapses irregular whitespace when counting words", () => {
  assert.equal(truncateWords("  one   two \n three  ", 2), "one two…");
});
