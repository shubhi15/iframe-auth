require('babel-register')({
  presets: [ 'env' ]
})
import request from 'request-promise-native'

const rocketChatServer = 'https://app-demorocket3.wedeploy.io';
const rocketChatAdminUserId = 'Mq9qPHwPrvHrspmh6';
const rocketChatAdminAuthToken = 'AN1qeh7NRm3elv-8Aj67lAZjhO06pPn62N_CrEbwB3L';



export async function fetchUser (username) {
  const rocketChatUser = await request({
    url: `${rocketChatServer}/api/v1/users.info`,
    method: 'GET',
    qs: {
      username: username
    },
    headers: {
      'X-Auth-Token': rocketChatAdminAuthToken,
      'X-User-Id': rocketChatAdminUserId
    }
  });
  return rocketChatUser;
}

export async function loginUser (email, password) {
  const response = await request({
    url: `${rocketChatServer}/api/v1/login`,
    method: 'POST',
    json: {
      user: email,
      password: password
    }
  });
  return response;
}

export async function createUser(username, name, email, password) {
  const rocketChatUser = await request({
    url: `${rocketChatServer}/api/v1/users.create`,
    method: 'POST',
    json: {
      name,
      email,
      password,
      username,
      verified: true
    },
    headers: {
      'X-Auth-Token': rocketChatAdminAuthToken,
      'X-User-Id': rocketChatAdminUserId
    }
  });
  return rocketChatUser;
}

export async function createOrLoginUser (username, name, email, password,) {
  try {
    const user = await fetchUser(username);
    // Perfom login
    return await loginUser(email, password);
  } catch (ex) {
    if (ex.statusCode === 400) {
      // User does not exist, creating user
      const user = await createUser(username, name, email, password);
      // Perfom login
      return await loginUser(email, password);
    } else {
      throw ex;
    }
  }
}