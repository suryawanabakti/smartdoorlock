import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid min-h-dvh lg:grid-cols-2">
            <div className="relative hidden lg:col-span-1 lg:block">
                <img
                    src="/herologin.png"
                    alt="Smart Door Lock"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Optional overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Text overlay */}
                <div className="absolute right-0 bottom-12 left-0 z-10 text-center text-white">
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <p className="mt-2 text-sm">Fakultas Kedokteran</p>
                </div>
            </div>
            {/* Right Side - Login Form */}
            <div className="flex flex-col items-center justify-center bg-white px-6 py-12 sm:px-12 lg:px-16 dark:bg-zinc-950">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link
                        href={home()}
                        className="mb-8 flex items-center justify-center gap-3 lg:justify-start"
                    >
                        <div className="flex h-12 w-12 items-center justify-center">
                            <AppLogoIcon className="size-12 fill-current text-black dark:text-white" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xl leading-tight font-bold text-gray-900 dark:text-white">
                                {name}
                            </span>
                            <span className="block text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                Fakultas Kedokteran
                            </span>
                        </div>
                    </Link>

                    {/* Title Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    </div>

                    {/* Form Content */}
                    {children}
                </div>
            </div>

            {/* Mobile Hero - shown on small screens */}
            <div
                className="fixed inset-x-0 top-0 -z-10 h-48 lg:hidden"
                style={{
                    background:
                        'linear-gradient(135deg, #f0f2f5 0%, #e8edf2 100%)',
                }}
            />
        </div>
    );
}
