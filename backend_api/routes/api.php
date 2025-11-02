<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KriteriaController;
use App\Http\Controllers\Api\AlternatifController;
use App\Http\Controllers\Api\PenilaianController;
use App\Http\Controllers\Api\SawController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('/kriteria', KriteriaController::class);
Route::apiResource('alternatif', AlternatifController::class);
Route::get('/penilaian', [PenilaianController::class, 'index']); 
Route::post('/penilaian', [PenilaianController::class, 'store']);
Route::get('/hitung', [SawController::class, 'hitung']);
Route::get('/hitung-detail/{id}', [SawController::class, 'hitungDetail']);