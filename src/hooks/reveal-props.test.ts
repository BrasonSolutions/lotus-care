import { test } from "node:test";
import assert from "node:assert/strict";
import { revealProps, STAGGER_MS } from "./reveal-props.ts";

test("out of view carries no in-view class", () => {
  assert.equal(revealProps("rise").className, "reveal-rise");
});

test("in view adds in-view", () => {
  assert.equal(revealProps("scale", {}, true).className, "reveal-scale in-view");
});

test("index staggers by one unit", () => {
  assert.equal(revealProps("pop", { index: 2 }).style.transitionDelay, `${2 * STAGGER_MS}ms`);
});

test("offset adds to the stagger", () => {
  // HubAndSpoke's spokes: 300ms after the core pops, then staggered.
  assert.equal(revealProps("pop", { index: 2, offsetMs: 300 }).style.transitionDelay, "480ms");
});

test("offset alone needs no index", () => {
  // QualityPillars' foundation line.
  assert.equal(revealProps("fade", { offsetMs: 750 }).style.transitionDelay, "750ms");
});

test("zero delay sets no transitionDelay", () => {
  assert.deepEqual(revealProps("rise", { index: 0 }).style, {});
});

test("effect is exposed for the Storybook decorator", () => {
  assert.equal(revealProps("pop")["data-reveal-effect"], "pop");
});
