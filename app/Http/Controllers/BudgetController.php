<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Transaction;
use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BudgetController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $household = $user->households()->first();

        $personalBudgets = $user->budgets()->with(['category'])->get();

        $householdBudgets = $household
            ? $household->budgets()->with(['category'])->get()
            : collect();

        $period = [
            'year' => (int) $request->input('year', now()->year),
            'month' => (int) $request->input('month', now()->month),
        ];

        $personalBudgets = $this->attachProgress($personalBudgets, fn ($b) => $this->personalSpending($user->id, $b, $period));
        $householdBudgets = $this->attachProgress($householdBudgets, fn ($b) => $this->householdSpending($household, $b, $period));

        return Inertia::render('budgets/index', [
            'personalBudgets' => $personalBudgets,
            'householdBudgets' => $householdBudgets,
            'household' => $household,
            'period' => $period,
        ]);
    }

    public function store(StoreBudgetRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $owner = $validated['scope'] === 'household'
            ? $request->user()->households()->first()
            : $request->user();

        if (! $owner) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('You need a household first.')]);

            return to_route('budgets.index');
        }

        Budget::create([
            'owner_type' => $validated['scope'] === 'household' ? 'household' : 'user',
            'owner_id' => $owner->id,
            'category_id' => $validated['category_id'] ?: null,
            'amount' => $validated['amount'],
            'period' => $validated['period'] ?? 'monthly',
            'start_date' => $validated['start_date'] ?? null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Budget created.')]);

        return to_route('budgets.index');
    }

    public function update(UpdateBudgetRequest $request, Budget $budget): RedirectResponse
    {
        $this->authorize('update', $budget);

        $validated = $request->validated();

        $budget->update([
            'category_id' => $validated['category_id'] ?: null,
            'amount' => $validated['amount'],
            'period' => $validated['period'] ?? $budget->period,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Budget updated.')]);

        return to_route('budgets.index');
    }

    public function destroy(Request $request, Budget $budget): RedirectResponse
    {
        $this->authorize('delete', $budget);

        $budget->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Budget removed.')]);

        return to_route('budgets.index');
    }

    protected function attachProgress($budgets, callable $spendingFn)
    {
        return $budgets->map(function ($budget) use ($spendingFn) {
            $spending = $spendingFn($budget);

            return array_merge($budget->toArray(), [
                'category' => $budget->category,
                'spent' => round($spending, 2),
                'percent' => $budget->amount > 0 ? min(round($spending / $budget->amount * 100, 1), 999) : 0,
            ]);
        })->values();
    }

    protected function personalSpending(int $userId, Budget $budget, array $period): float
    {
        $query = Transaction::query()
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->whereYear('date', $period['year'])
            ->whereMonth('date', $period['month']);

        if ($budget->category_id) {
            $query->where('category_id', $budget->category_id);
        }

        return (float) $query->sum('amount');
    }

    protected function householdSpending($household, Budget $budget, array $period): float
    {
        if (! $household) {
            return 0;
        }

        $memberIds = $household->members()->pluck('users.id');

        $query = Transaction::query()
            ->whereIn('user_id', $memberIds)
            ->where('visibility', 'shared')
            ->where('type', 'expense')
            ->whereYear('date', $period['year'])
            ->whereMonth('date', $period['month']);

        if ($budget->category_id) {
            $query->where('category_id', $budget->category_id);
        }

        return (float) $query->sum('amount');
    }
}