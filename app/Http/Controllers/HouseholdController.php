<?php

namespace App\Http\Controllers;

use App\Http\Requests\JoinHouseholdRequest;
use App\Http\Requests\StoreHouseholdRequest;
use App\Models\Household;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HouseholdController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('households/index', [
            'household' => $user->households()->with(['members'])->first(),
        ]);
    }

    public function store(StoreHouseholdRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->households()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('You already belong to a household.')]);

            return to_route('household.index');
        }

        $household = Household::create([
            'name' => $request->validated('name'),
            'owner_user_id' => $user->id,
        ]);

        $household->members()->attach($user->id, ['role' => 'owner']);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Household created.')]);

        return to_route('household.show', $household);
    }

    public function join(JoinHouseholdRequest $request): RedirectResponse
    {
        $user = $request->user();
        $code = strtoupper($request->validated('invite_code'));

        if ($user->households()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('You already belong to a household.')]);

            return to_route('household.index');
        }

        $household = Household::where('invite_code', $code)->first();

        if (! $household) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('That invite code is invalid.')]);

            return to_route('household.index');
        }

        if (! $household->isMember($user)) {
            $household->members()->attach($user->id, ['role' => 'member']);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('You joined the household.')]);

        return to_route('household.show', $household);
    }

    public function show(Request $request, Household $household): Response
    {
        $this->authorize('view', $household);

        $user = $request->user();

        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);

        $memberIds = $household->members()->pluck('users.id');

        $transactions = Transaction::query()
            ->whereIn('user_id', $memberIds)
            ->where('visibility', 'shared')
            ->with(['user', 'category'])
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderByDesc('date')
            ->paginate(25)
            ->withQueryString();

        $expenses = $transactions->where('type', 'expense')->sum('amount');
        $income = $transactions->where('type', 'income')->sum('amount');

        $byCategory = $household
            ->sharedTransactions()
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get()
            ->groupBy(fn (Transaction $t) => $t->category->name)
            ->map(fn ($group) => [
                'label' => $group->first()->category->name,
                'color' => $group->first()->category->color,
                'total' => round($group->sum('amount'), 2),
                'expense_total' => round($group->where('type', 'expense')->sum('amount'), 2),
                'income_total' => round($group->where('type', 'income')->sum('amount'), 2),
            ])
            ->values();

        $byPerson = $household
            ->sharedTransactions()
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->get()
            ->groupBy(fn (Transaction $t) => $t->user->name)
            ->map(fn ($group) => [
                'label' => $group->first()->user->name,
                'expense_total' => round($group->where('type', 'expense')->sum('amount'), 2),
                'income_total' => round($group->where('type', 'income')->sum('amount'), 2),
            ])
            ->values();

        return Inertia::render('households/show', [
            'household' => $household->load(['members', 'owner']),
            'transactions' => $transactions,
            'period' => ['year' => $year, 'month' => $month],
            'totals' => [
                'expenses' => round($expenses, 2),
                'income' => round($income, 2),
                'balance' => round($income - $expenses, 2),
            ],
            'byCategory' => $byCategory,
            'byPerson' => $byPerson,
            'isCurrentUserOwner' => $household->isOwner($user),
        ]);
    }
}