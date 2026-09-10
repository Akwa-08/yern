<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $owner_type
 * @property int $owner_id
 * @property int|null $category_id
 * @property string $amount
 * @property string $period
 * @property string|null $start_date
 */
#[Fillable(['owner_type', 'owner_id', 'category_id', 'amount', 'period', 'start_date'])]
class Budget extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'start_date' => 'date',
        ];
    }

    public function owner()
    {
        if ($this->owner_type === 'user') {
            return $this->belongsTo(User::class, 'owner_id');
        }

        return $this->belongsTo(Household::class, 'owner_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
