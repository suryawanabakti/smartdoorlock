import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLogoIcon({ className }: { className?: string }) {
    const { logo } = usePage<SharedData>().props;
    return (
        <img
            src={'/logo-megabuana.png'}
            className={`${className} object-contain`}
            alt="Logo"
        />
    );
}
