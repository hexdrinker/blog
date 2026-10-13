import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { redirect } from 'next/navigation'

export const { handlers, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // 블로그 주인 계정만 세션을 받는다
    signIn: ({ profile }) =>
      !!process.env.ADMIN_GITHUB_LOGIN &&
      profile?.login === process.env.ADMIN_GITHUB_LOGIN,
  },
})

// 어드민 페이지와 Server Action 모두 이걸 먼저 거친다
export async function requireAdmin() {
  const session = await auth()
  if (!session) redirect('/api/auth/signin?callbackUrl=/')
  return session
}
