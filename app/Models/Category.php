<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $name
 * @property string $type
 * @property string|null $icon
 * @property string|null $color
 */
#[Fillable(['name', 'type', 'icon', 'color'])]
class Category extends Model
{
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeDefaults($query, string $type)
    {
        return $query->whereNull('user_id')->where('type', $type);
    }

    public function isDefault(): bool
    {
        return is_null($this->user_id);
    }
}
