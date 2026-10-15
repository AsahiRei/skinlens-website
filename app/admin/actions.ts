"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAdminToken,
  getAdminCookieName,
  isAdminPassword,
} from "@/lib/admin-session";

const ADMIN_PATH = "/admin";

export async function adminLogin(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Enter the admin password." };
  }

  if (!isAdminPassword(password)) {
    // Generic message — don't reveal whether a password is configured.
    return { error: "Wrong password. Try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set(getAdminCookieName(), createAdminToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: ADMIN_PATH,
    maxAge: 12 * 60 * 60,
  });

  redirect(ADMIN_PATH);
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(getAdminCookieName());
  redirect(ADMIN_PATH);
}
