<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $name
 * @property string $invite_code
 * @property int $owner_user_id
 */
#[Fillable(['name', 'owner_user_id'])]
class Household extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [];
    }

    protected static function booted(): void
    {
        static::creating(function (Household $household) {
            if (empty($household->invite_code)) {
                $household->invite_code = strtoupper(Str::random(8));
            }
        });
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'household_user', 'household_id', 'user_id')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function sharedTransactions()
    {
        $memberIds = $this->members()->pluck('users.id');

        return Transaction::whereIn('user_id', $memberIds)
            ->where('visibility', 'shared')
            ->with(['user', 'category']);
    }

    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class, 'owner_id')->where('owner_type', 'household');
    }

    public function isMember(User $user): bool
    {
        return $this->members()->where('user_id', $user->id)->exists();
    }

    public function isOwner(User $user): bool
    {
        return $this->owner_user_id === $user->id;
    }
}
