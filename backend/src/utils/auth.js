const axios = require('axios');

const enforceAuthorization = (user, allowedPermissions, req, res, next, cb) => {
  if (!isAuthorized(user, allowedPermissions)) {
    const error = new Error(`User must have one of the permissions in [${allowedPermissions.map(perm => `'${perm}'`).join(', ')}]`);
    error.statusCode = 401;
    next(error);
  } else {
    cb(req, res, next);
  }
}

const isAuthorized = (user, allowedPermissions) => {
  return allowedPermissions.some(permission => user.permissions.indexOf(permission) !== -1);
}

const isAdmin = (user, done) => {
  getAccessToken()
    .then(accessToken =>
      axios({
        method: 'GET',
        url: `${process.env.AUTH0_MANAGEMENT_API_AUDIENCE}users/${user.sub}/roles`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }))
    .then(rolesResponse => done(null, rolesResponse.data.some(role => role.name === 'Admin')))
    .catch(err => {
      if (err?.response?.data) {
        return done(err.response.data);
      }
      return done(err);
    });
}

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

const getUserInfo = (accessToken, done) => {
  axios({
    method: 'GET',
    url: process.env.AUTH0_USERINFO_ENDPOINT,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => done(null, response.data))
    .catch(err => {
      if (err?.response?.data) {
        return done(err.response.data);
      }
      return done(err);
    });
}

exports.enforceAuthorization = enforceAuthorization;
exports.isAdmin = isAdmin;
exports.getAccessToken = getAccessToken;
exports.getUserInfo = getUserInfo;
