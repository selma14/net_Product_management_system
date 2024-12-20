<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    // allowing mass assignement for field name ,aka we can pass an array of data (name, price ..etc)in one request to create or update
    //the product instead of having to create then set each field manually
    protected $fillable = [
        'name'
    ];

    //RELATION BETWEEN ENTITIES to get products that belong to specific category
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
