"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

export default function TombolWhatsApp({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  if (!produk) return null;

  const totalHarga = (produk.harga || 0) * jumlah;
  const hargaTotalFormat = formatRupiah(totalHarga);

  let pesan = `Halo, saya ingin memesan ${jumlah}x ${produk.nama}`;
  if (varian.trim()) {
    pesan += ` (Varian/Catatan: ${varian.trim()})`;
  }
  pesan += ` seharga ${hargaTotalFormat}.`;

  const linkWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-garis bg-permukaan/50 p-4">
      {/* Pengaturan Jumlah & Varian (US-12) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <label htmlFor="jumlah-pesan" className="text-xs font-semibold text-teks-lembut">
            Jumlah
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
              disabled={jumlah <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar font-bold text-teks hover:bg-permukaan disabled:opacity-50"
              aria-label="Kurangi jumlah"
            >
              -
            </button>
            <span id="jumlah-pesan" className="min-w-[2rem] text-center font-bold text-teks">
              {jumlah}
            </span>
            <button
              type="button"
              onClick={() => setJumlah((prev) => prev + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-garis bg-latar font-bold text-teks hover:bg-permukaan"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 sm:max-w-xs">
          <label htmlFor="varian-pesan" className="text-xs font-semibold text-teks-lembut">
            Varian / Catatan (opsional)
          </label>
          <input
            id="varian-pesan"
            type="text"
            value={varian}
            onChange={(e) => setVarian(e.target.value)}
            placeholder="Contoh: Dingin, Ukuran L, dsb."
            className="w-full rounded-lg border border-garis bg-latar px-3 py-1.5 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-garis pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <span className="text-teks-lembut">Total: </span>
          <span className="font-bold text-harga">{hargaTotalFormat}</span>
        </div>
        <a
          href={linkWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-lg bg-utama px-5 py-3 font-semibold text-white hover:bg-utama-gelap sm:w-auto"
        >
          Pesan via WhatsApp
        </a>
      </div>
    </div>
  );
}
