"use server";

import { redirect } from "next/navigation";
import { buatClientSesiAdmin } from "@/lib/supabase/server";

export async function masukAdmin(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get?.("email");
  const password = data?.get?.("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatClientSesiAdmin();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    return { error: "Email atau password salah." };
  }

  redirect("/admin");
}

export async function keluarAdmin() {
  const supabase = await buatClientSesiAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

