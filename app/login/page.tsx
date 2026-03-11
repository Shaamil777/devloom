"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Github } from "lucide-react"

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    )
}

function LoginContent() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const error = searchParams.get("error")
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

    const handleSignIn = (provider: string) => {
        setLoadingProvider(provider)
        signIn(provider, { callbackUrl })
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 bg-background relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[40%] -left-[20%] w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-3xl" />
                <div className="absolute -bottom-[30%] -right-[15%] w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-[420px] relative z-10">

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
                        Welcome to <span className="text-primary">DevLoom</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Sign in to write, save, and engage with the community.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/20">

                    <h2 className="text-lg font-bold text-foreground text-center mb-2">
                        Sign in to your account
                    </h2>
                    <p className="text-sm text-muted-foreground text-center mb-8">
                        Choose your preferred sign-in method
                    </p>

                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                            <p className="text-sm text-red-400">
                                {error === "OAuthAccountNotLinked"
                                    ? "This email is already associated with another provider. Please sign in with the original provider."
                                    : "Something went wrong. Please try again."}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">

                        <button
                            onClick={() => handleSignIn("google")}
                            disabled={loadingProvider !== null}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-white/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none group border border-gray-200"
                        >
                            {loadingProvider === "google" ? (
                                <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <GoogleIcon className="h-5 w-5" />
                            )}
                            <span>Continue with Google</span>
                        </button>

                        <div className="flex items-center gap-3 py-1">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs text-muted-foreground/60 font-medium uppercase tracking-widest">or</span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <button
                            onClick={() => handleSignIn("github")}
                            disabled={loadingProvider !== null}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-[#24292F] hover:bg-[#2d3339] text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#24292F]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none group border border-[#3d444d]"
                        >
                            {loadingProvider === "github" ? (
                                <div className="h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Github className="h-5 w-5" />
                            )}
                            <span>Continue with GitHub</span>
                        </button>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground/50 text-center mt-6 leading-relaxed max-w-xs mx-auto">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </main>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </main>
        }>
            <LoginContent />
        </Suspense>
    )
}