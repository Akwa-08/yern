<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->decimal('amount', 12, 2);
            $table->string('currency')->default('PHP');
            $table->date('date');
            $table->text('note')->nullable();
            $table->string('visibility')->default('shared');
            $table->string('receipt_path')->nullable();
            $table->foreignId('recurring_transaction_id')->nullable()->constrained('recurring_transactions')->nullOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'date']);
            $table->index(['category_id', 'date']);
            $table->index('visibility');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
