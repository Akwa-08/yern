import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import TransactionForm from '@/components/transaction-form';
import transactions from '@/routes/transactions';
import type { Category, Transaction } from '@/types';

type Props = {
    transaction: Transaction;
    categories: Category[];
};

export default function EditTransaction({ transaction, categories }: Props) {
    const form = useForm({
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        category_id: transaction.category_id,
        date: transaction.date,
        note: transaction.note ?? '',
        visibility: transaction.visibility,
    });

    return (
        <>
            <Head title="Edit transaction" />
            <Heading
                title="Edit transaction"
                description="Update the details of this entry"
            />

            <form
                className="max-w-2xl"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.patch(transactions.update(transaction).url);
                }}
            >
                <TransactionForm
                    form={form}
                    categories={categories}
                    initial={{
                        receipt_path: transaction.receipt_path,
                    }}
                />
            </form>
        </>
    );
}

EditTransaction.layout = {
    breadcrumbs: [
        {
            title: 'Transactions',
            href: transactions.index(),
        },
        {
            title: 'Edit',
        },
    ],
};
