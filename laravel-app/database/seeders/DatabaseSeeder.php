<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Convo;
use App\Models\Message;

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
            ->has(
                // each user gets 50 convos
                Convo::factory(50)
                    ->has(
                        // each convo should have 10 messages
                        Message::factory()->count(10)
                    )
            )
            ->create();
    }
}
