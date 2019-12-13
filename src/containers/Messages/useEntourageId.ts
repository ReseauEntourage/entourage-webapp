import { useRouter } from 'next/router'

export function useEntourageId(): number | undefined {
  const router = useRouter()

  return Number(router.query.messageId)
}
