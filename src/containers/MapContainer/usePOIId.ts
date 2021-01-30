import { useRouter } from 'next/router'

export function usePOIId(): string | undefined {
  const router = useRouter()

  return router.query.poiId as string
}
