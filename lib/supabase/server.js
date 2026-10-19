import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat koneksi Supabase di sisi server menggunakan secret key.
 * Digunakan untuk membaca data publik (seperti katalog & detail produk)
 * yang melewati proteksi RLS tanpa mengekspos kunci ke browser.
 */
export function buatClientServer() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY harus diatur di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createClient = buatClientServer;

/**
 * Membuat koneksi Supabase di sisi server untuk sesi admin.
 * Menggunakan publishable key dan cookie login (@supabase/ssr).
 * Digunakan untuk login, keluar, ganti password, dan aksi CRUD admin.
 */
export async function buatClientSesiAdmin() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY harus diatur di environment variable."
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component, abaikan jika tidak bisa set cookie
        }
      },
    },
  });
}

export const createAdminClient = buatClientSesiAdmin;
