<?php

use App\Console\Commands\ProcessRecurringTransactions;
use Illuminate\Support\Facades\Schedule;

Schedule::command(ProcessRecurringTransactions::class)->daily();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');