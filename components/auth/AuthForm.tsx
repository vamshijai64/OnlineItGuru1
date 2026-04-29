"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

interface AuthFormProps {
    type: "login" | "signup" | "admin";
}

function AuthFormInner({ type }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [localError, setLocalError] = useState(""); // Changed error to localError to avoid conflict with storeError
    const router = useRouter();
    const searchParams = useSearchParams();
    const nextPath = searchParams.get("next");
    const { register, login, loginAdmin, isLoading, error: storeError } = useAuthStore();

    // Combined error for display
    const errorMsg = storeError || localError;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError("");

        if (type === "admin") {
            if (!email || !password) {
                setLocalError("Please fill in all fields.");
                return;
            }
            const res = await loginAdmin({ email, password });
            if (res.success) {
                router.push(nextPath || "/admin");
            } else {
                setLocalError(res.message || "Admin login failed");
            }
        } else if (type === "signup") {
            if (!email || !password || !name) {
                setLocalError("Please fill in all fields.");
                return;
            }
            const res = await register({ email, password, name, loginType: "Local" });
            if (res.success) {
                router.push(nextPath || "/");
            } else {
                setLocalError(res.message || "Registration failed");
            }
        } else {
            // Login functionality
            if (!email || !password) {
                setLocalError("Please fill in all fields.");
                return;
            }
            const res = await login({ email, password });
            if (res.success) {
                router.push(nextPath || "/dashboard");
            } else {
                setLocalError(res.message || "Login failed");
            }
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
            <div className="text-center">
                <Link href="/" className="inline-flex items-center gap-2 mb-6">
                    <GraduationCap className="h-10 w-10 text-indigo-600" />
                    <span className="text-2xl font-bold font-outfit uppercase tracking-tighter">onlineitguru</span>
                </Link>
                <h2 className="text-2xl font-bold font-outfit text-slate-900">
                    {type === "login" && "Welcome Back"}
                    {type === "signup" && "Create Your Account"}
                    {type === "admin" && "Admin Access"}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    {type === "login" && "Enter your credentials to access your dashboard"}
                    {type === "signup" && "Join thousands of learners today"}
                    {type === "admin" && "Authorized personnel only"}
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {type === "signup" && (
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className="h-11"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="h-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        {type === "login" && (
                            <Link href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="h-11"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMsg && <p className="text-xs font-semibold text-red-500 text-center">{errorMsg}</p>}

                <Button disabled={isLoading} type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 font-bold text-white shadow-lg shadow-indigo-200">
                    {isLoading ? "Processing..." : (type === "login" ? "Login to Dashboard" : (type === "signup" ? "Create Account" : "Enter Admin Panel"))}
                </Button>
            </form>

            <div className="text-center text-sm">
                {type === "login" ? (
                    <div className="text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </Link>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <Link href="/admin-login" className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors">
                                Admin Access
                            </Link>
                        </div>
                    </div>
                ) : type === "signup" ? (
                    <p className="text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                            Log in
                        </Link>
                    </p>
                ) : (
                    <Link href="/login" className="font-bold text-slate-500 hover:text-indigo-600">
                        Go back to user login
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function AuthForm({ type }: AuthFormProps) {
    return (
        <Suspense fallback={
            <div className="w-full max-w-md flex justify-center p-10">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <AuthFormInner type={type} />
        </Suspense>
    );
}
