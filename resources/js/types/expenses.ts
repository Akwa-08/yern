export type Category = {
    id: number;
    user_id: number | null;
    name: string;
    type: 'expense' | 'income';
    icon?: string | null;
    color?: string | null;
};

export type Transaction = {
    id: number;
    user_id: number;
    category_id: number;
    type: 'expense' | 'income';
    amount: string;
    currency: string;
    date: string;
    note?: string | null;
    visibility: 'private' | 'shared';
    receipt_path?: string | null;
    recurring_transaction_id?: number | null;
    created_at?: string;
    updated_at?: string;
    category?: Category;
    user?: { id: number; name: string };
};

export type Household = {
    id: number;
    name: string;
    invite_code: string;
    owner_user_id: number;
    members?: Array<{ id: number; name: string; email: string }>;
    owner?: { id: number; name: string };
};

export type Budget = {
    id: number;
    owner_type: 'user' | 'household';
    owner_id: number;
    category_id: number | null;
    amount: string;
    period: 'weekly' | 'monthly';
    start_date?: string | null;
    category?: Category | null;
    spent?: number;
    percent?: number;
};

export type RecurringTransaction = {
    id: number;
    user_id: number;
    category_id: number;
    type: 'expense' | 'income';
    amount: string;
    currency: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    visibility: 'private' | 'shared';
    note?: string | null;
    next_run_date: string;
    is_active: boolean;
    category?: Category;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

export function formatMoney(amount: string | number, currency = 'PHP'): string {
    const value =
        typeof amount === 'string' ? Number.parseFloat(amount) : amount;

    try {
        return value.toLocaleString('en-PH', {
            style: 'currency',
            currency,
        });
    } catch {
        return `${currency} ${value.toFixed(2)}`;
    }
}

export const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
