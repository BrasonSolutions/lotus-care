import { fetchLiveJobs } from "@/lib/occupop";
import { RecruitmentRoles } from "./RecruitmentRoles";

/** Server component: fetches live roles for the homepage. Render it inside a
 * Suspense boundary so the page doesn't wait on Occupop. */
export async function HomeRoles() {
  const jobs = await fetchLiveJobs().catch(() => null);
  return <RecruitmentRoles jobs={jobs} />;
}
