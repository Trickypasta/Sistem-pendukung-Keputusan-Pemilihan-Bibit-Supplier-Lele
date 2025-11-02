<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kriteria;
use Illuminate\Support\Facades\Validator;

class KriteriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 3. Ambil semua data kriteria
        $kriteria = Kriteria::all();

        // 4. Kasih balasan (response) JSON
        return response()->json([
            'success' => true,
            'message' => 'Data Kriteria berhasil diambil',
            'data' => $kriteria
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 5. Buat aturan validasi
        $validator = Validator::make($request->all(), [
            'kode_kriteria' => 'required|string|unique:kriterias',
            'nama_kriteria' => 'required|string|max:255',
            'atribut' => 'required|in:benefit,cost',
            'bobot' => 'required|numeric|min:0|max:1', // Bobot kita anggap 0-1 (misal: 0.25)
        ]);

        // 6. Cek kalo validasinya gagal
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422); // 422 = Unprocessable Entity
        }

        // 7. Kalo validasi sukses, bikin datanya
        $kriteria = Kriteria::create([
            'kode_kriteria' => $request->kode_kriteria,
            'nama_kriteria' => $request->nama_kriteria,
            'atribut' => $request->atribut,
            'bobot' => $request->bobot,
        ]);

        // 8. Kasih balasan sukses
        return response()->json([
            'success' => true,
            'message' => 'Data Kriteria berhasil ditambahkan',
            'data' => $kriteria
        ], 201); // 201 = Created
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // 1. Cari datanya dulu
        $kriteria = Kriteria::find($id);

        // 2. Kalo gak nemu, kasih error 404
        if (!$kriteria) {
            return response()->json([
                'success' => false,
                'message' => 'Data Kriteria tidak ditemukan'
            ], 404);
        }

        // 3. Buat aturan validasi
        $validator = Validator::make($request->all(), [
            // Cek 'unique', tapi 'ignore' ID dia sendiri
            'kode_kriteria' => 'required|string|unique:kriterias,kode_kriteria,' . $id,
            'nama_kriteria' => 'required|string|max:255',
            'atribut' => 'required|in:benefit,cost',
            'bobot' => 'required|numeric|min:0|max:1',
            'unit' => 'nullable|string|max:50',
        ]);

        // 4. Cek kalo validasinya gagal
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // 5. Kalo validasi sukses, update datanya
        $kriteria->update($validator->validated());

        // 6. Kasih balasan sukses
        return response()->json([
            'success' => true,
            'message' => 'Data Kriteria berhasil diupdate',
            'data' => $kriteria
        ], 200); // 200 = OK
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // 1. Cari datanya dulu
        $kriteria = Kriteria::find($id);

        // 2. Kalo gak nemu, kasih error 404
        if (!$kriteria) {
            return response()->json([
                'success' => false,
                'message' => 'Data Kriteria tidak ditemukan'
            ], 404); // 404 = Not Found
        }

        // 3. Kalo nemu, hapus
        $kriteria->delete();

        // 4. Kasih balasan sukses
        return response()->json([
            'success' => true,
            'message' => 'Data Kriteria berhasil dihapus'
        ], 200); // 200 = OK
    }
}
