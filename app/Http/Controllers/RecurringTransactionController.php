<?php

namespace App\Http\Controllers;

use App\Models\RecurringTransaction;
use App\Http\Requests\StoreRecurringTransactionRequest;
use App\Http\Requests\UpdateRecurringTransactionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecurringTransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('recurring/index', [
            'recurringTransactions' => $user->recurringTransactions()
                ->with(['category'])
                ->orderBy('is_active', 'desc')
                ->orderBy('next_run_date')
                ->get(),
            'categories' => $this->categoriesFor($user),
        ]);
    }

    public function store(StoreRecurringTransactionRequest $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validated();
        $data['user_id'] = $user->id;
        $data['next_run_date'] = $this->nextRunDate($data['frequency']);

        RecurringTransaction::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Recurring transaction created.')]);

        return to_route('recurring.index');
    }

    public function edit(Request $request, RecurringTransaction $recurringTransaction): Response
    {
        $this->authorize('update', $recurringTransaction);

        return Inertia::render('recurring/edit', [
            'recurringTransaction' => $recurringTransaction,
            'categories' => $this->categoriesFor($request->user()),
        ]);
    }

    public function update(UpdateRecurringTransactionRequest $request, RecurringTransaction $recurringTransaction): RedirectResponse
    {
        $this->authorize('update', $recurringTransaction);

        $recurringTransaction->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Recurring transaction updated.')]);

        return to_route('recurring.index');
    }

    public function destroy(Request $request, RecurringTransaction $recurringTransaction): RedirectResponse
    {
        $this->authorize('delete', $recurringTransaction);

        $recurringTransaction->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Recurring transaction removed.')]);

        return to_route('recurring.index');
    }

    protected function nextRunDate(string $frequency): string
    {
        return match ($frequency) {
            'daily' => now()->addDay()->toDateString(),
            'weekly' => now()->addWeek()->toDateString(),
            default => now()->addMonth()->toDateString(),
        };
    }

    protected function categoriesFor($user)
    {
        return \App\Models\Category::whereNull('user_id')
            ->orWhere('user_id', $user->id)
            ->orderBy('user_id')
            ->get();
    }
}