import { Suspense } from "react";
import CourseScoringSummaryWidget, {
  CourseScoringSummaryWidgetSkeleton,
} from "@/components/CourseScoringSummaryWidget";
import LastRoundsWidget, {
  LastRoundsWidgetSkeleton,
} from "@/components/LastRoundsWidget";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-[#14532d]">
        Golf Stats
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[#3d4f3e]">
        Your recent rounds and how you score on each hole, course by course.
        Use the menu to browse every round, check the Hall of Fame, or enter a
        new round.
      </p>

      <div className="mt-10 space-y-6">
        <Suspense fallback={<LastRoundsWidgetSkeleton count={5} />}>
          <LastRoundsWidget count={5} />
        </Suspense>
        <Suspense fallback={<CourseScoringSummaryWidgetSkeleton />}>
          <CourseScoringSummaryWidget />
        </Suspense>
      </div>
    </main>
  );
}
