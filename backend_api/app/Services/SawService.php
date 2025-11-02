<?php

namespace App\Services;

use App\Models\Kriteria;
use App\Models\Alternatif;
use App\Models\Penilaian;

class SawService
{
    public function hitungPeringkat()
    {
        // --- TAHAP 1: AMBIL SEMUA DATA ---
        $kriteria = Kriteria::all();
        $alternatif = Alternatif::all();
        $penilaian = Penilaian::all();

        // Kalo data kosong, lempar error
        if ($kriteria->isEmpty() || $alternatif->isEmpty() || $penilaian->isEmpty()) {
            throw new \Exception("Data kriteria, alternatif, atau penilaian tidak boleh kosong.");
        }

        // --- TAHAP 2: BIKIN MATRIKS NILAI (buat gampang diakses) ---
        // Bikin jadi array kayak gini: $matrix[alternatif_id][kriteria_id] = nilai
        $matrix = [];
        foreach ($penilaian as $nilai) {
            $matrix[$nilai->alternatif_id][$nilai->kriteria_id] = $nilai->nilai;
        }

        // --- TAHAP 3: CARI MAX/MIN TIAP KRITERIA ---
        $maxMin = [];
        foreach ($kriteria as $k) {
            $values = [];
            foreach ($alternatif as $a) {
                // Pastiin nilai ada, kalo gak ada, kasih 0 (atau error)
                $values[] = $matrix[$a->id][$k->id] ?? 0;
            }

            if ($k->atribut == 'benefit') {
                $maxMin[$k->id] = max($values);
            } else { // cost
                $maxMin[$k->id] = min($values);
            }
        }

        // --- TAHAP 4: NORMALISASI (Matriks R) ---
        $normalisasi = [];
        foreach ($alternatif as $a) {
            foreach ($kriteria as $k) {
                $nilaiAsli = $matrix[$a->id][$k->id];
                $pembagi = $maxMin[$k->id];

                // Hindari bagi dengan nol
                if ($pembagi == 0) {
                    $normalisasi[$a->id][$k->id] = 0;
                    continue;
                }

                if ($k->atribut == 'benefit') {
                    $normalisasi[$a->id][$k->id] = $nilaiAsli / $pembagi;
                } else { // cost
                    $normalisasi[$a->id][$k->id] = $pembagi / $nilaiAsli;
                }
            }
        }

        // --- TAHAP 5: PERANGKINGAN (V) ---
        $hasilAkhir = [];
        foreach ($alternatif as $a) {
            $totalNilai = 0;
            foreach ($kriteria as $k) {
                $bobot = $k->bobot;
                $nilaiNormal = $normalisasi[$a->id][$k->id];
                
                $totalNilai += ($bobot * $nilaiNormal);
            }
            $hasilAkhir[] = [
                'id_alternatif' => $a->id,
                'nama_supplier' => $a->nama_supplier,
                'nilai_akhir' => $totalNilai
            ];
        }

        // --- TAHAP 6: SORTING (URUTKAN DARI TERTINGGI) ---
        // 'usort' buat ngurutin array
        usort($hasilAkhir, function ($a, $b) {
            return $b['nilai_akhir'] <=> $a['nilai_akhir']; // <=> operator spaceship (b > a)
        });

        // Tambahin Peringkat
        $peringkat = 1;
        $hasilDenganPeringkat = [];
        foreach($hasilAkhir as $hasil) {
             $hasil['peringkat'] = $peringkat++;
             $hasilDenganPeringkat[] = $hasil;
        }

        return $hasilDenganPeringkat;
    }
}