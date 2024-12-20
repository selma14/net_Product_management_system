<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\CategoryRequest;

class CategoryController extends Controller
{
    //READ ALL CATEGORIES
    public function index()
    {
        // Fetch all categories
        $categories = Category::all();
        return response()->json($categories);
    }

    //CREATE NEW CATEGORY
    public function store(CategoryRequest $request)
    {
        // Create a new category with validated data
        $category = Category::create($request->validated());
        return response()->json(['message' => 'Category created successfully!', 'category' => $category], 201);
    }

    //READ CATEGORY BY ID
    public function show($id)
    {
        // Fetch a specific category
        $category = Category::with('products')->findOrFail($id);
        return response()->json($category);
    }

    //UPDATE CATEGORY
    public function update(CategoryRequest $request, $id)
    {
        // Fetch the category to be updated
        $category = Category::findOrFail($id);

        // Update category with validated data
        $category->update($request->validated());
        return response()->json(['message' => 'Category updated successfully!', 'category' => $category]);
    }

    //DELETE CATEGORY
    public function destroy($id)
    {
        // Delete the category
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully!']);
    }
}
