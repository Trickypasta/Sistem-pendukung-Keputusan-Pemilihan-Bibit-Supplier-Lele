import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export default function PageDashboard() {
  const [kriteriaCount, setKriteriaCount] = useState(0);
  const [alternatifCount, setAlternatifCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const kriteriaResponse = await axios.get(`${API_URL}/kriteria`);
      setKriteriaCount(kriteriaResponse.data.data.length);

      const alternatifResponse = await axios.get(`${API_URL}/alternatif`);
      setAlternatifCount(alternatifResponse.data.data.length);
    } catch (error) {
      console.error("Gagal ngambil data statistik:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

      {/* (1) ▼▼▼ MAKEOVER KARTU STATISTIK ▼▼▼ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Kartu 1: Total Kriteria */}
        {/* Kita ganti shadow-md jadi shadow-lg dan p-6 biar konsisten */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100">
              <ion-icon
                name="cube-outline"
                class="text-3xl text-blue-600"
              ></ion-icon>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-600">
                Total Kriteria
              </h2>
              <p className="text-4xl font-bold text-gray-800 mt-1">
                {kriteriaCount}
              </p>
            </div>
          </div>
        </div>

        {/* Kartu 2: Total Alternatif */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100">
              <ion-icon
                name="people-outline"
                class="text-3xl text-green-600"
              ></ion-icon>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-600">
                Total Alternatif
              </h2>
              <p className="text-4xl font-bold text-gray-800 mt-1">
                {alternatifCount}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ▲▲▲ SELESAI MAKEOVER KARTU STATISTIK ▲▲▲ */}

      {/* Kartu Panduan (Styling-nya udah oke) */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Panduan Penggunaan SPK
        </h2>

        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            Buka halaman <strong>Data Kriteria</strong>, isi semua kriteria (C1,
            C2, C3, dst.) yang akan dinilai. Pastikan Anda mengatur{" "}
            <strong>Bobot</strong> untuk setiap kriteria.
            <em className="block text-sm text-gray-500">
              Catatan: Untuk metode SAW, idealnya total semua bobot adalah 1
              (contoh: 0.3, 0.2, 0.5).
            </em>
          </li>
          <li>
            Buka halaman <strong>Data Alternatif</strong>, isi semua supplier
            bibit lele yang akan dievaluasi.
          </li>
          <li>
            Buka halaman <strong>Input Penilaian</strong>, isi semua nilai di
            dalam tabel matriks. Nilai akan <strong>otomatis tersimpan</strong>{" "}
            saat Anda berpindah dari kotak input.
          </li>
          <li>
            Setelah semua nilai terisi, buka halaman{" "}
            <strong>Hasil Peringkat</strong> untuk melihat supplier terbaik
            berdasarkan perhitungan. Klik <strong>"Hitung Ulang"</strong> jika
            ada perubahan data.
          </li>
        </ol>
      </div>
    </div>
  );
}
