<?php

namespace App\Policies;

use App\Models\RecurringTransaction;
use App\Models\User;

class RecurringTransactionPolicy
{
    public function update(User $user, RecurringTransaction $recurringTransaction): bool
    {
        return $recurringTransaction->user_id === $user->id;
    }

    public function delete(User $user, RecurringTransaction $recurringTransaction): bool
    {
        return $recurringTransaction->user_id === $user->id;
    }
}