<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $category_id
 * @property string $type
 * @property string $amount
 * @property string $currency
 * @property string $date
 * @property string|null $note
 * @property string $visibility
 * @property string|null $receipt_path
 * @property int|null $recurring_transaction_id
 */
#[Fillable(['user_id', 'category_id', 'type', 'amount', 'currency', 'date', 'note', 'visibility', 'receipt_path', 'recurring_transaction_id'])]
class Transaction extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function recurringTransaction(): BelongsTo
    {
        return $this->belongsTo(RecurringTransaction::class);
    }

    public function isPrivate(): bool
    {
        return $this->visibility === 'private';
    }
}
