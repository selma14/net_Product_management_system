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
        Schema::create('products', function (Blueprint $table) {
            //P-KEY
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            //F-KEY
            $table->unsignedBigInteger('category_id');
            $table->string('image')->nullable();
            $table->timestamps();

            // foreign key constraint
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
