const axios = require('axios');
const pwdGenerator = require('generate-password');

const getAccessToken = () => {
  return axios({
    method: 'POST',
    url: process.env.AUTH0_TOKEN_ENDPOINT,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      client_id: process.env.API_AUTH0_CLIENT_ID,
      client_secret: process.env.API_AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_MANAGEMENT_API_AUDIENCE,
      grant_type: 'client_credentials'
    }
  })
    .then(tokenResponse => tokenResponse.data.access_token);
}

const getUser = (accessToken, userId) => {
  return axios({
    method: 'GET',
    url: `${process.env.AUTH0_MANAGEMENT_API_AUDIENCE}users/${userId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
  })
    .then(getUserResponse => getUserResponse.data);
}

const createUser = (accessToken, email, name, contactId) => {
  return axios({
    method: 'POST',
    url: `${process.env.AUTH0_MANAGEMENT_API_AUDIENCE}users`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    data: {
      email: email,
      password: pwdGenerator.generate({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
        strict: true
      }),
      name: name,
      connection: process.env.AUTH0_DB_CONNECTION_NAME,
      email_verified: false,
      verify_email: false,
      user_metadata: {
        contact_id: contactId
      }
    }
  });
}

const getParticipantRoleId = (accessToken) => {
  return axios({
    method: 'GET',
    url: `${process.env.AUTH0_MANAGEMENT_API_AUDIENCE}roles`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    params: {
      name_filter: 'participant'
    }
  })
    .then(rolesResponse => {
      if (rolesResponse?.data?.length === 1) {
        return rolesResponse.data[0].id;
      }
      throw new Error('Unexpected: No participant role found');
    });
}

const assignParticipantRoleToUser = (accessToken, userId, participantRoleId) => {
  return axios({
    method: 'POST',
    url: `${process.env.AUTH0_MANAGEMENT_API_AUDIENCE}users/${userId}/roles`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    data: {
      roles: [participantRoleId]
    }
  });
}

const triggerChangePassword = (email) => {
  return axios({
    method: 'POST',
    url: `${process.env.AUTH0_ISSUER}dbconnections/change_password`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
      email: email,
      connection: process.env.AUTH0_DB_CONNECTION_NAME
    }
  });
}

exports.getAccessToken = getAccessToken;
exports.getUser = getUser;
exports.createUser = createUser;
exports.getParticipantRoleId = getParticipantRoleId;
exports.assignParticipantRoleToUser = assignParticipantRoleToUser;
exports.triggerChangePassword = triggerChangePassword;
