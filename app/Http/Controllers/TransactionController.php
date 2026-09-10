<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Household;
use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $household = $user->households()->first();

        $query = Transaction::query()
            ->where('user_id', $user->id)
            ->with(['category']);

        $this->applyFilters($request, $query);

        switch ($request->input('sort')) {
            case 'amount':
                $query->orderBy('amount', 'desc');
                break;
            case 'amount_asc':
                $query->orderBy('amount', 'asc');
                break;
            default:
                $query->orderByDesc('date');
                break;
        }

        $transactions = $query->paginate(25)->withQueryString();

        $categories = $this->categoriesFor($user);

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'categories' => $categories,
            'household' => $household,
            'filters' => $this->filters($request),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('transactions/create', [
            'categories' => $this->categoriesFor($request->user()),
        ]);
    }

    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validated();
        $data['user_id'] = $user->id;

        if ($request->hasFile('receipt')) {
            $data['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
        }

        Transaction::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Transaction added.')]);

        return to_route('transactions.index');
    }

    public function edit(Request $request, Transaction $transaction): Response
    {
        $this->authorize('update', $transaction);

        return Inertia::render('transactions/edit', [
            'transaction' => $transaction->load('category'),
            'categories' => $this->categoriesFor($request->user()),
        ]);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction): RedirectResponse
    {
        $this->authorize('update', $transaction);

        $data = $request->validated();

        if ($request->hasFile('receipt')) {
            $data['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
        }

        $transaction->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Transaction updated.')]);

        return to_route('transactions.index');
    }

    public function destroy(Request $request, Transaction $transaction): RedirectResponse
    {
        $this->authorize('delete', $transaction);

        $transaction->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Transaction deleted.')]);

        return to_route('transactions.index');
    }

    public function export(Request $request)
    {
        $user = $request->user();

        $query = Transaction::query()
            ->where('user_id', $user->id)
            ->with(['category']);

        $this->applyFilters($request, $query);

        $transactions = $query->orderByDesc('date')->get();

        $filename = 'transactions-'.now()->format('Ymd-His').'.csv';

        return response()->streamDownload(function () use ($transactions) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Date',
                'Type',
                'Category',
                'Amount',
                'Currency',
                'Visibility',
                'Note',
            ]);

            foreach ($transactions as $transaction) {
                fputcsv($handle, [
                    $transaction->date,
                    $transaction->type,
                    $transaction->category?->name ?? '',
                    $transaction->amount,
                    $transaction->currency,
                    $transaction->visibility,
                    $transaction->note ?? '',
                ]);
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    protected function applyFilters(Request $request, $query): void
    {
        $filters = $this->filters($request);

        if ($filters['type']) {
            $query->where('type', $filters['type']);
        }

        if ($filters['category_id']) {
            $query->where('category_id', $filters['category_id']);
        }

        if ($filters['visibility'] && $filters['visibility'] !== 'all') {
            $query->where('visibility', $filters['visibility']);
        }

        if ($filters['from']) {
            $query->where('date', '>=', $filters['from']);
        }

        if ($filters['to']) {
            $query->where('date', '<=', $filters['to']);
        }

        if ($filters['min_amount'] !== null && $filters['min_amount'] !== '') {
            $query->where('amount', '>=', $filters['min_amount']);
        }

        if ($filters['max_amount'] !== null && $filters['max_amount'] !== '') {
            $query->where('amount', '<=', $filters['max_amount']);
        }

        if ($filters['query']) {
            $query->where(function ($q) use ($filters) {
                $q->where('note', 'like', '%'.$filters['query'].'%')
                    ->orWhereHas('category', function ($c) use ($filters) {
                        $c->where('name', 'like', '%'.$filters['query'].'%');
                    });
            });
        }
    }

    protected function filters(Request $request): array
    {
        return [
            'query' => (string) $request->input('query', ''),
            'type' => (string) $request->input('type', ''),
            'category_id' => (string) $request->input('category_id', ''),
            'visibility' => (string) $request->input('visibility', 'all'),
            'from' => (string) $request->input('from', ''),
            'to' => (string) $request->input('to', ''),
            'min_amount' => $request->input('min_amount', ''),
            'max_amount' => $request->input('max_amount', ''),
            'sort' => (string) $request->input('sort', 'date'),
        ];
    }

    protected function categoriesFor($user)
    {
        return Category::whereNull('user_id')
            ->orWhere('user_id', $user->id)
            ->orderBy('user_id')
            ->get();
    }
}