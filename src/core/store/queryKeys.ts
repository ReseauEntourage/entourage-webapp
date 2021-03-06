export const queryKeys = {
  me: 'me',
  feeds: 'feeds',
  entourageUsers: 'entourageUsers',
  myFeeds: 'myFeeds',
  entourage: 'entourage',
  chatMessage: (entourageId: string | number) => `chatmessage_${entourageId}`,
  user: (userId: number) => `user_${userId}`,
}

export const queriesDependancies = {
  authenticatedQueries: [
    queryKeys.me,
  ],
}
