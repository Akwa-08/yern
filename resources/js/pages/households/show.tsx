import { Head, Link, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Copy, Users } from 'lucide-react';
import { useClipboard } from '@/hooks/use-clipboard';
import householdRoutes from '@/routes/household';
import { formatMoney, monthNames } from '@/types';
import type { Household, Paginated, Transaction } from '@/types';

type Props = {
    household: Household;
    transactions: Paginated<Transaction>;
    period: { year: number; month: number };
    totals: { expenses: number; income: number; balance: number };
    byCategory: Array<{
        label: string;
        color: string | null;
        total: number;
        expense_total: number;
        income_total: number;
    }>;
    byPerson: Array<{
        label: string;
        expense_total: number;
        income_total: number;
    }>;
    isCurrentUserOwner: boolean;
};

export default function HouseholdShow({
    household,
    transactions,
    period,
    totals,
    byCategory,
    byPerson,
    isCurrentUserOwner,
}: Props) {
    const [, copy] = useClipboard();

    const navigateMonth = (delta: number) => {
        const date = new Date(period.year, period.month - 1 + delta, 1);
        router.get(
            householdRoutes.show(household),
            {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title={household.name} />

            <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <Heading
                        title={household.name}
                        description="Combined shared transactions across all members"
                    />
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copy(household.invite_code)}
                        >
                            <Copy />
                            {household.invite_code}
                        </Button>
                        <div className="flex items-center gap-1 rounded-md border p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateMonth(-1)}
                            >
                                <ChevronLeft />
                            </Button>
                            <span className="px-2 text-sm font-medium">
                                {monthNames[period.month - 1]} {period.year}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateMonth(1)}
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold text-red-600">
                                {formatMoney(totals.expenses)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold text-green-600">
                                {formatMoney(totals.income)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p
                                className={`text-2xl font-semibold ${
                                    totals.balance >= 0
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`}
                            >
                                {formatMoney(totals.balance)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>By category</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {byCategory.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    No shared transactions this month.
                                </p>
                            ) : (
                                byCategory.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between gap-3 text-sm"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="inline-block size-2.5 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        item.color ?? '#94A3B8',
                                                }}
                                            />
                                            {item.label}
                                        </span>
                                        <span className="font-medium">
                                            {formatMoney(item.expense_total)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>By person</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {byPerson.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    No members with shared activity this month.
                                </p>
                            ) : (
                                byPerson.map((person) => (
                                    <div key={person.label}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 font-medium">
                                                <Users className="size-4 text-zinc-400" />
                                                {person.label}
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                {formatMoney(
                                                    person.expense_total,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}

                            <div className="mt-4 border-t pt-4">
                                <p className="text-muted-foreground text-sm">
                                    Members
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {household.members?.map((member) => (
                                        <Badge
                                            key={member.id}
                                            variant="secondary"
                                        >
                                            {member.name}
                                        </Badge>
                                    ))}
                                    {isCurrentUserOwner && (
                                        <span className="text-muted-foreground text-xs">
                                            (You own this household)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Shared transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {transactions.data.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                No shared transactions for this month.
                            </p>
                        ) : (
                            <div className="divide-y rounded-lg border">
                                {transactions.data.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">
                                                {transaction.category?.name}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {transaction.user?.name} ·{' '}
                                                {transaction.date}
                                            </p>
                                        </div>
                                        <div
                                            className={
                                                transaction.type === 'expense'
                                                    ? 'font-medium text-red-600'
                                                    : 'font-medium text-green-600'
                                            }
                                        >
                                            {transaction.type === 'expense'
                                                ? '-'
                                                : '+'}
                                            {formatMoney(
                                                transaction.amount,
                                                transaction.currency,
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(transactions.prev_page_url ||
                            transactions.next_page_url) && (
                            <div className="mt-4 flex gap-2">
                                {transactions.prev_page_url && (
                                    <Link href={transactions.prev_page_url}>
                                        <Button variant="outline" size="sm">
                                            Previous
                                        </Button>
                                    </Link>
                                )}
                                {transactions.next_page_url && (
                                    <Link href={transactions.next_page_url}>
                                        <Button variant="outline" size="sm">
                                            Next
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

HouseholdShow.layout = {
    breadcrumbs: [
        {
            title: 'Household',
            href: householdRoutes.index(),
        },
    ],
};
