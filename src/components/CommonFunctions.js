export const getUsernameFromEmail = email => {
  let username = email
    .replaceAll('-', '---')
    .replaceAll('.', '-')
    .replaceAll('@', '--');
  return username;
};
