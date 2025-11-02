import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://127.0.0.1:8000/api";

const initialFormData = {
  nama_supplier: "",
};

export default function PageAlternatif() {
  const [alternatifList, setAlternatifList] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDataAlternatif();
  }, []);

  const fetchDataAlternatif = async () => {
    try {
      const response = await axios.get(`${API_URL}/alternatif`);
      setAlternatifList(response.data.data);
    } catch (error) {
      console.error("Gagal ngambil data alternatif:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      if (editingId) {
        await axios.put(`${API_URL}/alternatif/${editingId}`, formData);
        toast.info("Data supplier berhasil diupdate!");
      } else {
        await axios.post(`${API_URL}/alternatif`, formData);
        toast.success("Data supplier berhasil ditambahkan!");
      }
      handleCancelEdit();
      fetchDataAlternatif();
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
    if (
      window.confirm(
        "Yakin mau hapus supplier ini? Semua data penilaiannya akan ikut terhapus!"
      )
    ) {
      try {
        await axios.delete(`${API_URL}/alternatif/${id}`);
        toast.success("Data supplier berhasil dihapus!");
        fetchDataAlternatif();
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

  const handleEdit = (alternatif) => {
    setFormData({
      nama_supplier: alternatif.nama_supplier,
    });
    setEditingId(alternatif.id);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setErrors({});
  };

  return (
    <div className="p-6">
      {/* Kartu putih 1: Form Tambah/Edit Data */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-4">
          {editingId ? "Edit Data Supplier" : "Tambah Data Supplier"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Nama Supplier
              </label>
              <input
                type="text"
                name="nama_supplier"
                value={formData.nama_supplier}
                onChange={handleFormChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                placeholder="Contoh: Sumber Berkah"
              />
              {errors.nama_supplier && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nama_supplier[0]}
                </p>
              )}
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {editingId ? "Update" : "Simpan"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Batal
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Kartu putih 2: Tabel List Data */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">List Data Alternatif</h1>

        {/* (1) ▼▼▼ MULAI MAKEOVER TABEL ▼▼▼ */}
        <div className="overflow-x-auto">
          {alternatifList.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg">Belum ada data alternatif (supplier).</p>
              <p>Silakan tambahkan data baru menggunakan form di atas.</p>
            </div>
          ) : (
            <table className="w-full mt-4 min-w-[500px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama Supplier
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alternatifList.map((alternatif) => (
                  <tr key={alternatif.id} className="hover:bg-gray-50">
                    <td className="p-3 whitespace-nowrap text-sm text-gray-700">
                      {alternatif.id}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {alternatif.nama_supplier}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm flex space-x-1">
                      <button
                        onClick={() => handleEdit(alternatif)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white text-sm font-bold py-1 px-2 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(alternatif.id)}
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
        {/* (2) ▲▲▲ SELESAI MAKEOVER TABEL ▲▲▲ */}
      </div>
    </div>
  );
}
