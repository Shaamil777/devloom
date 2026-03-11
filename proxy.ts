import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    const token = request.cookies.get("next-auth.session-token")?.value || request.cookies.get("__Secure-next-auth.session-token")?.value

    const isLoggedIn = !!token

    const protectedPaths = ["/dashboard", "/saved"]
    const isProtectedroutes = protectedPaths.some(path => pathname.startsWith(path))

    if (isProtectedroutes && !isLoggedIn) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
    }

    const guestOnlyPaths = ["/login"]
    const isGuestOnlyRoutes = guestOnlyPaths.some(path => pathname.startsWith(path))

    if (isGuestOnlyRoutes && isLoggedIn) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/saved/:path*",
        "/login"
    ]
}