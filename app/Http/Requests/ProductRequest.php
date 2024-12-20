<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    //SPECIFY AUTHORIZED USERS TO MAKE THIS REQUEST
    public function authorize(): bool
    {
        return true;  // currently all users are allowed
    }

    //DEFINE VALIDATION RULES THAT APPLY TO THIS REQUEST
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|file|image|max:2048',

        ];
    }
}
