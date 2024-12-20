<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // allowing mass assignement for all fields (beside id ofc)
    protected $fillable = [
        'name', 'description', 'price', 'category_id', 'image'
    ];

   
    //RELATION BETWEEN ENTITIES to get the category to which belongs this specific product
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
