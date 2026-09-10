import { Head, Link, router, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
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
import { Download, Lock, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import transactionsRoutes from '@/routes/transactions';
import { formatMoney } from '@/types';
import type { Category, Paginated, Transaction } from '@/types';

type PageProps = {
    transactions: Paginated<Transaction>;
    categories: Category[];
    household: { id: number; name: string } | null;
    filters: Record<string, string>;
};

export default function TransactionIndex() {
    const {
        transactions: data,
        categories,
        filters,
        household,
    } = usePage<PageProps>().props;

    const [query, setQuery] = useState(filters.query ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [categoryId, setCategoryId] = useState(filters.category_id ?? '');
    const [visibility, setVisibility] = useState(filters.visibility ?? 'all');
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');
    const [minAmount, setMinAmount] = useState(filters.min_amount ?? '');
    const [maxAmount, setMaxAmount] = useState(filters.max_amount ?? '');
    const [sort, setSort] = useState(filters.sort ?? 'date');

    const applyFilters = (params: Record<string, string>) => {
        const clean: Record<string, string> = {};
        for (const [key, value] of Object.entries(params)) {
            if (value && value !== 'all' && value !== 'date') {
                clean[key] = value;
            }
        }
        router.get(transactionsRoutes.index(), clean, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        const timer = setTimeout(
            () =>
                applyFilters({
                    query,
                    type,
                    category_id: categoryId,
                    visibility,
                    from,
                    to,
                    min_amount: minAmount,
                    max_amount: maxAmount,
                    sort,
                }),
            400,
        );
        return () => clearTimeout(timer);
    }, [
        query,
        type,
        categoryId,
        visibility,
        from,
        to,
        minAmount,
        maxAmount,
        sort,
    ]);

    const deleteTransaction = (transaction: Transaction) => {
        if (window.confirm('Delete this transaction?')) {
            router.delete(transactionsRoutes.destroy(transaction), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Transactions" />

            <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <Heading
                        title="Transactions"
                        description="Search, filter, and manage your expenses and income"
                    />
                    <Link href={transactionsRoutes.create()}>
                        <Button>
                            <Plus />
                            Add transaction
                        </Button>
                    </Link>
                    <a
                        href={
                            transactionsRoutes.export({
                                query: {
                                    query,
                                    type,
                                    category_id: categoryId,
                                    visibility,
                                    from,
                                    to,
                                    min_amount: minAmount,
                                    max_amount: maxAmount,
                                },
                            }).url
                        }
                    >
                        <Button variant="outline">
                            <Download />
                            Export CSV
                        </Button>
                    </a>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="grid gap-2">
                                <Label htmlFor="query">Search</Label>
                                <Input
                                    id="query"
                                    type="search"
                                    placeholder="Search notes or categories…"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type-filter">Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger
                                        id="type-filter"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Any" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Any</SelectItem>
                                        <SelectItem value="expense">
                                            Expense
                                        </SelectItem>
                                        <SelectItem value="income">
                                            Income
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category-filter">
                                    Category
                                </Label>
                                <Select
                                    value={categoryId}
                                    onValueChange={setCategoryId}
                                >
                                    <SelectTrigger
                                        id="category-filter"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Any" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Any</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={String(category.id)}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="visibility-filter">
                                    Visibility
                                </Label>
                                <Select
                                    value={visibility}
                                    onValueChange={setVisibility}
                                >
                                    <SelectTrigger
                                        id="visibility-filter"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="shared">
                                            Shared
                                        </SelectItem>
                                        <SelectItem value="private">
                                            Private
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="from">From</Label>
                                <Input
                                    id="from"
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="to">To</Label>
                                <Input
                                    id="to"
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="min-amount">Min amount</Label>
                                <Input
                                    id="min-amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={minAmount}
                                    onChange={(e) =>
                                        setMinAmount(e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="max-amount">Max amount</Label>
                                <Input
                                    id="max-amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={maxAmount}
                                    onChange={(e) =>
                                        setMaxAmount(e.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sort">Sort by</Label>
                                <Select value={sort} onValueChange={setSort}>
                                    <SelectTrigger id="sort" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">
                                            Newest first
                                        </SelectItem>
                                        <SelectItem value="amount">
                                            Highest amount
                                        </SelectItem>
                                        <SelectItem value="amount_asc">
                                            Lowest amount
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        {data.data.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-16 text-center">
                                <p className="text-muted-foreground text-sm">
                                    No transactions match your filters.
                                </p>
                                {household ? null : (
                                    <p className="text-muted-foreground text-xs">
                                        Tip: create or join a household to share
                                        transactionsRoutes.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-lg border">
                                <div className="hidden grid-cols-12 gap-4 border-b px-4 py-3 text-xs font-medium text-zinc-500 md:grid">
                                    <div className="col-span-2">Date</div>
                                    <div className="col-span-3">Category</div>
                                    <div className="col-span-2">Type</div>
                                    <div className="col-span-3">Amount</div>
                                    <div className="col-span-2">Actions</div>
                                </div>
                                <div className="divide-y">
                                    {data.data.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="grid grid-cols-2 items-center gap-2 px-4 py-3 md:grid-cols-12 md:gap-4"
                                        >
                                            <div className="text-sm md:col-span-2">
                                                {transaction.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm md:col-span-3">
                                                <span
                                                    className="inline-block size-2 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            transaction.category
                                                                ?.color ??
                                                            '#94A3B8',
                                                    }}
                                                />
                                                {transaction.category?.name}
                                                {transaction.visibility ===
                                                    'private' && (
                                                    <Lock className="size-3.5 text-zinc-400" />
                                                )}
                                            </div>
                                            <div className="md:col-span-2">
                                                <Badge
                                                    variant={
                                                        transaction.type ===
                                                        'expense'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {transaction.type}
                                                </Badge>
                                            </div>
                                            <div
                                                className={`text-sm font-medium md:col-span-3 ${
                                                    transaction.type ===
                                                    'expense'
                                                        ? 'text-red-600'
                                                        : 'text-green-600'
                                                }`}
                                            >
                                                {transaction.type === 'expense'
                                                    ? '-'
                                                    : '+'}
                                                {formatMoney(
                                                    transaction.amount,
                                                    transaction.currency,
                                                )}
                                            </div>
                                            <div className="flex gap-1 md:col-span-2">
                                                <Link
                                                    href={transactionsRoutes.edit(
                                                        transaction,
                                                    )}
                                                >
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
                                                    onClick={() =>
                                                        deleteTransaction(
                                                            transaction,
                                                        )
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data.data.length > 0 && (
                            <div className="mt-4 flex items-center justify-between text-sm">
                                <p className="text-muted-foreground">
                                    Showing {data.from}–{data.to} of{' '}
                                    {data.total}
                                </p>
                                <div className="flex gap-2">
                                    {data.prev_page_url && (
                                        <Link href={data.prev_page_url}>
                                            <Button variant="outline" size="sm">
                                                Previous
                                            </Button>
                                        </Link>
                                    )}
                                    {data.next_page_url && (
                                        <Link href={data.next_page_url}>
                                            <Button variant="outline" size="sm">
                                                Next
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TransactionIndex.layout = {
    breadcrumbs: [
        {
            title: 'Transactions',
            href: transactionsRoutes.index(),
        },
    ],
};
