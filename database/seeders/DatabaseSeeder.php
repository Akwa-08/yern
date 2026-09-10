<?php

namespace Database\Seeders;

use App\Models\Household;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
        ]);

        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );

        Household::firstOrCreate(
            ['owner_user_id' => $testUser->id],
            ['name' => 'My Household'],
        )->members()->syncWithoutDetaching($testUser->id, ['role' => 'owner']);

        User::firstOrCreate(
            ['email' => 'partner@example.com'],
            [
                'name' => 'Partner',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );
    }
}