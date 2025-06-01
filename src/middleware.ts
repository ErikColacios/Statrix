// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req:NextRequest) {
//     const res = NextResponse.next()

//     const currentUser = req.cookies.get('currentUser')?.value
  
//     // Create a Supabase client configured to use cookies
//     const supabase = createMiddlewareClient({ req, res })

//     if (currentUser && !req.nextUrl.pathname.startsWith('/')) {
//       return Response.redirect(new URL('/', req.url))
//     }


//     // Refresh session if expired - required for Server Components
//     await supabase.auth.getSession()

//     res.headers.append('Access-Control-Allow-Credentials', "true")
//     res.headers.append('Access-Control-Allow-Origin', 'http://localhost:3000') // replace this your actual origin
//     res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
//     res.headers.append(
//         'Access-Control-Allow-Headers',
//         'X-CSRF-Token, X-Requested-With, Authorization, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//     )
  
//     return res
//   }
  
//   // Ensure the middleware is only called for relevant paths.
//   export const config = {
//     matcher: [
//       /*
//        * Match all request paths except for the ones starting with:
//        * - _next/static (static files)
//        * - _next/image (image optimization files)
//        * - favicon.ico (favicon file)
//        * Feel free to modify this pattern to include more paths.
//        */
//       '/((?!_next/static|_next/image|favicon.ico).*)',
//     ],
}