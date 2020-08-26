const axios = require('axios');
const auth0 = require('./auth0');

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
  auth0.getAccessToken()
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

exports.enforceAuthorization = enforceAuthorization;
exports.isAdmin = isAdmin;
