"use client";

import { useState, useMemo } from "react";
import KartuProduk from "@/components/KartuProduk";

export default function KatalogProduk({ daftarProduk = [] }) {
  const [cari, setCari] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const kategoriList = useMemo(() => {
    const setKategori = new Set(
      daftarProduk.map((p) => p.kategori).filter(Boolean)
    );
    return ["Semua", ...Array.from(setKategori)];
  }, [daftarProduk]);

  const produkTersaring = useMemo(() => {
    return daftarProduk.filter((produk) => {
      const cocokKategori =
        kategoriAktif === "Semua" || produk.kategori === kategoriAktif;
      const cocokCari =
        !cari.trim() ||
        produk.nama?.toLowerCase().includes(cari.trim().toLowerCase());
      return cocokKategori && cocokCari;
    });
  }, [daftarProduk, kategoriAktif, cari]);

  if (daftarProduk.length === 0) {
    return <p className="py-8 text-center text-teks-lembut">Belum ada produk</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Kolom Pencarian dan Filter Kategori (US-11) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-xs">
          <input
            type="search"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari nama produk..."
            className="w-full rounded-lg border border-garis bg-latar px-3.5 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {kategoriList.map((kategori) => (
            <button
              key={kategori}
              type="button"
              onClick={() => setKategoriAktif(kategori)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                kategoriAktif === kategori
                  ? "bg-utama text-white"
                  : "border border-garis bg-latar text-teks-lembut hover:border-utama hover:text-utama"
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Produk Hasil Filter */}
      {produkTersaring.length === 0 ? (
        <p className="py-8 text-center text-teks-lembut">
          Tidak ada produk yang cocok dengan pencarian atau kategori ini.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {produkTersaring.map((produk) => (
            <KartuProduk key={produk.id} produk={produk} />
          ))}
        </div>
      )}
    </div>
  );
}

