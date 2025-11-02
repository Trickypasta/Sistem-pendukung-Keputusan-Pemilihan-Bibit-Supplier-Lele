<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Alternatif;
use Illuminate\Support\Facades\Validator;

class AlternatifController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $alternatif = Alternatif::all();

        return response()->json([
            'success' => true,
            'message' => 'Data Alternatif berhasil diambil',
            'data' => $alternatif
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi (cuma 1 field)
        $validator = Validator::make($request->all(), [
            'nama_supplier' => 'required|string|unique:alternatifs|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Bikin datanya
        $alternatif = Alternatif::create([
            'nama_supplier' => $request->nama_supplier,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Alternatif berhasil ditambahkan',
            'data' => $alternatif
        ], 201);
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
        // 1. Cari datanya
        $alternatif = Alternatif::find($id);

        // 2. Kalo gak nemu
        if (!$alternatif) {
            return response()->json([
                'success' => false,
                'message' => 'Data Alternatif tidak ditemukan'
            ], 404);
        }

        // 3. Buat aturan validasi
        $validator = Validator::make($request->all(), [
            // Cek 'unique', tapi 'ignore' ID dia sendiri
            'nama_supplier' => 'required|string|unique:alternatifs,nama_supplier,' . $id . '|max:255',
        ]);

        // 4. Kalo validasi gagal
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // 5. Kalo validasi sukses, update datanya
        $alternatif->update($validator->validated());

        // 6. Kasih balasan sukses
        return response()->json([
            'success' => true,
            'message' => 'Data Alternatif berhasil diupdate',
            'data' => $alternatif
        ], 200); // 200 = OK
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // 1. Cari datanya
        $alternatif = Alternatif::find($id);

        // 2. Kalo gak nemu
        if (!$alternatif) {
            return response()->json([
                'success' => false,
                'message' => 'Data Alternatif tidak ditemukan'
            ], 404);
        }

        // 3. Kalo nemu, hapus
        $alternatif->delete();

        // 4. Kasih balasan sukses
        return response()->json([
            'success' => true,
            'message' => 'Data Alternatif berhasil dihapus'
        ], 200);
    }
}
