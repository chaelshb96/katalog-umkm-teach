"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function gantiPassword(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const passwordBaru = data?.get?.("password_baru");
  const konfirmasiPassword = data?.get?.("konfirmasi_password");

  // 1. Periksa sesi login admin di server (aturan keamanan wajib)
  const supabase = await buatClientSesiAdmin();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi telah berakhir atau belum login. Silakan login kembali." };
  }

  // 2. Validasi input di server
  if (!passwordBaru || !konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password wajib diisi." };
  }

  if (String(passwordBaru).length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return { error: "Password baru dan konfirmasi password tidak sama." };
  }

  // 3. Perbarui password di Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: String(passwordBaru),
  });

  if (error) {
    return { error: `Gagal mengganti password: ${error.message}` };
  }

  return { success: true, pesan: "Password berhasil diganti." };
}

export async function tambahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;

  // 1. Periksa sesi login admin di server
  const supabase = await buatClientSesiAdmin();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Aksi ditolak: Anda harus login terlebih dahulu." };
  }

  // 2. Validasi form
  const nama = data?.get?.("nama");
  const harga = Number(data?.get?.("harga"));
  const kategori = data?.get?.("kategori") || "";
  const foto_url = data?.get?.("foto_url") || "";
  const deskripsi = data?.get?.("deskripsi") || "";

  if (!nama || isNaN(harga) || harga < 0) {
    return { error: "Nama produk dan harga valid (tidak boleh negatif) wajib diisi." };
  }

  // 3. Simpan ke database Supabase
  const { error } = await supabase.from("produk").insert([
    {
      nama: String(nama).trim(),
      harga,
      kategori: String(kategori).trim(),
      foto_url: String(foto_url).trim(),
      deskripsi: String(deskripsi).trim(),
    },
  ]);

  if (error) {
    return { error: `Gagal menyimpan produk: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function ubahProduk(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;

  // 1. Periksa sesi login admin di server
  const supabase = await buatClientSesiAdmin();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Aksi ditolak: Anda harus login terlebih dahulu." };
  }

  // 2. Validasi form
  const id = data?.get?.("id");
  const nama = data?.get?.("nama");
  const harga = Number(data?.get?.("harga"));
  const kategori = data?.get?.("kategori") || "";
  const foto_url = data?.get?.("foto_url") || "";
  const deskripsi = data?.get?.("deskripsi") || "";

  if (!id) {
    return { error: "ID produk tidak valid." };
  }

  if (!nama || isNaN(harga) || harga < 0) {
    return { error: "Nama produk dan harga valid (tidak boleh negatif) wajib diisi." };
  }

  // 3. Perbarui produk di database Supabase
  const { error } = await supabase
    .from("produk")
    .update({
      nama: String(nama).trim(),
      harga,
      kategori: String(kategori).trim(),
      foto_url: String(foto_url).trim(),
      deskripsi: String(deskripsi).trim(),
    })
    .eq("id", id);

  if (error) {
    return { error: `Gagal memperbarui produk: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  redirect("/admin");
}

export async function hapusProduk(id) {
  // 1. Periksa sesi login admin di server
  const supabase = await buatClientSesiAdmin();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Aksi ditolak: Anda harus login terlebih dahulu." };
  }

  if (!id) {
    return { error: "ID produk tidak ditemukan." };
  }

  // 2. Hapus produk dari database Supabase
  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    return { error: `Gagal menghapus produk: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
