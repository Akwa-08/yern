<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function view(User $user, Transaction $transaction): bool
    {
        return $transaction->user_id === $user->id
            || ($transaction->visibility === 'shared' && $this->sharesHouseholdWith($user, $transaction));
    }

    public function update(User $user, Transaction $transaction): bool
    {
        return $transaction->user_id === $user->id;
    }

    public function delete(User $user, Transaction $transaction): bool
    {
        return $transaction->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    protected function sharesHouseholdWith(User $user, Transaction $transaction): bool
    {
        $householdIds = $user->households()->pluck('households.id');

        return $householdIds->intersect($transaction->user->households()->pluck('households.id'))->isNotEmpty();
    }
}