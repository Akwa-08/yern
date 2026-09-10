<?php

namespace App\Policies;

use App\Models\Budget;
use App\Models\User;

class BudgetPolicy
{
    public function update(User $user, Budget $budget): bool
    {
        return $this->owns($user, $budget);
    }

    public function delete(User $user, Budget $budget): bool
    {
        return $this->owns($user, $budget);
    }

    protected function owns(User $user, Budget $budget): bool
    {
        if ($budget->owner_type === 'user') {
            return $budget->owner_id === $user->id;
        }

        $household = $user->households()->where('households.id', $budget->owner_id)->first();

        return $household && $household->isOwner($user);
    }
}