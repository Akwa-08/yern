import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import RecurringForm from '@/components/recurring-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import recurring from '@/routes/recurring';
import { formatMoney } from '@/types';
import type { Auth, Category, RecurringTransaction } from '@/types';

type Props = {
    recurringTransactions: RecurringTransaction[];
    categories: Category[];
};

export default function RecurringIndex({
    recurringTransactions,
    categories,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [showForm, setShowForm] = useState(false);

    const form = useForm({
        type: 'expense',
        amount: '',
        currency: 'PHP',
        category_id: undefined as number | undefined,
        frequency: 'monthly',
        visibility:
            (auth.user.default_visibility as 'private' | 'shared') ?? 'shared',
        note: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(recurring.store().url, {
            onSuccess: () => {
                setShowForm(false);
                form.reset('amount', 'note');
            },
        });
    };

    const destroy = (item: RecurringTransaction) => {
        if (window.confirm('Delete this recurring transaction?')) {
            recurring.destroy(item);
        }
    };

    return (
        <>
            <Head title="Recurring transactions" />

            <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <Heading
                        title="Recurring transactions"
                        description="Transactions that auto-create on a schedule"
                    />
                    <Button onClick={() => setShowForm((v) => !v)}>
                        <Plus />
                        New recurring
                    </Button>
                </div>

                {showForm && (
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>New recurring transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit}>
                                <RecurringForm
                                    form={form}
                                    categories={categories}
                                />
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent>
                        {recurringTransactions.length === 0 ? (
                            <div className="py-10 text-center">
                                <p className="text-muted-foreground text-sm">
                                    No recurring transactions yet. Add things
                                    like rent, salary, or subscriptions that
                                    happen on a schedule.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {recurringTransactions.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 py-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span
                                                className="inline-block size-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        item.category?.color ??
                                                        '#94A3B8',
                                                }}
                                            />
                                            <div className="min-w-0">
                                                <p className="flex items-center gap-2 text-sm font-medium">
                                                    {item.category?.name ??
                                                        'No category'}
                                                    <Badge variant="outline">
                                                        {item.frequency}
                                                    </Badge>
                                                    <Badge
                                                        variant={
                                                            item.is_active
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {item.is_active
                                                            ? 'Active'
                                                            : 'Paused'}
                                                    </Badge>
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    Next run:{' '}
                                                    {item.next_run_date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <span
                                                className={
                                                    item.type === 'expense'
                                                        ? 'text-sm font-medium text-red-600'
                                                        : 'text-sm font-medium text-green-600'
                                                }
                                            >
                                                {item.type === 'expense'
                                                    ? '-'
                                                    : '+'}
                                                {formatMoney(
                                                    item.amount,
                                                    item.currency,
                                                )}
                                            </span>
                                            <Link href={recurring.edit(item)}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Pencil />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => destroy(item)}
                                            >
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RecurringIndex.layout = {
    breadcrumbs: [
        {
            title: 'Recurring',
            href: recurring.index(),
        },
    ],
};
