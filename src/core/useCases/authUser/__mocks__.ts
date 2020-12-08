export function createUser() {
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
  }
}
