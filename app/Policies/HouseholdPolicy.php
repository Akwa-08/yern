<?php

namespace App\Policies;

use App\Models\Household;
use App\Models\User;

class HouseholdPolicy
{
    public function view(User $user, Household $household): bool
    {
        return $household->isMember($user) || $household->isOwner($user);
    }

    public function update(User $user, Household $household): bool
    {
        return $household->isOwner($user);
    }

    public function delete(User $user, Household $household): bool
    {
        return $household->isOwner($user);
    }
}