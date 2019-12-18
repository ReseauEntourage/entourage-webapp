import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import SendIcon from '@material-ui/icons/Send'
// @ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom'
import React, { useCallback } from 'react'
import { Button, ButtonsList } from 'src/components/Button'
import { Message, PendingNotif } from 'src/components/Conversations'
import { TextField, useForm } from 'src/components/Form'
import { useDelayLoading } from 'src/hooks'
import {
  useQueryMe,
  useQueryEntourageChatMessages,
  useMutateCreateEntourageChatMessage,
  useQueryMembersPending,
  useQueryMeNonNullable,
  useQueryEntourageFromMyFeeds,
  useMutateAcceptEntourageUser,
  useMutateDeleteEntourageUser,
} from 'src/network/queries'
import { theme } from 'src/styles'
import {
  Container,
  MessagesContainer,
  BottomBar,
  TopBar,
  Pending,
  MemberPendingContainer,
} from './ConversationDetail.styles'

interface MembersPendingRequestProps {
  entourageId: number;
}

function MembersPendingRequest(props: MembersPendingRequestProps) {
  const { entourageId } = props

  const [deleting, setDeleting] = useDelayLoading()
  const [accepting, setAccepting] = useDelayLoading()
  const { membersPending } = useQueryMembersPending(entourageId)
  const me = useQueryMeNonNullable()
  const entourage = useQueryEntourageFromMyFeeds(entourageId)
  const iAmAuthor = me.id === entourage.author.id

  const [accepteEntourageUser] = useMutateAcceptEntourageUser()
  const [deleteEntourageUser] = useMutateDeleteEntourageUser()

  const currentMemberPending = membersPending[0]
  const nextMemberPending = membersPending[1]

  const onValidateRequest = useCallback(async () => {
    setAccepting(true)
    await accepteEntourageUser({ entourageId, userId: currentMemberPending.id }, { waitForRefetchQueries: true })
    setAccepting(false)
  }, [accepteEntourageUser, currentMemberPending, entourageId, setAccepting])

  const onRejectRequest = useCallback(async () => {
    setDeleting(true)
    await deleteEntourageUser({ entourageId, userId: currentMemberPending.id }, { waitForRefetchQueries: true })
    setDeleting(false)
  }, [deleteEntourageUser, currentMemberPending, entourageId, setDeleting])

  if (!iAmAuthor || !currentMemberPending) {
    return null
  }

  return (
    <MemberPendingContainer>
      <PendingNotif
        key={currentMemberPending.id}
        label={<div><b>{currentMemberPending.displayName} souhaite rejoindre votre action</b></div>}
        leftContent={(
          <ButtonsList>
            <Button
              loading={accepting}
              onClick={onValidateRequest}
              startIcon={<CheckIcon />}
            >
              Accepter
            </Button>
            <Button
              loading={deleting}
              onClick={onRejectRequest}
              startIcon={<CloseIcon />}
              style={{ backgroundColor: '#fff' }}
              variant="outlined"
            >
              Refuser
            </Button>
          </ButtonsList>
        )}
        pictureURL={currentMemberPending.avatarUrl}
      />
      {nextMemberPending && (
        <PendingNotif
          pictureURL={nextMemberPending.avatarUrl}
          style={{
            borderRadius: 0,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
          }}
        />
      )}
    </MemberPendingContainer>
  )
}

interface FormFields {
  content: string;
}

interface ConversationDetail {
  entourageId: number;
}

export function ConversationDetail(props: ConversationDetail) {
  const { entourageId } = props

  const { register, triggerValidation, getValues, setValue } = useForm<FormFields>()

  const entourage = useQueryEntourageFromMyFeeds(entourageId)

  const { joinStatus } = entourage
  const userIsAccepted = joinStatus === 'accepted'

  if (joinStatus !== 'accepted' && joinStatus !== 'pending') {
    throw new Error(`Entourage with joins status ${joinStatus} shouldn't be in /myfeeds`)
  }

  const { data: chatMessages } = useQueryEntourageChatMessages(userIsAccepted ? entourageId : null)
  const [createcChatMessage] = useMutateCreateEntourageChatMessage(entourageId)
  const { data: meData } = useQueryMe()

  const onClickSend = useCallback(async () => {
    if (!await triggerValidation()) {
      return
    }

    await createcChatMessage({ content: getValues().content }, { waitForRefetchQueries: true })

    setValue('content', '')
  }, [createcChatMessage, getValues, setValue, triggerValidation])

  const messages = chatMessages?.data.chatMessages || []
  // must make a shallow copy because reverse() will mutate
  // and chatMessages is cached
  const reversedMessages = [...messages].reverse()

  return (
    <Container>
      <TopBar>
        {entourage.title}
      </TopBar>
      <MembersPendingRequest entourageId={entourageId} />
      {!userIsAccepted ? (
        <Pending>
          Votre demande est en attente. Lorsque vous serez accepté.e,
          vous verrez ici la conversation des participants à cette action/cet évènement.
        </Pending>
      ) : (
        <>
          <MessagesContainer>
            <ScrollToBottom className="ScrollToBottom" followButtonClassName="ScrollToBottomButton">
              {reversedMessages.map((message) => {
                const isMe = message.user.id === meData?.data.user.id
                return (
                  <Message
                    key={message.id}
                    author={message.user.displayName || undefined}
                    content={message.content}
                    date={message.createdAt}
                    isMe={isMe}
                  />
                )
              })}
            </ScrollToBottom>
          </MessagesContainer>
          <BottomBar>
            <TextField
              inputRef={register({ required: true })}
              margin="none"
              multiline={true}
              name="content"
              style={{
                flex: 1,
              }}
            />
            <Button
              onClick={onClickSend}
              startIcon={<SendIcon />}
              style={{ marginLeft: theme.spacing(2) }}
            >
            Envoyer
            </Button>
          </BottomBar>
        </>
      )}
    </Container>
  )
}
