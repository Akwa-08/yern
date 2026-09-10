<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $expenseCategories = [
            ['name' => 'Food', 'type' => 'expense', 'icon' => 'utensils', 'color' => '#EF4444'],
            ['name' => 'Transport', 'type' => 'expense', 'icon' => 'car', 'color' => '#3B82F6'],
            ['name' => 'Utilities', 'type' => 'expense', 'icon' => 'zap', 'color' => '#F59E0B'],
            ['name' => 'Rent', 'type' => 'expense', 'icon' => 'home', 'color' => '#8B5CF6'],
            ['name' => 'Subscriptions', 'type' => 'expense', 'icon' => 'credit-card', 'color' => '#EC4899'],
            ['name' => 'Shopping', 'type' => 'expense', 'icon' => 'shopping-bag', 'color' => '#F97316'],
            ['name' => 'Health', 'type' => 'expense', 'icon' => 'heart-pulse', 'color' => '#10B981'],
            ['name' => 'Entertainment', 'type' => 'expense', 'icon' => 'film', 'color' => '#6366F1'],
            ['name' => 'Personal', 'type' => 'expense', 'icon' => 'user', 'color' => '#64748B'],
        ];

        $incomeCategories = [
            ['name' => 'Allowance', 'type' => 'income', 'icon' => 'wallet', 'color' => '#22C55E'],
            ['name' => 'Salary', 'type' => 'income', 'icon' => 'briefcase', 'color' => '#0EA5E9'],
            ['name' => 'Side Job', 'type' => 'income', 'icon' => 'laptop', 'color' => '#14B8A6'],
            ['name' => 'Gifts', 'type' => 'income', 'icon' => 'gift', 'color' => '#D946EF'],
            ['name' => 'Other', 'type' => 'income', 'icon' => 'plus-circle', 'color' => '#94A3B8'],
        ];

        foreach (array_merge($expenseCategories, $incomeCategories) as $category) {
            Category::firstOrCreate(
                ['name' => $category['name'], 'type' => $category['type']],
                $category,
            );
        }
    }
}
