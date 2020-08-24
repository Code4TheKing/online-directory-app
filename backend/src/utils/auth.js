const axios = require('axios');

const enforceAuthorization = (user, allowedPermissions, req, res, next, cb) => {
  if (!isAuthorized(user, allowedPermissions)) {
    const error = new Error(`User must have one of the permissions in [${allowedPermissions.map(perm => `'${perm}'`).join(', ')}]`);
    error.status = 401;
    next(error);
  } else {
    cb(req, res, next);
  }
}

const isAuthorized = (user, allowedPermissions) => {
  return allowedPermissions.some(permission => user.permissions.indexOf(permission) !== -1);
}

const isAdmin = (user, done) => {
  axios({
    method: 'POST',
    url: `${process.env.AUTH0_TOKEN_ENDPOINT}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      client_id: process.env.API_AUTH0_CLIENT_ID,
      client_secret: process.env.API_AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_MANAGE_API_AUDIENCE,
      grant_type: 'client_credentials'
    }
  })
    .then(tokenResponse => tokenResponse.data.access_token)
    .then(accessToken => {
      axios({
        method: 'GET',
        url: `${process.env.AUTH0_MANAGE_API_AUDIENCE}users/${user.sub}/roles`,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(rolesResponse => done(null, rolesResponse.data.some(role => role.name === 'Admin')))
        .catch(err => done(err.response.data));
    })
    .catch(err => done(err.response.data))
    .catch(err => done(err));
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
    .catch(err => done(err.response.data))
    .catch(err => done(err));
}

exports.enforceAuthorization = enforceAuthorization;
exports.isAdmin = isAdmin;
exports.getUserInfo = getUserInfo;
