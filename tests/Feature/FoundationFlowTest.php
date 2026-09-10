<?php

namespace Tests\Feature;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Household;
use App\Models\RecurringTransaction;
use App\Models\Transaction;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class FoundationFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
    }

    public function test_transaction_crud_and_visibility(): void
    {
        $user = User::factory()->create();
        $category = Category::where('type', 'expense')->first();

        $this->actingAs($user)->post('/transactions', [
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => 1000,
            'currency' => 'PHP',
            'date' => now()->toDateString(),
            'visibility' => 'shared',
            'note' => 'Groceries',
        ])->assertRedirect('/transactions');

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'amount' => 1000,
            'visibility' => 'shared',
        ]);

        $tx = Transaction::first();
        $this->actingAs($user)->patch("/transactions/{$tx->id}", [
            'category_id' => $category->id,
            'type' => 'income',
            'amount' => 2500,
            'currency' => 'PHP',
            'date' => now()->toDateString(),
            'visibility' => 'private',
        ])->assertRedirect('/transactions');

        $this->assertDatabaseHas('transactions', ['id' => $tx->id, 'amount' => 2500, 'visibility' => 'private']);

        $this->actingAs($user)->delete("/transactions/{$tx->id}")->assertRedirect('/transactions');
        $this->assertDatabaseMissing('transactions', ['id' => $tx->id]);
    }

    public function test_household_shows_only_shared_transactions(): void
    {
        $owner = User::factory()->create();
        $member = User::factory()->create();

        $household = Household::create(['name' => 'Home', 'owner_user_id' => $owner->id]);
        $household->members()->attach($owner, ['role' => 'owner']);
        $household->members()->attach($member, ['role' => 'member']);

        $category = Category::where('type', 'expense')->first();

        Transaction::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => 100,
            'currency' => 'PHP',
            'date' => now()->toDateString(),
            'visibility' => 'shared',
        ]);
        Transaction::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => 999,
            'currency' => 'PHP',
            'date' => now()->toDateString(),
            'visibility' => 'private',
        ]);

        $this->actingAs($member)->get("/households/{$household->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->where('totals.expenses', 100)
                ->where('totals.balance', -100)
            );
    }

    public function test_join_household_by_invite_code(): void
    {
        $owner = User::factory()->create();
        $joiner = User::factory()->create();

        $household = Household::create(['name' => 'Home', 'owner_user_id' => $owner->id]);
        $household->members()->attach($owner, ['role' => 'owner']);

        $this->actingAs($joiner)->post('/households/join', [
            'invite_code' => strtolower($household->invite_code),
        ])->assertRedirect("/households/{$household->id}");

        $this->assertTrue($household->fresh()->isMember($joiner));
    }

    public function test_budget_store_and_progress(): void
    {
        $user = User::factory()->create();
        $category = Category::where('type', 'expense')->first();

        $this->actingAs($user)->post('/budgets', [
            'scope' => 'user',
            'category_id' => null,
            'amount' => 5000,
            'period' => 'monthly',
        ])->assertRedirect('/budgets');

        Budget::create([
            'owner_type' => 'user',
            'owner_id' => $user->id,
            'category_id' => $category->id,
            'amount' => 5000,
            'period' => 'monthly',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => 2500,
            'currency' => 'PHP',
            'date' => now()->toDateString(),
            'visibility' => 'private',
        ]);

        $this->actingAs($user)->get('/budgets')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('personalBudgets.0.spent', 2500)
                ->where('personalBudgets.0.percent', 50));
    }

    public function test_recurring_process_generates_transaction(): void
    {
        $user = User::factory()->create();
        $category = Category::where('type', 'income')->first();

        $this->actingAs($user)->post('/recurring', [
            'category_id' => $category->id,
            'type' => 'income',
            'amount' => 15000,
            'currency' => 'PHP',
            'frequency' => 'monthly',
            'visibility' => 'shared',
            'note' => 'Salary',
        ])->assertRedirect('/recurring');

        $this->assertDatabaseHas('recurring_transactions', ['user_id' => $user->id, 'is_active' => true]);

        RecurringTransaction::query()->update(['next_run_date' => now()->toDateString()]);

        Artisan::call('recurring:process');

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'amount' => 15000,
            'note' => 'Salary',
        ]);

        $recurring = RecurringTransaction::first();
        $this->assertTrue($recurring->fresh()->next_run_date->gt(now()), 'next_run_date should advance after processing');
    }

    public function test_privacy_update_changes_default_visibility(): void
    {
        $user = User::factory()->create(['default_visibility' => 'private']);

        $this->actingAs($user)->patch('/settings/privacy', [
            'default_visibility' => 'shared',
        ])->assertRedirect();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'default_visibility' => 'shared',
        ]);
    }

    public function test_transactions_export_csv(): void
    {
        $user = User::factory()->create();
        $category = Category::where('type', 'expense')->first();

        $this->actingAs($user)->post('/transactions', [
            'category_id' => $category->id,
            'type' => 'expense',
            'amount' => 999,
            'currency' => 'PHP',
            'date' => now()->toDateString(),
            'visibility' => 'private',
            'note' => 'CSV test',
        ]);

        $response = $this->actingAs($user)->get('/transactions/export');
        $response->assertOk()
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');

        $content = $response->streamedContent();
        $this->assertStringContainsString('CSV test', $content);
        $this->assertStringContainsString('999', $content);
        $this->assertStringContainsString('Date', $content);
    }
}