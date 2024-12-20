<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     *
     *
     * @return void
     */
    public function boot()
    {
        // Registering routes for web
        Route::middleware('web')
            ->group(base_path('routes/web.php'));

        // Registering routes for api
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));
    }

    /**
     * 
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
