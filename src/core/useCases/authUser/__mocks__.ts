export function createUser(isFirstSignIn = false, isActiveUser = true) {
  return {
    id: 1,
    email: 'john@email.com',
    firstName: 'John',
    lastName: 'Doe',
    about: 'about',
    hasPassword: true,
    avatarUrl: 'http://url.com',
    address: {
      displayAddress: 'Paris',
    },
    partner: {
      name: 'Entourage',
    },
    token: 'token_abc',
    firstSignIn: isFirstSignIn,
    stats: {
      entourageCount: isActiveUser ? 3 : 0,
      actionsCount: isActiveUser ? 3 : 0,
      eventsCount: isActiveUser ? 3 : 0,
      encounterCount: isActiveUser ? 3 : 0,
      tourCount: isActiveUser ? 3 : 0,
      goodWavesParticipation: isActiveUser,
    },
  }
}
