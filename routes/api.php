<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);
Route::post('products/{id}/image', [ProductController::class, 'updateImage'])->name('products.updateImage');
