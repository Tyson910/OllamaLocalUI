<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Convo;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // create 500 users
        User::factory(500)
        // each user gets 50 convos
        ->has(Convo::factory()->count(50))
        ->create();
    }
}
