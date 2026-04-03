import { auth } from "@/auth"

export default auth((req) => {
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  if (isDashboard && !req.auth) {
    const loginUrl = new URL('/auth/login', req.nextUrl.origin)
    return Response.redirect(loginUrl)
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
