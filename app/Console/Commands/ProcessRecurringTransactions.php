<?php

namespace App\Console\Commands;

use App\Models\RecurringTransaction;
use Illuminate\Console\Command;

class ProcessRecurringTransactions extends Command
{
    protected $signature = 'recurring:process';

    protected $description = 'Generate transactions for recurring templates that are due.';

    public function handle(): int
    {
        $due = RecurringTransaction::query()
            ->where('is_active', true)
            ->where('next_run_date', '<=', now()->toDateString())
            ->with(['user'])
            ->get();

        if ($due->isEmpty()) {
            $this->info('No recurring transactions due.');

            return self::SUCCESS;
        }

        foreach ($due as $recurring) {
            $recurring->transactions()->create([
                'user_id' => $recurring->user_id,
                'category_id' => $recurring->category_id,
                'type' => $recurring->type,
                'amount' => $recurring->amount,
                'currency' => $recurring->currency,
                'date' => now()->toDateString(),
                'note' => $recurring->note,
                'visibility' => $recurring->visibility,
            ]);

            $frequencies = [
                'daily' => 'addDay',
                'weekly' => 'addWeek',
                'monthly' => 'addMonth',
            ];

            $recurring->next_run_date = now()->{$frequencies[$recurring->frequency]}()->toDateString();
            $recurring->save();

            $this->info("Generated transaction for recurring #{$recurring->id} ({$recurring->user->name}).");
        }

        return self::SUCCESS;
    }
}