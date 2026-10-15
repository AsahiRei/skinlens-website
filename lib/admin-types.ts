// ── Admin shared types ────────────────────────────────────────────────────
// Shapes mirror the Supabase schema (clinics, clinic_invite_codes, doctors,
// appointments). No mock data lives here — the panel always reads live data.

export type Clinic = {
  id: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  website: string;
  hours: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  availableToday: boolean;
  isActive: boolean;
};

export type InviteCode = {
  id: string;
  code: string;
  clinicId: string;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
};

export type DoctorAccount = {
  id: string;
  name: string;
  email: string;
  clinicId: string;
  specialty: string;
  registeredAt: string;
  isActive: boolean;
};

export type AppointmentStatus =
  | "requested"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "declined";

export type Appointment = {
  id: string;
  patientName: string;
  clinicId: string;
  clinicName: string;
  doctorName: string | null;
  requestedAt: string;
  scheduledAt: string | null;
  status: AppointmentStatus;
  hasPdf: boolean;
};

/** Random `SKN-XXXXXX` code (used by the generate-code server action). */
export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SKN-${suffix}`;
}
