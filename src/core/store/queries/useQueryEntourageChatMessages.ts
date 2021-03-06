import uniqBy from 'lodash/uniqBy'
import { useCallback, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { api, schema } from 'src/core/api'
import { queryKeys } from 'src/core/store'
import { assertIsDefined } from 'src/utils/misc'
import { AnyCantFix } from 'src/utils/types'

type Messages = typeof schema['/entourages/:entourageId/chat_messages GET']['response']['chatMessages']

export function useQueryEntourageChatMessages(entourageUuid?: string | null) {
  const [messages, setMessages] = useState<Messages>([])
  const [isLoading, setIsLoading] = useState(true)

  const queryKey = !entourageUuid
    ? null
    : [
      queryKeys.chatMessage(entourageUuid),
      { entourageUuid, before: undefined },
    ] as [string, { before?: string; entourageUuid: string | null; }]

  const queryRes = useQuery(queryKey, (params) => {
    assertIsDefined(entourageUuid, 'useQueryEntourageChatMessages required entourageId')

    return api.request({
      name: '/entourages/:entourageId/chat_messages GET',
      pathParams: {
        entourageUuid,
      },
      params: {
        before: params.before,
      },
    })
  }, {
    paginated: true,
    getCanFetchMore: (lastPage: AnyCantFix) => {
      return lastPage.data.chatMessages.length === 25
    },
    staleTime: 0,
    refetchInterval: 60 * 1e3,
  })

  const { data: pages } = queryRes

  const fetchMore = useCallback(() => {
    const lastMessage = messages[messages.length - 1]

    queryRes.fetchMore({
      before: lastMessage.createdAt,
      entourageUuid: null,
    })
  }, [messages, queryRes])

  useEffect(() => {
    const data = !pages
      ? []
      : pages
        .map((res) => res.data.chatMessages)
        .reduce((pageA, pageB) => [...pageA, ...pageB], [])

    setMessages((prevMessages) => {
      const uniqMessages = uniqBy([...prevMessages, ...data], (message) => message.id)
      uniqMessages.sort((a, b) => b.id - a.id)
      return uniqMessages
    })

    setIsLoading(false)
  }, [pages])

  return {
    ...queryRes,
    isLoading,
    data: messages,
    fetchMore,
  }
}
