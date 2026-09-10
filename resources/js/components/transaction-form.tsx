import { Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Lock, Share2 } from 'lucide-react';
import type { Category } from '@/types';
import transactions from '@/routes/transactions';

type FormConfig = {
    data: Record<string, unknown>;
    setData: (key: string, value: unknown) => void;
    errors: Record<string, string>;
    processing: boolean;
    transform: (
        fn: (data: Record<string, unknown>) => Record<string, unknown>,
    ) => void;
    submit: () => void;
};

type TransactionFormProps = {
    form: FormConfig;
    categories: Category[];
    initial?: {
        type?: 'expense' | 'income';
        amount?: string;
        date?: string;
        note?: string;
        visibility?: 'private' | 'shared';
        category_id?: number;
        currency?: string;
        receipt_path?: string | null;
    };
};

export default function TransactionForm({
    form,
    categories,
    initial = {},
}: TransactionFormProps) {
    const expenseCategories =
        categories.filter((c) => c.type === 'expense') ?? [];
    const incomeCategories =
        categories.filter((c) => c.type === 'income') ?? [];

    return (
        <div className="space-y-6">
            {initial.receipt_path && (
                <div>
                    <Label>Current receipt</Label>
                    <a
                        href={initial.receipt_path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary mt-1 inline-block text-sm underline"
                    >
                        View current receipt
                    </a>
                </div>
            )}

            <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                    name="type"
                    value={form.data.type as string}
                    onValueChange={(value) => form.setData('type', value)}
                >
                    <SelectTrigger id="type" className="w-full">
                        <SelectValue placeholder="Choose a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                </Select>
                <InputError className="mt-2" message={form.errors.type} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="amount"
                    placeholder="0.00"
                    value={form.data.amount as string}
                    onChange={(e) => form.setData('amount', e.target.value)}
                />
                <InputError className="mt-2" message={form.errors.amount} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                    name="currency"
                    value={(form.data.currency as string) ?? 'PHP'}
                    onValueChange={(value) => form.setData('currency', value)}
                >
                    <SelectTrigger id="currency" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PHP">
                            PHP – Philippine Peso
                        </SelectItem>
                        <SelectItem value="USD">USD – US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR – Euro</SelectItem>
                        <SelectItem value="GBP">GBP – British Pound</SelectItem>
                        <SelectItem value="JPY">JPY – Japanese Yen</SelectItem>
                        <SelectItem value="AUD">
                            AUD – Australian Dollar
                        </SelectItem>
                    </SelectContent>
                </Select>
                <InputError className="mt-2" message={form.errors.currency} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="category_id">Category</Label>
                <Select
                    name="category_id"
                    value={(form.data.category_id as string) ?? undefined}
                    onValueChange={(value) =>
                        form.setData('category_id', Number(value))
                    }
                >
                    <SelectTrigger id="category_id" className="w-full">
                        <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <div className="px-2 py-1 text-xs font-medium text-zinc-400">
                            Expense categories
                        </div>
                        {expenseCategories.map((category) => (
                            <SelectItem
                                key={category.id}
                                value={String(category.id)}
                            >
                                {category.name}
                            </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs font-medium text-zinc-400">
                            Income categories
                        </div>
                        {incomeCategories.map((category) => (
                            <SelectItem
                                key={category.id}
                                value={String(category.id)}
                            >
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError
                    className="mt-2"
                    message={form.errors.category_id}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    type="date"
                    name="date"
                    value={form.data.date as string}
                    onChange={(e) => form.setData('date', e.target.value)}
                />
                <InputError className="mt-2" message={form.errors.date} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="note">Note</Label>
                <textarea
                    id="note"
                    name="note"
                    rows={3}
                    placeholder="Optional note…"
                    value={(form.data.note as string) ?? ''}
                    onChange={(e) => form.setData('note', e.target.value)}
                    className="border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
                />
                <InputError className="mt-2" message={form.errors.note} />
            </div>

            <div className="grid gap-2">
                <Label>Visibility</Label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => form.setData('visibility', 'private')}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-4 text-sm font-medium transition-colors ${
                            form.data.visibility === 'private'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'text-muted-foreground hover:bg-muted/50'
                        }`}
                    >
                        <Lock className="size-5" />
                        Private
                        <span className="text-xs font-normal">
                            Only you will see this
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => form.setData('visibility', 'shared')}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-4 text-sm font-medium transition-colors ${
                            form.data.visibility === 'shared'
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'text-muted-foreground hover:bg-muted/50'
                        }`}
                    >
                        <Share2 className="size-5" />
                        Shared
                        <span className="text-xs font-normal">
                            Visible in your household
                        </span>
                    </button>
                </div>
                <InputError className="mt-2" message={form.errors.visibility} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="receipt">Receipt photo</Label>
                <Input
                    id="receipt"
                    type="file"
                    name="receipt"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        form.transform((data) => ({
                            ...data,
                            receipt: file,
                        }));
                    }}
                />
                <InputError className="mt-2" message={form.errors.receipt} />
            </div>

            <div className="flex items-center gap-4">
                <Button type="submit" disabled={form.processing}>
                    Save transaction
                </Button>
                <Link
                    href={transactions.index()}
                    className="text-muted-foreground text-sm underline"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}

export type { FormConfig };
