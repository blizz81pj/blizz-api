export type GolfScoreEvent = {
  roundId: number | null;
  course: string | null;
  scorecardId: number | null;
  teeType: string | null;
  scorecardType: string | null;
  handicapType: string | null;
  handicap: number | null;
  holeId: number | null;
  holeNumber: number | null;
  par: number | null;
  strokeIndex: number | null;
  score: number | null;
  putts: number | null;
  driveResult: string | null;
  penaltyStrokes: number | null;
  bunkerHit: string | null;
  netScore: number | null;
  strokesTaken: number | null;
  dateInserted: string | null;
};

export type HoleFormRow = {
  holeNumber: string;
  par: string;
  strokeIndex: string;
  score: string;
  putts: string;
  driveResult: string;
  penaltyStrokes: string;
  bunkerHit: string;
  netScore: string;
  strokesTaken: string;
};

export type RoundFormState = {
  course: string;
  scorecardId: string;
  teeType: string;
  scorecardType: string;
  handicapType: string;
  handicap: string;
  dateInserted: string;
  holes: HoleFormRow[];
};

export function emptyHole(holeNumber: number): HoleFormRow {
  return {
    holeNumber: String(holeNumber),
    par: "",
    strokeIndex: "",
    score: "",
    putts: "",
    driveResult: "",
    penaltyStrokes: "",
    bunkerHit: "",
    netScore: "",
    strokesTaken: "",
  };
}

export function emptyRoundForm(holeCount = 18): RoundFormState {
  return {
    course: "",
    scorecardId: "",
    teeType: "",
    scorecardType: "",
    handicapType: "",
    handicap: "",
    dateInserted: "",
    holes: Array.from({ length: holeCount }, (_, i) => emptyHole(i + 1)),
  };
}

function asNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function asString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function roundFormToEvents(form: RoundFormState): GolfScoreEvent[] {
  return form.holes.map((hole) => ({
    roundId: null,
    course: asString(form.course),
    scorecardId: asNumber(form.scorecardId),
    teeType: asString(form.teeType),
    scorecardType: asString(form.scorecardType),
    handicapType: asString(form.handicapType),
    handicap: asNumber(form.handicap),
    holeId: null,
    holeNumber: asNumber(hole.holeNumber),
    par: asNumber(hole.par),
    strokeIndex: asNumber(hole.strokeIndex),
    score: asNumber(hole.score),
    putts: asNumber(hole.putts),
    driveResult: asString(hole.driveResult),
    penaltyStrokes: asNumber(hole.penaltyStrokes),
    bunkerHit: asString(hole.bunkerHit),
    netScore: asNumber(hole.netScore),
    strokesTaken: asNumber(hole.strokesTaken),
    dateInserted: asString(form.dateInserted),
  }));
}

export function eventsToRoundForm(events: GolfScoreEvent[]): RoundFormState {
  const first = events[0];
  if (!first) {
    return emptyRoundForm();
  }

  return {
    course: first.course ?? "",
    scorecardId: first.scorecardId != null ? String(first.scorecardId) : "",
    teeType: first.teeType ?? "",
    scorecardType: first.scorecardType ?? "",
    handicapType: first.handicapType ?? "",
    handicap: first.handicap != null ? String(first.handicap) : "",
    dateInserted: first.dateInserted ?? "",
    holes: events.map((event, index) => ({
      holeNumber:
        event.holeNumber != null ? String(event.holeNumber) : String(index + 1),
      par: event.par != null ? String(event.par) : "",
      strokeIndex: event.strokeIndex != null ? String(event.strokeIndex) : "",
      score: event.score != null ? String(event.score) : "",
      putts: event.putts != null ? String(event.putts) : "",
      driveResult: event.driveResult ?? "",
      penaltyStrokes:
        event.penaltyStrokes != null ? String(event.penaltyStrokes) : "",
      bunkerHit: event.bunkerHit ?? "",
      netScore: event.netScore != null ? String(event.netScore) : "",
      strokesTaken:
        event.strokesTaken != null ? String(event.strokesTaken) : "",
    })),
  };
}
