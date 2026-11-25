// Fridge Roast: One Line, Biggest Laugh — make.fun entry
// (u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb)
//
// Writes a single-line roast of a smart fridge to /output/entry.txt.
//
// The roast is built from three beats, following the winning one-liner
// pattern: the appliance does a literal, forbidden ACTION, then a second
// twist lands in the final words. Beat 1 (the setup, a real smart-fridge
// feature): a firmware update. Beat 2 (the escalation): the fridge forgets
// what cold is. Beat 3 (the kicker, an action by the fridge): the ice
// maker dispenses soup. No grocery-ordering crack, no watching-you crack —
// both are the obvious angles the judge's criterion 5 penalises.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const SETUP = "My smart fridge installed a firmware update,";
const ESCALATION = "forgot what cold is,";
const KICKER = "and now the ice maker dispenses soup.";

function buildLine(): string {
  // One line, one reading: the three beats join with single spaces and the
  // repeated appliance logic carries the joke — the update breaks the one
  // thing a fridge must do, and the ice maker proves it in the last words.
  const beats = [SETUP, ESCALATION, KICKER];
  return beats.join(" ").replace(/\s+/g, " ").trim();
}

function gate(line: string): void {
  // The sealed gate: UTF-8 text of 1 to 200 characters, not only whitespace,
  // on a single line. Fail loudly here rather than shipping an invalid entry.
  if (line.length < 1 || line.length > 200) {
    throw new Error(`entry length ${line.length} outside the 1-200 gate`);
  }
  if (!line.trim() || line.includes("\n")) {
    throw new Error("entry must be one non-blank line");
  }
  // No trailing whitespace: a stray space before the newline would make the
  // file's bytes differ from the line the judge reads.
  if (line !== line.trimEnd()) {
    throw new Error("entry must not end with whitespace");
  }
  // Bytes matter for the size tie-break, so keep the line ASCII-tight:
  // every character here is one byte, and the count must match the length.
  const bytes = Buffer.byteLength(line, "utf8");
  if (bytes !== line.length) {
    throw new Error(`entry has multi-byte chars (${bytes} bytes vs ${line.length} chars)`);
  }
}

const line = buildLine();
gate(line);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, line + "\n", "utf8");

// Read-back round trip: the file on disk must be exactly the gated line.
const back = readFileSync(`${outDir}/entry.txt`, "utf8").trimEnd();
if (back !== line) {
  throw new Error("read-back mismatch: entry.txt does not match the gated line");
}
console.log(`wrote ${line.length} chars to ${outDir}/entry.txt`);
console.log(line);
