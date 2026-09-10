import { Form, Head, usePage } from '@inertiajs/react';
import PrivacyController from '@/actions/App/Http/Controllers/Settings/PrivacyController';
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
import { Lock, Share2 } from 'lucide-react';
import { edit } from '@/routes/privacy';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function PrivacySettings() {
    const {
        auth: { user },
    } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Privacy settings" />

            <h1 className="sr-only">Privacy settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Privacy"
                    description="Choose how new entries are shared with your household by default"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Default visibility</CardTitle>
                        <CardDescription>
                            This preference is applied to new transactions and
                            recurring templates. You can still override it for
                            individual entries.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...PrivacyController.update.form()}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <label>
                                            <input
                                                type="radio"
                                                name="default_visibility"
                                                value="private"
                                                defaultChecked={
                                                    user.default_visibility ===
                                                    'private'
                                                }
                                                className="peer sr-only"
                                            />
                                            <div className="peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary flex flex-col items-start gap-2 rounded-lg border p-4 text-sm font-medium transition-colors">
                                                <Lock className="size-5" />
                                                Private
                                                <span className="text-xs font-normal text-zinc-500">
                                                    New entries are only visible
                                                    to you by default.
                                                </span>
                                            </div>
                                        </label>

                                        <label>
                                            <input
                                                type="radio"
                                                name="default_visibility"
                                                value="shared"
                                                defaultChecked={
                                                    user.default_visibility ===
                                                    'shared'
                                                }
                                                className="peer sr-only"
                                            />
                                            <div className="peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary flex flex-col items-start gap-2 rounded-lg border p-4 text-sm font-medium transition-colors">
                                                <Share2 className="size-5" />
                                                Shared
                                                <span className="text-xs font-normal text-zinc-500">
                                                    New entries roll up into
                                                    your household view by
                                                    default.
                                                </span>
                                            </div>
                                        </label>
                                    </div>

                                    <InputError
                                        message={errors.default_visibility}
                                    />

                                    <div className="flex items-center gap-4">
                                        <Button disabled={processing}>
                                            Save preference
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PrivacySettings.layout = {
    breadcrumbs: [
        {
            title: 'Privacy settings',
            href: edit(),
        },
    ],
};
