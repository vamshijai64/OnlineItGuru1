import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side - Image */}
            <div className="hidden lg:block relative w-full h-full bg-slate-50">
                <Image
                    src="/images/login.png"
                    alt="Authentication illustration"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            {/* Right side - Form */}
            <div className="flex flex-col justify-center items-center bg-slate-50 px-6 py-12 relative">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-30" />
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
