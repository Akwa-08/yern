import { Head, router, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import budgets from '@/routes/budgets';
import householdRoutes from '@/routes/household';
import { formatMoney } from '@/types';
import type { Budget, Category, Household } from '@/types';

type Props = {
    personalBudgets: Budget[];
    householdBudgets: Budget[];
    household: Household | null;
    period: { year: number; month: number };
};

export default function BudgetIndex({
    personalBudgets,
    householdBudgets,
    household,
}: Props) {
    const [showForm, setShowForm] = useState(false);

    const allCategories = [
        ...new Map(
            [
                ...personalBudgets.map((b) => b.category),
                ...householdBudgets.map((b) => b.category),
            ]
                .filter(Boolean)
                .map((c) => [c!.id, c!]),
        ).values(),
    ];

    const form = useForm({
        scope: 'user' as 'user' | 'household',
        category_id: '' as string,
        amount: '',
        period: 'monthly' as 'weekly' | 'monthly',
    });

    const submitBudget = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(budgets.store().url, {
            onSuccess: () => {
                setShowForm(false);
                form.reset();
            },
        });
    };

    const deleteBudget = (budget: Budget) => {
        if (window.confirm('Delete this budget?')) {
            router.delete(budgets.destroy(budget));
        }
    };

    const renderBudgetRow = (budget: Budget) => {
        const percent = budget.percent ?? 0;
        const overLimit = percent > 100;

        return (
            <div key={`${budget.owner_type}-${budget.id}`} className="py-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex min-w-0 items-center gap-2">
                        <span
                            className="inline-block size-2.5 shrink-0 rounded-full"
                            style={{
                                backgroundColor:
                                    budget.category?.color ?? '#94A3B8',
                            }}
                        />
                        <p className="truncate">
                            {budget.category?.name ?? 'Overall'}
                        </p>
                        <Badge variant="outline">{budget.period}</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500">
                            {formatMoney(budget.spent ?? 0)} /{' '}
                            {formatMoney(budget.amount)}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBudget(budget)}
                        >
                            <Trash2 />
                        </Button>
                    </div>
                </div>
                <div className="bg-muted mt-1.5 h-2.5 overflow-hidden rounded-full">
                    <div
                        className={`h-full rounded-full transition-all ${
                            overLimit
                                ? 'bg-red-500'
                                : percent > 80
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                </div>
                {overLimit && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                        Over budget by{' '}
                        {formatMoney(
                            (budget.spent ?? 0) - Number(budget.amount),
                        )}
                    </p>
                )}
                {!overLimit && percent > 80 && (
                    <p className="mt-1 text-xs text-amber-600">
                        {percent.toFixed(0)}% used — approaching your limit
                    </p>
                )}
            </div>
        );
    };

    return (
        <>
            <Head title="Budgets" />

            <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <Heading
                        title="Budgets"
                        description="Set spending limits per category"
                    />
                    <Button onClick={() => setShowForm((v) => !v)}>
                        <Plus />
                        Add budget
                    </Button>
                </div>

                {showForm && (
                    <form onSubmit={submitBudget} className="max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle>New budget</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="budget-scope">
                                            Scope
                                        </Label>
                                        <Select
                                            name="scope"
                                            value={form.data.scope}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'scope',
                                                    value as
                                                        | 'user'
                                                        | 'household',
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="budget-scope"
                                                className="w-full"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">
                                                    Personal (all your spending)
                                                </SelectItem>
                                                <SelectItem
                                                    value="household"
                                                    disabled={!household}
                                                >
                                                    Household (shared spending)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={form.errors.scope}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="budget-category">
                                            Category
                                        </Label>
                                        <Select
                                            name="category_id"
                                            value={form.data.category_id}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'category_id',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="budget-category"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Overall budget" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">
                                                    Overall (all categories)
                                                </SelectItem>
                                                {allCategories.map(
                                                    (category) => {
                                                        const c =
                                                            category as Category;
                                                        return (
                                                            <SelectItem
                                                                key={c.id}
                                                                value={String(
                                                                    c.id,
                                                                )}
                                                            >
                                                                {c.name}
                                                            </SelectItem>
                                                        );
                                                    },
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={form.errors.category_id}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="budget-amount">
                                            Amount
                                        </Label>
                                        <Input
                                            id="budget-amount"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="0.00"
                                            value={form.data.amount}
                                            onChange={(e) =>
                                                form.setData(
                                                    'amount',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={form.errors.amount}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="budget-period">
                                            Period
                                        </Label>
                                        <Select
                                            name="period"
                                            value={form.data.period}
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'period',
                                                    value as
                                                        | 'weekly'
                                                        | 'monthly',
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id="budget-period"
                                                className="w-full"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">
                                                    Monthly
                                                </SelectItem>
                                                <SelectItem value="weekly">
                                                    Weekly
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={form.errors.period}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-4">
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        Create budget
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Personal budgets</CardTitle>
                            <span className="text-muted-foreground text-xs">
                                Counts all your transactions
                            </span>
                        </CardHeader>
                        <CardContent>
                            {personalBudgets.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">
                                    No personal budgets yet.
                                </p>
                            ) : (
                                <div className="divide-y">
                                    {personalBudgets.map(renderBudgetRow)}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Household budgets</CardTitle>
                            <span className="text-muted-foreground text-xs">
                                Counts shared transactions only
                            </span>
                        </CardHeader>
                        <CardContent>
                            {!household ? (
                                <div className="py-6 text-center">
                                    <p className="text-muted-foreground text-sm">
                                        Create or join a household to set joint
                                        budgets.
                                    </p>
                                    <a
                                        href={householdRoutes.index().url}
                                        className="text-primary mt-2 inline-block text-sm underline"
                                    >
                                        Go to Household
                                    </a>
                                </div>
                            ) : householdBudgets.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">
                                    No household budgets yet.
                                </p>
                            ) : (
                                <div className="divide-y">
                                    {householdBudgets.map(renderBudgetRow)}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

BudgetIndex.layout = {
    breadcrumbs: [
        {
            title: 'Budgets',
            href: budgets.index(),
        },
    ],
};
