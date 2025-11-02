<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alternatif;
use App\Models\Kriteria;
use App\Models\Penilaian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PenilaianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Kita ambil SEMUA data yang dibutuhin React nanti
        $kriteria = Kriteria::all();
        $alternatif = Alternatif::all();
        $penilaian = Penilaian::all();

        return response()->json([
            'success' => true,
            'message' => 'Data Penilaian berhasil diambil',
            'data' => [
                'kriteria' => $kriteria,
                'alternatif' => $alternatif,
                'penilaian' => $penilaian
            ]
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'alternatif_id' => 'required|integer|exists:alternatifs,id',
            'kriteria_id' => 'required|integer|exists:kriterias,id',
            'nilai' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $penilaian = Penilaian::updateOrCreate(
            [
                'alternatif_id' => $request->alternatif_id,
                'kriteria_id' => $request->kriteria_id,
            ],
            [
                'nilai' => $request->nilai
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Data Penilaian berhasil disimpan',
            'data' => $penilaian
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
