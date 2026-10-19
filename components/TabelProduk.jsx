"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";
import { hapusProduk } from "@/app/admin/actions";

export default function TabelProduk({ daftarProduk = [] }) {
  const router = useRouter();
  const [produkDetail, setProdukDetail] = useState(null);
  const [produkHapus, setProdukHapus] = useState(null);
  const [sedangMenghapus, setSedangMenghapus] = useState(false);
  const [pesanErrorHapus, setPesanErrorHapus] = useState(null);

  async function handleKonfirmasiHapus() {
    if (!produkHapus) return;
    setSedangMenghapus(true);
    setPesanErrorHapus(null);

    const res = await hapusProduk(produkHapus.id);
    setSedangMenghapus(false);

    if (res?.error) {
      setPesanErrorHapus(res.error);
    } else {
      setProdukHapus(null);
      router.refresh();
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-garis">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-permukaan text-teks-lembut">
            <tr>
              <th className="px-4 py-3 font-semibold">Produk</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Harga</th>
              <th className="px-4 py-3 font-semibold text-right">
                <span>Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {daftarProduk.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-teks-lembut">
                  Belum ada produk
                </td>
              </tr>
            ) : (
              daftarProduk.map((produk) => (
                <tr key={produk.id} className="border-t border-garis">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={produk.foto_url}
                        alt=""
                        className="h-10 w-10 rounded-md bg-permukaan object-cover"
                      />
                      <span className="font-semibold">{produk.nama}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-teks-lembut">{produk.kategori}</td>
                  <td className="px-4 py-3">{formatRupiah(produk.harga)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Tombol
                        type="button"
                        varian="garis"
                        onClick={() => setProdukDetail(produk)}
                      >
                        Lihat
                      </Tombol>
                      {/* US-09: ubah produk */}
                      <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                        Ubah
                      </Tombol>
                      {/* US-10: hapus produk dengan konfirmasi */}
                      <Tombol
                        type="button"
                        varian="bahaya"
                        onClick={() => {
                          setProdukHapus(produk);
                          setPesanErrorHapus(null);
                        }}
                      >
                        Hapus
                      </Tombol>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Produk (Action to View) */}
      {produkDetail && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setProdukDetail(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl border border-garis bg-latar p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-teks-lembut">{produkDetail.kategori}</p>
                <h2 className="text-xl font-extrabold">{produkDetail.nama}</h2>
              </div>
              <button
                type="button"
                onClick={() => setProdukDetail(null)}
                className="text-2xl font-bold leading-none text-teks-lembut hover:text-teks"
                aria-label="Tutup modal"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <img
                src={produkDetail.foto_url}
                alt={produkDetail.nama}
                className="aspect-square w-full rounded-xl border border-garis bg-permukaan object-cover"
              />
              <p className="self-start rounded-md bg-harga-latar px-2.5 py-1 text-base font-bold text-harga">
                {formatRupiah(produkDetail.harga)}
              </p>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-teks-lembut">
                  Deskripsi
                </h3>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-teks-lembut">
                  {produkDetail.deskripsi || "Tidak ada deskripsi."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-garis pt-4">
              <Tombol href={`/produk/${produkDetail.id}`} varian="utama">
                Buka di katalog
              </Tombol>
              <Tombol type="button" varian="garis" onClick={() => setProdukDetail(null)}>
                Tutup
              </Tombol>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Produk (US-10) */}
      {produkHapus && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !sedangMenghapus && setProdukHapus(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-garis bg-latar p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-extrabold text-bahaya">Konfirmasi Hapus</h2>
            <p className="mt-2 text-sm text-teks-lembut">
              Apakah Anda yakin ingin menghapus produk{" "}
              <span className="font-semibold text-teks">"{produkHapus.nama}"</span>? Tindakan
              ini akan menghapus produk dari database.
            </p>

            {pesanErrorHapus && (
              <div className="mt-4 rounded-lg border border-garis bg-permukaan p-3 text-sm text-bahaya">
                {pesanErrorHapus}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Tombol
                type="button"
                varian="garis"
                disabled={sedangMenghapus}
                onClick={() => {
                  setProdukHapus(null);
                  setPesanErrorHapus(null);
                }}
              >
                Batal
              </Tombol>
              <Tombol
                type="button"
                varian="bahaya"
                disabled={sedangMenghapus}
                onClick={handleKonfirmasiHapus}
              >
                {sedangMenghapus ? "Menghapus..." : "Ya, Hapus"}
              </Tombol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
