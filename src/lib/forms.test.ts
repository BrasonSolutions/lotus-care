/**
 * Runnable check for the form validator:
 *   node --test src/lib/forms.test.ts
 * No test framework — Node's built-in runner strips the types itself.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { feedbackCategories, validateSubmission } from "./forms.ts";

const valid = {
  kind: "referral",
  name: "  Mary Quinn ",
  email: "mary@example.ie",
  message: "  Referral details.  ",
};

test("accepts a valid submission and trims it", () => {
  const result = validateSubmission(valid);
  assert.equal(result.ok, true);
  assert.deepEqual(result.ok && result.data, {
    kind: "referral",
    name: "Mary Quinn",
    email: "mary@example.ie",
    message: "Referral details.",
    extra: {},
  });
});

test("rejects a filled honeypot", () => {
  const result = validateSubmission({ ...valid, website: "http://spam.example" });
  assert.equal(result.ok, false);
});

test("rejects an unknown form kind", () => {
  const result = validateSubmission({ ...valid, kind: "payroll" });
  assert.equal(result.ok, false);
});

test("rejects missing or malformed fields", () => {
  for (const bad of [
    { ...valid, name: "   " },
    { ...valid, email: "not-an-email" },
    { ...valid, message: "" },
    { ...valid, message: "x".repeat(5001) },
    "not an object",
  ]) {
    assert.equal(validateSubmission(bad).ok, false);
  }
});

test("keeps only non-empty extra answers", () => {
  const result = validateSubmission({
    ...valid,
    kind: "recruitment",
    extra: { role: " Staff Nurse ", source: "  " },
  });
  assert.deepEqual(result.ok && result.data.extra, { role: "Staff Nurse" });
});

test("feedback kind accepts a blank name and email", () => {
  const result = validateSubmission({
    kind: "feedback",
    name: "",
    email: "",
    message: "Something worth flagging.",
    extra: { category: feedbackCategories[0] },
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.ok && result.data, {
    kind: "feedback",
    name: "",
    email: "",
    message: "Something worth flagging.",
    extra: { category: feedbackCategories[0] },
  });
});

test("feedback kind still validates a provided email", () => {
  const result = validateSubmission({
    kind: "feedback",
    email: "not-an-email",
    message: "Something worth flagging.",
    extra: { category: feedbackCategories[0] },
  });
  assert.equal(result.ok, false);
});

test("feedback kind rejects a missing category", () => {
  const result = validateSubmission({
    kind: "feedback",
    message: "Something worth flagging.",
  });
  assert.equal(result.ok, false);
});

test("feedback kind rejects a category outside the configured list", () => {
  const result = validateSubmission({
    kind: "feedback",
    message: "Something worth flagging.",
    extra: { category: "Not a real category" },
  });
  assert.equal(result.ok, false);
});

test("other kinds still require name and email", () => {
  const result = validateSubmission({
    kind: "contact",
    name: "",
    email: "",
    message: "Hello",
  });
  assert.equal(result.ok, false);
});
