import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function PagePenilaian() {
  const [kriteria, setKriteria] = useState([]);
  const [alternatif, setAlternatif] = useState([]);
  const [nilaiMap, setNilaiMap] = useState({});

  useEffect(() => {
    fetchDataPenilaian(); 
  }, []);

  const fetchDataPenilaian = async () => {
    try {
      const response = await axios.get(`${API_URL}/penilaian`);
      const data = response.data.data;
      setKriteria(data.kriteria);
      setAlternatif(data.alternatif);
      const map = {};
      data.penilaian.forEach((item) => {
        const key = `${item.alternatif_id}-${item.kriteria_id}`;
        map[key] = item.nilai;
      });
      setNilaiMap(map);
    } catch (error) {
      console.error("Gagal ngambil data penilaian:", error);
      toast.error("Gagal memuat data penilaian.");
    }
  };

  const handleNilaiChange = (alternatif_id, kriteria_id, nilai) => {
    const key = `${alternatif_id}-${kriteria_id}`;
    setNilaiMap((prevMap) => ({
      ...prevMap,
      [key]: nilai,
    }));
  };

  const handleSaveNilai = async (alternatif_id, kriteria_id) => {
    const key = `${alternatif_id}-${kriteria_id}`;
    const nilai = nilaiMap[key];
    const nilaiToSave = nilai === "" ? 0 : nilai;

    try {
      await axios.post(`${API_URL}/penilaian`, {
        alternatif_id: alternatif_id,
        kriteria_id: kriteria_id,
        nilai: nilaiToSave,
      });
      toast.success("Nilai berhasil disimpan!");
    } catch (error) {
      console.error("Gagal nyimpen nilai:", error);
      toast.error("Gagal menyimpan nilai.");
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Input Penilaian</h1>
        <p className="text-gray-600 mb-4">
          Isi nilai untuk setiap alternatif berdasarkan kriteria. Nilai akan{" "}
          <strong>otomatis tersimpan</strong> saat Anda berpindah dari kotak
          input (onBlur).
        </p>

        {/* (1) ▼▼▼ MULAI MAKEOVER TABEL PENILAIAN ▼▼▼ */}
        <div className="overflow-x-auto">
          {kriteria.length === 0 || alternatif.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">
                Data Kriteria atau Alternatif masih kosong.
              </p>
              <p>Harap isi kedua data tersebut sebelum melakukan penilaian.</p>
            </div>
          ) : (
            <table className="w-full min-w-[700px] mt-4">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Alternatif
                  </th>
                  {kriteria.map((k) => (
                    <th
                      key={k.id}
                      className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {k.kode_kriteria} ({k.atribut})
                      <span className="block text-xs font-normal text-blue-600 mt-1">
                        ({k.unit || "N/A"}) {/* <-- Tampilkan unit/satuan */}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alternatif.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {a.nama_supplier}
                    </td>
                    {kriteria.map((k) => {
                      const key = `${a.id}-${k.id}`;
                      return (
                        <td key={key} className="p-2 whitespace-nowrap text-sm">
                          {" "}
                          {/* (2) Ganti p-1 jadi p-2 biar lebih lega */}
                          <input
                            type="number"
                            step="any" // (3) Izinin desimal berapapun
                            // (4) Styling input biar lebih rapi
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center"
                            placeholder="0"
                            value={nilaiMap[key] || ""}
                            onChange={(e) =>
                              handleNilaiChange(a.id, k.id, e.target.value)
                            }
                            onBlur={() => handleSaveNilai(a.id, k.id)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* (5) ▲▲▲ SELESAI MAKEOVER TABEL PENILAIAN ▲▲▲ */}
      </div>
    </div>
  );
}
