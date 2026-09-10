import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Plus, TrendingUp, Users } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { dashboard } from '@/routes';
import householdRoutes from '@/routes/household';
import transactionsRoutes from '@/routes/transactions';
import { formatMoney, monthNames } from '@/types';
import type { Household, Transaction } from '@/types';

type Props = {
    period: { year: number; month: number };
    totals: { expenses: number; income: number; balance: number };
    byCategory: Array<{
        label: string;
        color: string | null;
        total: number;
        expense_total: number;
        income_total: number;
    }>;
    recent: Transaction[];
    household: Household | null;
    isCurrentMonth: boolean;
    trend: Array<{
        month: string;
        expenses: number;
        income: number;
    }>;
};

export default function Dashboard({
    period,
    totals,
    byCategory,
    recent,
    household,
    isCurrentMonth,
    trend,
}: Props) {
    const navigateMonth = (delta: number) => {
        const date = new Date(period.year, period.month - 1 + delta, 1);
        router.get(
            dashboard(),
            {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const expenseByCategory = byCategory.filter((c) => c.expense_total > 0);
    const maxCategory = Math.max(
        ...expenseByCategory.map((c) => c.expense_total),
        1,
    );

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">
                            {monthNames[period.month - 1]} {period.year}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Your personal spending overview
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-md border p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateMonth(-1)}
                            >
                                <ChevronLeft />
                            </Button>
                            <span className="px-2 text-sm font-medium">
                                {isCurrentMonth
                                    ? 'This month'
                                    : `${monthNames[period.month - 1]} ${period.year}`}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateMonth(1)}
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                        <Link href={transactionsRoutes.create()}>
                            <Button>
                                <Plus />
                                Add transaction
                            </Button>
                        </Link>
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

                {!household && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center gap-3 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
                            <div className="flex items-center gap-3">
                                <Users className="size-5 text-zinc-400" />
                                <div>
                                    <p className="text-sm font-medium">
                                        Track finances together
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Create or join a household to merge
                                        shared transactions with your partner.
                                    </p>
                                </div>
                            </div>
                            <Link href={householdRoutes.index()}>
                                <Button variant="outline">
                                    Set up household
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Monthly trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {trend.every(
                            (t) => t.expenses === 0 && t.income === 0,
                        ) ? (
                            <p className="text-muted-foreground py-8 text-center text-sm">
                                Add some transactions over the coming months to
                                see your trend here.
                            </p>
                        ) : (
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={trend}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) =>
                                                formatMoney(
                                                    value,
                                                    'PHP',
                                                ).replace(/\.00$/, '')
                                            }
                                        />
                                        <Tooltip
                                            formatter={(value) =>
                                                formatMoney(Number(value))
                                            }
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="expenses"
                                            name="Expenses"
                                            fill="#ef4444"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="income"
                                            name="Income"
                                            fill="#22c55e"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Spending by category</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {expenseByCategory.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    No expenses recorded for this month.
                                </p>
                            ) : (
                                expenseByCategory.map((item) => (
                                    <div key={item.label}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="inline-block size-2.5 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.color ??
                                                            '#94A3B8',
                                                    }}
                                                />
                                                {item.label}
                                            </span>
                                            <span className="font-medium">
                                                {formatMoney(
                                                    item.expense_total,
                                                )}
                                            </span>
                                        </div>
                                        <div className="bg-muted mt-1 h-2 overflow-hidden rounded-full">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${(item.expense_total / maxCategory) * 100}%`,
                                                    backgroundColor:
                                                        item.color ?? '#94A3B8',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent transactions</CardTitle>
                            <Link href={transactionsRoutes.index()}>
                                <Button variant="ghost" size="sm">
                                    View all
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recent.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-10 text-center">
                                    <TrendingUp className="size-6 text-zinc-400" />
                                    <p className="text-muted-foreground text-sm">
                                        No transactions yet.
                                    </p>
                                    <Link href={transactionsRoutes.create()}>
                                        <Button variant="outline" size="sm">
                                            Add your first
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {recent.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between py-2.5 text-sm"
                                        >
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span
                                                    className="inline-block size-2 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            transaction.category
                                                                ?.color ??
                                                            '#94A3B8',
                                                    }}
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate">
                                                        {
                                                            transaction.category
                                                                ?.name
                                                        }
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {transaction.date}
                                                    </p>
                                                </div>
                                                {transaction.visibility ===
                                                    'private' && (
                                                    <Lock className="size-3 shrink-0 text-zinc-400" />
                                                )}
                                            </div>
                                            <span
                                                className={
                                                    transaction.type ===
                                                    'expense'
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
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
