<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kriterias', function (Blueprint $table) {
            // ▼▼▼ TAMBAH KOLOM BARU ▼▼▼
            $table->string('unit', 50)->nullable()->after('bobot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kriterias', function (Blueprint $table) {
            // ▼▼▼ HAPUS KOLOM KALO DI ROLLBACK ▼▼▼
            $table->dropColumn('unit');
        });
    }
};
