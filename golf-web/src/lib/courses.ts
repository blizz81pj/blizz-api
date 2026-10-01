import { GOLF_API_BASE_URL } from "@/lib/api";

export async function fetchCourses(): Promise<string[]> {
  const response = await fetch(`${GOLF_API_BASE_URL}/api/golf-scores/courses`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}
