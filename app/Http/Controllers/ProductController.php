<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\ProductRequest;
use Illuminate\Support\Facades\Log;


class ProductController extends Controller
{


    //READ ALL PRODUCTS 
    public function index(Request $request)
    {
        // Fetch all products with their associated category
        $limit = $request->input('limit', 10); // Default limit to 10 products if not provided
        $products = Product::with('category')->paginate($limit);
        return response()->json($products);
    }

    //CREATE NEW PRODUCT
    public function store(ProductRequest $request)
    {
        // Create a new product with validated data
        $product = Product::create($request->validated());

        // Handle image upload if given by calling the upload image function
        if ($request->hasFile('image')) {
            $product->image = $this->uploadImage($request->file('image'));
            $product->save();
        }

        return response()->json(['message' => 'Product created successfully!', 'product' => $product], 201);
    }

    //FUNCTION THAT HANDLES IMAGE UPLOADING
    private function uploadImage($image)
    {
        // Store the image in the 'public' disk
        $imagePath = $image->store('images', 'public');

        // Return the relative path of the image
        return $imagePath;
    }


    //READ PRODUCT BY ID
    public function show($id)
    {
        // Fetch a specific product with its category
        $product = Product::with('category')->findOrFail($id);
        return response()->json($product);
    }


    //UPDATE PRODUCT (only data ,image update is handled seperately by another endpoint)
    public function update(ProductRequest $request, $id)
    {
        Log::info('Update Request:', $request->all());

        $product = Product::findOrFail($id);
        $product->update($request->validated());

        return response()->json(['message' => 'Product updated successfully!', 'product' => $product]);
    }



    //DELETE PRODUCT
    public function destroy($id)
    {
        //fetch product by id then Delete the product
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully!']);
    }



    //UPDATE IMAGE
    public function updateImage($id, Request $request)
    {
        $product = Product::findOrFail($id);


        if ($request->hasFile('image')) {
            $product->image = $this->uploadImage($request->file('image'));
            $product->save();

            return response()->json(['message' => 'Image updated successfully', 'product' => $product]);
        }

        return response()->json(['message' => 'No image file provided'], 400);
    }



}
