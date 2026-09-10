<?php

use App\Http\Controllers\BudgetController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\RecurringTransactionController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('transactions/export', [TransactionController::class, 'export'])->name('transactions.export');
    Route::get('transactions/create', [TransactionController::class, 'create'])->name('transactions.create');
    Route::post('transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('transactions/{transaction}/edit', [TransactionController::class, 'edit'])->name('transactions.edit');
    Route::patch('transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');

    Route::get('households', [HouseholdController::class, 'index'])->name('household.index');
    Route::post('households', [HouseholdController::class, 'store'])->name('household.store');
    Route::post('households/join', [HouseholdController::class, 'join'])->name('household.join');
    Route::get('households/{household}', [HouseholdController::class, 'show'])->name('household.show');

    Route::get('budgets', [BudgetController::class, 'index'])->name('budgets.index');
    Route::post('budgets', [BudgetController::class, 'store'])->name('budgets.store');
    Route::patch('budgets/{budget}', [BudgetController::class, 'update'])->name('budgets.update');
    Route::delete('budgets/{budget}', [BudgetController::class, 'destroy'])->name('budgets.destroy');

    Route::get('recurring', [RecurringTransactionController::class, 'index'])->name('recurring.index');
    Route::post('recurring', [RecurringTransactionController::class, 'store'])->name('recurring.store');
    Route::get('recurring/{recurringTransaction}/edit', [RecurringTransactionController::class, 'edit'])->name('recurring.edit');
    Route::patch('recurring/{recurringTransaction}', [RecurringTransactionController::class, 'update'])->name('recurring.update');
    Route::delete('recurring/{recurringTransaction}', [RecurringTransactionController::class, 'destroy'])->name('recurring.destroy');
});

require __DIR__.'/settings.php';