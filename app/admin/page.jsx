import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatClientSesiAdmin, buatClientServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = await buatClientSesiAdmin();
    const { data, error } = await supabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      // Fallback ke server client jika ada kendala sesi/RLS saat membaca data
      const serverClient = buatClientServer();
      const res = await serverClient
        .from("produk")
        .select("*")
        .order("id", { ascending: true });

      if (res.error) {
        pesanError = `Gagal memuat produk dari database: ${res.error.message}`;
      } else {
        daftarProduk = res.data || [];
      }
    } else {
      daftarProduk = data || [];
    }
  } catch (err) {
    pesanError = `Gagal memuat produk: ${err.message || "Terjadi kesalahan pada server."}`;
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {pesanError ? (
        <div className="rounded-lg border border-garis bg-permukaan p-4 text-sm text-bahaya">
          <p className="font-semibold">{pesanError}</p>
        </div>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
