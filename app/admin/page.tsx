import { Suspense } from "react";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { TriangleAlert } from "lucide-react";
import { SplashScreen } from "@/components/SplashScreen";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";
import { getAdminCookieName, verifyAdminToken } from "@/lib/admin-session";
import { getAdminData, type AdminData } from "@/lib/admin-db";

export default function AdminPage() {
  return (
    <Suspense fallback={<SplashScreen persistent />}>
      <AdminGate />
    </Suspense>
  );
}

// Request-time session read must stream behind a Suspense boundary
// when Cache Components is enabled. Token expiry uses Date.now(), which
// changes between renders — connection() stops prerendering here so the
// check only runs at request time.
async function AdminGate() {
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;
  const authed = verifyAdminToken(token);

  if (!authed) {
    return <AdminLogin />;
  }

  let data: AdminData | null = null;
  let loadError: string | null = null;
  try {
    data = await getAdminData();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load data.";
  }

  if (!data) {
    return <AdminDataError message={loadError ?? "Could not load data."} />;
  }

  return (
    <AdminDashboard
      initialClinics={data.clinics}
      initialCodes={data.codes}
      initialDoctors={data.doctors}
      initialAppointments={data.appointments}
    />
  );
}

function AdminDataError({ message }: { message: string }) {
  return (
    <div className="hero-wash min-h-screen flex items-center justify-center px-4 sm:px-6 py-14">
      <div className="w-full max-w-md bg-white rounded-[20px] p-6 sm:p-8 border border-[#E5EDE8] shadow-xs text-center">
        <span className="mx-auto w-12 h-12 rounded-full bg-[#FEF3F2] text-[#B42318] flex items-center justify-center">
          <TriangleAlert size={24} />
        </span>
        <h1 className="font-display text-[22px] font-semibold text-[#10241A] tracking-tight mt-4">
          Can&apos;t reach the database
        </h1>
        <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-2">
          {message}
        </p>
        <div className="text-left text-[13px] leading-[20px] text-[#3F4A44] mt-4 rounded-[16px] bg-[#F4F7F5] border border-[#E5EDE8] p-4">
          <p className="font-semibold text-[#10241A]">To fix:</p>
          <ol className="list-decimal pl-5 mt-1 space-y-1">
            <li>Run migrations 0002 + 0003 in the Supabase SQL Editor.</li>
            <li>
              Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in
              .env.local.
            </li>
            <li>Restart the dev server.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
