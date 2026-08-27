/**
 * Runnable check for the form validator:
 *   node --test src/lib/forms.test.ts
 * No test framework — Node's built-in runner strips the types itself.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { validateSubmission } from "./forms.ts";

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
