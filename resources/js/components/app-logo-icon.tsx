import { SVGAttributes } from 'react';

export default function AppLogoIcon({ className }: { className?: string }) {
    return <img src="/logo.png" className={`${className} object-contain`} alt="Logo" />;
}
