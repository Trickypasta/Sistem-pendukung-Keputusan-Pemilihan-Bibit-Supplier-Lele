import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://127.0.0.1:8000/api";

const initialFormData = {
  kode_kriteria: "",
  nama_kriteria: "",
  atribut: "cost",
  bobot: 0.0,
  unit: "",
};

export default function PageKriteria() {
  const [kriteriaList, setKriteriaList] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDataKriteria();
  }, []);

  const fetchDataKriteria = async () => {
    try {
      const response = await axios.get(`${API_URL}/kriteria`);
      setKriteriaList(response.data.data);
    } catch (error) {
      console.error("Gagal ngambil data kriteria:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      if (editingId) {
        await axios.put(`${API_URL}/kriteria/${editingId}`, formData);
        toast.info("Data berhasil diupdate!");
      } else {
        await axios.post(`${API_URL}/kriteria`, formData);
        toast.success("Data berhasil ditambahkan!");
      }
      handleCancelEdit();
      fetchDataKriteria();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("Gagal menyimpan data. Cek lagi formnya!");
      } else {
        console.error("Gagal nyimpen data:", error);
        toast.error("Gagal menyimpan data.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin mau hapus data ini?")) {
      try {
        await axios.delete(`${API_URL}/kriteria/${id}`);
        toast.success("Data berhasil dihapus!");
        fetchDataKriteria();
      } catch (error) {
        console.error("Gagal hapus data:", error);
        toast.error("Gagal menghapus data.");
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (kriteria) => {
    setFormData({
      kode_kriteria: kriteria.kode_kriteria,
      nama_kriteria: kriteria.nama_kriteria,
      atribut: kriteria.atribut,
      bobot: kriteria.bobot,
      unit: kriteria.unit || "",
    });
    setEditingId(kriteria.id);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setErrors({});
  };

  const totalBobot = kriteriaList.reduce((total, kriteria) => {
    return total + parseFloat(kriteria.bobot);
  }, 0);

  const isBobotValid = totalBobot.toFixed(2) === "1.00";

  // --- TAMPILAN (JSX) ---
  return (
    <div className="p-6">
      {/* Kartu putih 1: Form Tambah/Edit Data */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-4">
          {editingId ? "Edit Data Kriteria" : "Tambah Data Kriteria"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Input Kode */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kode Kriteria
              </label>
              <input
                type="text"
                name="kode_kriteria"
                value={formData.kode_kriteria}
                onChange={handleFormChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Contoh: C1"
              />
              {errors.kode_kriteria && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.kode_kriteria[0]}
                </p>
              )}
            </div>

            {/* Input Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Kriteria
              </label>
              <input
                type="text"
                name="nama_kriteria"
                value={formData.nama_kriteria}
                onChange={handleFormChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Contoh: Kualitas Bibit"
              />
              {errors.nama_kriteria && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nama_kriteria[0]}
                </p>
              )}
            </div>

            {/* Input Atribut */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Atribut
              </label>
              <select
                name="atribut"
                value={formData.atribut}
                onChange={handleFormChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="cost">Cost</option>
                <option value="benefit">Benefit</option>
              </select>
              {formData.atribut === "cost" ? (
                <p className="text-xs text-gray-500 mt-1">
                  (Makin <strong>KECIL</strong> nilai, makin{" "}
                  <strong>BAGUS</strong>)
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  (Makin <strong>BESAR</strong> nilai, makin{" "}
                  <strong>BAGUS</strong>)
                </p>
              )}
            </div>

            {/* Input Bobot */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bobot (0-1)
              </label>
              <input
                type="number"
                name="bobot"
                step="0.01"
                min="0"
                max="1"
                value={formData.bobot}
                onChange={handleFormChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Contoh: 0.25"
              />
              {errors.bobot && (
                <p className="text-red-500 text-xs mt-1">{errors.bobot[0]}</p>
              )}
            </div>

            {/* Input Unit (Satuan) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Satuan Nilai (Unit)
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleFormChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Contoh: Rp, Skala 1-5, %"
              />
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingId ? "Update" : "Simpan"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Kartu putih 2: Tabel List Data */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">List Data Kriteria</h1>
          {kriteriaList.length > 0 && (
            <div
              className={`p-3 rounded-lg ${
                isBobotValid
                  ? "bg-green-100 border border-green-300"
                  : "bg-red-100 border border-red-300"
              }`}
            >
              <span className="font-bold text-lg">
                Total Bobot: {totalBobot.toFixed(2)} / 1.00
              </span>
              {!isBobotValid && (
                <p className="text-red-600 text-sm">
                  Peringatan: Total bobot harus 1.00 agar perhitungan SAW valid!
                </p>
              )}
            </div>
          )}
        </div>

        {/* (1) ▼▼▼ MULAI MAKEOVER TABEL ▼▼▼ */}
        <div className="overflow-x-auto">
          {" "}
          {/* (2) Bungkus tabel biar bisa scroll kalo gak muat */}
          {kriteriaList.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">Belum ada data kriteria.</p>
              <p>Silakan tambahkan data baru menggunakan form di atas.</p>
            </div>
          ) : (
            // (3) Hapus 'border-collapse border'
            <table className="w-full mt-4 min-w-[700px]">
              <thead>
                {/* (4) Ganti styling header */}
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Kode
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama Kriteria
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Atribut
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Bobot
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              {/* (5) Ganti styling body */}
              <tbody className="divide-y divide-gray-200">
                {kriteriaList.map((kriteria) => (
                  <tr key={kriteria.id} className="hover:bg-gray-50">
                    {/* (6) Ganti styling cell */}
                    <td className="p-3 whitespace-nowrap text-sm text-gray-700">
                      {kriteria.kode_kriteria}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {kriteria.nama_kriteria}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-700">
                      {kriteria.atribut}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-700">
                      {kriteria.bobot}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-700">
                      {kriteria.unit}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm flex space-x-1">
                      <button
                        onClick={() => handleEdit(kriteria)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white text-sm font-bold py-1 px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(kriteria.id)}
                        className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-2 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* (7) ▲▲▲ SELESAI MAKEOVER TABEL ▲▲▲ */}
      </div>
    </div>
  );
}
