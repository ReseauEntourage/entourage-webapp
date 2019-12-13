export const queryKeys = {
  me: 'me',
  feeds: 'feeds',
  POIs: 'POIs',
  entourageUsers: 'entourageUsers',
  myFeeds: 'myFeeds',
  chatMessage: (entourageId: string | number) => `chatmessage_${entourageId}`,
}

export const queriesDependancies = {
  authenticatedQueries: [
    queryKeys.me,
  ],
}
