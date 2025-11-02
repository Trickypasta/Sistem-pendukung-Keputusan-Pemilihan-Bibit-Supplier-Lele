import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function PageHasil() {
  const [hasilList, setHasilList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalPeringkat, setModalPeringkat] = useState(null);

  useEffect(() => {
    fetchDataHasil();
  }, []);

  const fetchDataHasil = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/hitung`);
      setHasilList(response.data.data);
      toast.success("Hasil peringkat berhasil dimuat!");
    } catch (error) {
      console.error("Gagal ngambil data hasil:", error);
      toast.error("Gagal memuat hasil peringkat.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailClick = async (hasil) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    setModalData(null);
    setModalPeringkat(hasil.peringkat);

    try {
      const response = await axios.get(
        `${API_URL}/hitung-detail/${hasil.id_alternatif}`
      );
      setModalData(response.data.data);
    } catch (error) {
      console.error("Gagal ngambil data detail:", error);
      toast.error("Gagal memuat data detail.");
      setIsModalOpen(false);
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setModalPeringkat(null);
  };

  // --- TAMPILAN (JSX) ---
  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Hasil Peringkat SAW</h1>
          <button
            onClick={fetchDataHasil}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          >
            {isLoading ? "Menghitung..." : "Hitung Ulang"}
          </button>
        </div>

        {/* (1) ▼▼▼ MULAI MAKEOVER TABEL UTAMA ▼▼▼ */}
        <div className="overflow-x-auto">
          <table className="w-full mt-4 min-w-[600px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Peringkat
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama Supplier
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nilai Akhir (V)
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {hasilList.map((hasil) => (
                <tr key={hasil.id_alternatif} className="hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap text-sm text-gray-800 font-bold text-lg">
                    {hasil.peringkat}
                  </td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {hasil.nama_supplier}
                  </td>
                  <td className="p-3 whitespace-nowrap text-sm text-gray-700">
                    {hasil.nilai_akhir.toFixed(4)}
                  </td>
                  <td className="p-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDetailClick(hasil)}
                      className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-1 px-2 rounded"
                    >
                      Lihat Rincian
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* (2) ▲▲▲ SELESAI MAKEOVER TABEL UTAMA ▲▲▲ */}
      </div>

      {/* MODAL (POP-UP) RINCIAN PERHITUNGAN */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" // (3) Tambahin padding p-4
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl" // (4) Bikin modal lebih LEBAR
            onClick={(e) => e.stopPropagation()}
          >
            {isModalLoading ? (
              <p>Loading rincian...</p>
            ) : (
              modalData &&
              (() => {
                const { kelebihan, kekurangan, teksRekomendasi, teksAnalisis } =
                  (() => {
                    const kelebihan = modalData.rincian.reduce((max, item) =>
                      item.hasil_bobot > max.hasil_bobot ? item : max
                    );
                    const kekurangan = modalData.rincian.reduce((min, item) =>
                      item.hasil_bobot < min.hasil_bobot ? item : min
                    );
                    let teksRekomendasi =
                      modalPeringkat === 1
                        ? "Ini adalah rekomendasi teratas kami."
                        : `Ini adalah pilihan yang baik (Peringkat #${modalPeringkat}).`;
                    let teksAnalisis = `Supplier ini sangat **unggul** di bidang **${
                      kelebihan.nama_kriteria
                    }** (skor: ${kelebihan.hasil_bobot.toFixed(
                      3
                    )}), namun perlu **diperhatikan** kekurangannya di bidang **${
                      kekurangan.nama_kriteria
                    }** (skor: ${kekurangan.hasil_bobot.toFixed(3)}).`;
                    return {
                      kelebihan,
                      kekurangan,
                      teksRekomendasi,
                      teksAnalisis,
                    };
                  })();

                return (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Rincian Perhitungan: {modalData.nama_supplier}
                    </h2>

                    {/* Blok Rekomendasi */}
                    <div className="bg-blue-50 p-4 rounded-lg my-4 border border-blue-200">
                      <h3 className="font-bold text-lg text-blue-800">
                        {teksRekomendasi}
                      </h3>
                      <p className="text-sm text-gray-700 mt-2">
                        {teksAnalisis
                          .split("**")
                          .map((text, index) =>
                            index % 2 === 1 ? (
                              <strong key={index}>{text}</strong>
                            ) : (
                              text
                            )
                          )}
                      </p>
                    </div>

                    <p className="text-lg mb-4">
                      Total Nilai Akhir:{" "}
                      <strong className="text-blue-600">
                        {modalData.nilai_akhir.toFixed(4)}
                      </strong>
                    </p>

                    {/* (5) ▼▼▼ MAKEOVER TABEL RINCIAN ▼▼▼ */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm mt-4 min-w-[600px]">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Kriteria
                            </th>
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Nilai Asli
                            </th>
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Bobot
                            </th>
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Nilai Normalisasi
                            </th>
                            <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Hasil (Bobot x Normal)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {modalData.rincian.map((r) => (
                            <tr
                              key={r.kode_kriteria}
                              className="hover:bg-gray-50"
                            >
                              <td className="p-2 whitespace-nowrap text-gray-800 font-medium">
                                {r.kode_kriteria} ({r.nama_kriteria})
                              </td>
                              <td className="p-2 whitespace-nowrap text-gray-700">
                                {r.nilai_asli}
                              </td>
                              <td className="p-2 whitespace-nowrap text-gray-700">
                                {r.bobot}
                              </td>
                              <td className="p-2 whitespace-nowrap text-gray-700">
                                {r.nilai_normalisasi.toFixed(3)}
                              </td>
                              <td className="p-2 whitespace-nowrap text-gray-700">
                                {r.hasil_bobot.toFixed(3)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* (6) ▲▲▲ SELESAI MAKEOVER TABEL RINCIAN ▲▲▲ */}

                    <button
                      onClick={closeModal}
                      className="mt-6 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Tutup
                    </button>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}
