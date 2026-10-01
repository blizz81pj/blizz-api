import type { GolfScoreEvent } from "@/lib/golfScore";

export type ParsedSwingURound = {
  roundId: string;
  course: string;
  dateInserted: string;
  events: GolfScoreEvent[];
};

const COLUMN_MAP: Record<string, keyof GolfScoreEvent> = {
  "round id": "roundId",
  course: "course",
  "scorecard id": "scorecardId",
  "tee type": "teeType",
  "scorecard type": "scorecardType",
  "handicap type": "handicapType",
  handicap: "handicap",
  "hole id": "holeId",
  "hole number": "holeNumber",
  par: "par",
  "stroke index": "strokeIndex",
  score: "score",
  putts: "putts",
  "drive result": "driveResult",
  "penalty strokes": "penaltyStrokes",
  "bunker hit": "bunkerHit",
  "net score": "netScore",
  "strokes taken": "strokesTaken",
  "date inserted": "dateInserted",
};

const NUMBER_FIELDS: Array<keyof GolfScoreEvent> = [
  "roundId",
  "scorecardId",
  "handicap",
  "holeId",
  "holeNumber",
  "par",
  "strokeIndex",
  "score",
  "putts",
  "penaltyStrokes",
  "netScore",
  "strokesTaken",
];

export function parseCsvRecords(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const input = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      field = "";
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

export function normalizeDateInserted(value: string | null): string | null {
  if (!value) {
    return null;
  }
  const withoutZ = value.replace(/Z$/i, "").trim();
  const match = withoutZ.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
  return match ? match[1] : withoutZ || null;
}

function parseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function csvRowsToEvents(rows: string[][]): GolfScoreEvent[] {
  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const events: GolfScoreEvent[] = [];

  for (const values of rows.slice(1)) {
    const event: GolfScoreEvent = {
      roundId: null,
      course: null,
      scorecardId: null,
      teeType: null,
      scorecardType: null,
      handicapType: null,
      handicap: null,
      holeId: null,
      holeNumber: null,
      par: null,
      strokeIndex: null,
      score: null,
      putts: null,
      driveResult: null,
      penaltyStrokes: null,
      bunkerHit: null,
      netScore: null,
      strokesTaken: null,
      dateInserted: null,
    };

    headers.forEach((header, index) => {
      const field = COLUMN_MAP[header];
      if (!field) {
        return;
      }

      const raw = values[index] ?? "";
      if (NUMBER_FIELDS.includes(field)) {
        event[field] = parseNumber(raw) as never;
      } else if (field === "dateInserted") {
        event.dateInserted = normalizeDateInserted(parseString(raw));
      } else {
        event[field] = parseString(raw) as never;
      }
    });

    events.push(event);
  }

  return events;
}

export function groupEventsByRound(events: GolfScoreEvent[]): ParsedSwingURound[] {
  const rounds: ParsedSwingURound[] = [];
  const byKey = new Map<string, ParsedSwingURound>();

  for (const event of events) {
    const roundId =
      event.roundId != null
        ? String(event.roundId)
        : event.scorecardId != null
          ? `scorecard-${event.scorecardId}`
          : `row-${rounds.length}`;

    let round = byKey.get(roundId);
    if (!round) {
      round = {
        roundId,
        course: event.course ?? "Unknown course",
        dateInserted: event.dateInserted ?? "",
        events: [],
      };
      byKey.set(roundId, round);
      rounds.push(round);
    }

    round.events.push({
      ...event,
      roundId: null,
      holeId: null,
    });
  }

  return rounds;
}

export function parseSwingUCsv(text: string): ParsedSwingURound[] {
  const rows = parseCsvRecords(text);
  const events = csvRowsToEvents(rows);
  return groupEventsByRound(events);
}
