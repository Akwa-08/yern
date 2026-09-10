import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import RecurringForm from '@/components/recurring-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import recurring from '@/routes/recurring';
import type { Category, RecurringTransaction } from '@/types';

type Props = {
    recurringTransaction: RecurringTransaction;
    categories: Category[];
};

export default function RecurringEdit({
    recurringTransaction,
    categories,
}: Props) {
    const form = useForm({
        type: recurringTransaction.type,
        amount: String(recurringTransaction.amount),
        currency: recurringTransaction.currency,
        category_id: recurringTransaction.category_id,
        frequency: recurringTransaction.frequency,
        visibility: recurringTransaction.visibility,
        note: recurringTransaction.note ?? '',
        is_active: recurringTransaction.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(recurring.update(recurringTransaction).url);
    };

    return (
        <>
            <Head title="Edit recurring transaction" />

            <div className="flex flex-1 flex-col gap-6">
                <Heading
                    title="Edit recurring transaction"
                    description={`Next run: ${recurringTransaction.next_run_date}`}
                />

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Recurring details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <RecurringForm
                                form={form}
                                categories={categories}
                            />

                            <div className="mt-6 flex items-center gap-2">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(e) =>
                                        form.setData(
                                            'is_active',
                                            e.target.checked,
                                        )
                                    }
                                    className="border-input size-4 rounded"
                                />
                                <Label htmlFor="is_active" className="text-sm">
                                    Active — generates transactions on schedule
                                </Label>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RecurringEdit.layout = {
    breadcrumbs: [
        {
            title: 'Recurring',
            href: recurring.index(),
        },
        {
            title: 'Edit',
        },
    ],
};
