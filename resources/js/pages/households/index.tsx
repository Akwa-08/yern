import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, UserPlus } from 'lucide-react';
import householdRoutes from '@/routes/household';
import type { Household } from '@/types';

type Props = {
    household:
        | (Household & { members?: Array<{ id: number; name: string }> })
        | null;
};

export default function HouseholdIndex({ household }: Props) {
    const createForm = useForm({ name: '' });
    const joinForm = useForm({ invite_code: '' });

    const create = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(householdRoutes.store().url);
    };

    const join = (e: React.FormEvent) => {
        e.preventDefault();
        joinForm.post(householdRoutes.join().url);
    };

    return (
        <>
            <Head title="Household" />

            <div className="flex flex-1 flex-col gap-6">
                <Heading
                    title="Household"
                    description="Share transactions and track finances together"
                />

                {household ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{household.name}</CardTitle>
                            <CardDescription>
                                You're part of a household with{' '}
                                {household.members?.length ?? 0} member(s).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">
                                Invite code:{' '}
                                <span className="text-foreground font-mono font-semibold tracking-widest">
                                    {household.invite_code}
                                </span>
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                Share this code so someone can join your
                                household.
                            </p>
                            <div className="mt-4">
                                <Link href={householdRoutes.show(household)}>
                                    <Button>
                                        <Users />
                                        View household dashboard
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create a household</CardTitle>
                                <CardDescription>
                                    Start your own shared household. Your
                                    partner can join with an invite code.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={create}>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Household name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="e.g. Our Home"
                                            value={createForm.data.name}
                                            onChange={(e) =>
                                                createForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={createForm.errors.name}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="mt-4"
                                        disabled={createForm.processing}
                                    >
                                        <UserPlus />
                                        Create household
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Join a household</CardTitle>
                                <CardDescription>
                                    Have an invite code? Enter it to join your
                                    partner's household.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={join}>
                                    <div className="grid gap-2">
                                        <Label htmlFor="invite_code">
                                            Invite code
                                        </Label>
                                        <Input
                                            id="invite_code"
                                            name="invite_code"
                                            placeholder="ABCD1234"
                                            className="font-mono tracking-widest"
                                            value={joinForm.data.invite_code}
                                            onChange={(e) =>
                                                joinForm.setData(
                                                    'invite_code',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                joinForm.errors.invite_code
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="mt-4"
                                        disabled={joinForm.processing}
                                    >
                                        Join household
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}

HouseholdIndex.layout = {
    breadcrumbs: [
        {
            title: 'Household',
            href: householdRoutes.index(),
        },
    ],
};
