import { useRouter } from 'next/router'

export function useEntourageUuid(): string | undefined {
  const router = useRouter()

  return router.query.messageId as string | undefined
}
