<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $household = $user->households()->with(['members'])->first();

        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);

        $transactions = Transaction::query()
            ->where('user_id', $user->id)
            ->with(['category'])
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderByDesc('date')
            ->get();

        $expenses = $transactions->where('type', 'expense')->sum('amount');
        $income = $transactions->where('type', 'income')->sum('amount');

        $byCategory = $transactions
            ->groupBy(fn (Transaction $t) => $t->category->name)
            ->map(fn ($group) => [
                'label' => $group->first()->category->name,
                'color' => $group->first()->category->color,
                'total' => round($group->sum('amount'), 2),
                'expense_total' => round($group->where('type', 'expense')->sum('amount'), 2),
                'income_total' => round($group->where('type', 'income')->sum('amount'), 2),
            ])
            ->values()
            ->sortByDesc('expense_total')
            ->values();

        $recent = $user->transactions()
            ->with(['category'])
            ->orderByDesc('date')
            ->limit(8)
            ->get();

        $isCurrentMonth = $year === (int) now()->year && $month === (int) now()->month;

        $trend = collect(range(5, 0))
            ->map(fn ($offset) => now()->subMonthsNoOverflow($offset))
            ->mapWithKeys(function ($date) use ($user) {
                $rows = Transaction::query()
                    ->where('user_id', $user->id)
                    ->whereYear('date', $date->year)
                    ->whereMonth('date', $date->month)
                    ->get();

                return [
                    $date->format('M') => [
                        'month' => $date->format('M Y'),
                        'expenses' => round($rows->where('type', 'expense')->sum('amount'), 2),
                        'income' => round($rows->where('type', 'income')->sum('amount'), 2),
                    ],
                ];
            })
            ->values();

        return Inertia::render('dashboard', [
            'period' => ['year' => $year, 'month' => $month],
            'totals' => [
                'expenses' => round($expenses, 2),
                'income' => round($income, 2),
                'balance' => round($income - $expenses, 2),
            ],
            'byCategory' => $byCategory,
            'recent' => $recent,
            'household' => $household,
            'isCurrentMonth' => $isCurrentMonth,
            'trend' => $trend,
        ]);
    }
}