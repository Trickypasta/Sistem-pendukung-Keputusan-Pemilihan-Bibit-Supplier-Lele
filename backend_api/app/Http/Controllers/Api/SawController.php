<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SawService;
use Illuminate\Http\Request;
use App\Models\Kriteria;
use App\Models\Alternatif;
use App\Models\Penilaian;

class SawController extends Controller
{
    protected $sawService;

    public function __construct(SawService $sawService)
    {
        $this->sawService = $sawService;
    }

    public function hitung()
    {
        try {
            $hasilPeringkat = $this->sawService->hitungPeringkat();

            return response()->json([
                'success' => true,
                'message' => 'Perhitungan SAW berhasil',
                'data' => $hasilPeringkat
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Perhitungan gagal: ' . $e->getMessage()
            ], 500);
        }
    }

    public function hitungDetail(string $id)
    {
        try {
            $kriteria = Kriteria::all();
            $alternatif_all = Alternatif::all();
            $penilaian = Penilaian::all();

            $alternatif_detail = Alternatif::find($id);

            if ($kriteria->isEmpty() || $alternatif_all->isEmpty() || $penilaian->isEmpty() || !$alternatif_detail) {
                throw new \Exception("Data kriteria, alternatif, atau penilaian tidak lengkap.");
            }

            $matrix = [];
            foreach ($penilaian as $nilai) {
                $matrix[$nilai->alternatif_id][$nilai->kriteria_id] = $nilai->nilai;
            }

            $maxMin = [];
            foreach ($kriteria as $k) {
                $values = [];
                foreach ($alternatif_all as $a) {
                    $values[] = $matrix[$a->id][$k->id] ?? 0;
                }
                if ($k->atribut == 'benefit') {
                    $maxMin[$k->id] = max($values);
                } else {
                    $maxMin[$k->id] = min($values);
                }
            }

            $rincian = [];
            $totalNilaiAkhir = 0;

            foreach ($kriteria as $k) {
                $nilaiAsli = $matrix[$alternatif_detail->id][$k->id] ?? 0;
                $pembagi = $maxMin[$k->id];
                $nilaiNormal = 0;

                if ($pembagi != 0) {
                    if ($k->atribut == 'benefit') {
                        $nilaiNormal = $nilaiAsli / $pembagi;
                    } else { // cost
                        $nilaiNormal = $pembagi / $nilaiAsli;
                    }
                }

                $hasilBobot = $k->bobot * $nilaiNormal;
                $totalNilaiAkhir += $hasilBobot;

                $rincian[] = [
                    'kode_kriteria' => $k->kode_kriteria,
                    'nama_kriteria' => $k->nama_kriteria,
                    'bobot' => $k->bobot,
                    'nilai_asli' => $nilaiAsli,
                    'nilai_normalisasi' => $nilaiNormal,
                    'hasil_bobot' => $hasilBobot,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'nama_supplier' => $alternatif_detail->nama_supplier,
                    'nilai_akhir' => $totalNilaiAkhir,
                    'rincian' => $rincian,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghitung detail: ' . $e->getMessage()
            ], 500);
        }
    }
}
