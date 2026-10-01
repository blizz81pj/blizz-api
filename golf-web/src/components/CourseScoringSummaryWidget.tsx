import CourseScoringSummary from "@/components/CourseScoringSummary";
import { fetchCourses } from "@/lib/courses";

export default async function CourseScoringSummaryWidget() {
  let courses: string[] = [];
  let loadError: string | undefined;

  try {
    courses = await fetchCourses();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load courses.";
  }

  return <CourseScoringSummary courses={courses} loadError={loadError} />;
}

export function CourseScoringSummaryWidgetSkeleton() {
  return (
    <section className="rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
        Course Scoring Summary
      </h2>
      <p className="mt-4 text-sm text-[#5b6a5c]">Loading courses…</p>
    </section>
  );
}
