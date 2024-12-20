<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
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
        ];
    }
}
