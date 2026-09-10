<?php

namespace Tests\Feature;

use App\Models\Household;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VerifyPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_foundation_pages_load(): void
    {
        $this->seed(CategorySeeder::class);

        $user = User::factory()->create();
        $household = Household::create([
            'name' => 'My Household',
            'owner_user_id' => $user->id,
        ]);
        $household->members()->attach($user->id, ['role' => 'owner']);

        $this->actingAs($user)->get('/dashboard')->assertOk();
        $this->actingAs($user)->get('/transactions')->assertOk();
        $this->actingAs($user)->get('/transactions/create')->assertOk();
        $this->actingAs($user)->get('/households')->assertOk();
        $this->actingAs($user)->get('/households/'.$household->id)->assertOk();
        $this->actingAs($user)->get('/budgets')->assertOk();
        $this->actingAs($user)->get('/recurring')->assertOk();

        $this->assertTrue(true);
    }
}
