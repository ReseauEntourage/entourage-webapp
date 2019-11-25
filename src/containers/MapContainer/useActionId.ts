import { useRouter } from 'next/router'

export function useActionId(): string | undefined {
  const router = useRouter()

  return router.query.actionId as string
}
