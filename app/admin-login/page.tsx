import AuthForm from "@/components/auth/AuthForm";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <AuthForm type="admin" />
        </div>
    );
}
