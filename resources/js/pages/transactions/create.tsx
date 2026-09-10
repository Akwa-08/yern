import { Head, useForm, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import TransactionForm from '@/components/transaction-form';
import transactions from '@/routes/transactions';
import type { Auth, Category } from '@/types';

type Props = {
    categories: Category[];
};

export default function CreateTransaction({ categories }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const defaultVisibility =
        auth.user.default_visibility === 'private' ? 'private' : 'shared';

    const form = useForm({
        type: 'expense' as 'expense' | 'income',
        amount: '',
        currency: 'PHP',
        category_id: undefined as number | undefined,
        date: new Date().toISOString().slice(0, 10),
        note: '',
        visibility: defaultVisibility as 'private' | 'shared',
    });

    return (
        <>
            <Head title="Add transaction" />
            <Heading
                title="Add transaction"
                description="Record an expense or income entry"
            />

            <form
                className="max-w-2xl"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(transactions.store().url);
                }}
            >
                <TransactionForm form={form} categories={categories} />
            </form>
        </>
    );
}

CreateTransaction.layout = {
    breadcrumbs: [
        {
            title: 'Transactions',
            href: transactions.index(),
        },
        {
            title: 'Add',
            href: transactions.create(),
        },
    ],
};
