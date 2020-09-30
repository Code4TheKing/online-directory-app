/** @format */

const axios = require('axios');
const errors = require('../utils/errors');

const enforceAuthorization = (user, allowedPermissions, req, res, next, cb) => {
  if (!isAuthorized(user, allowedPermissions)) {
    next(
      errors.generateError(
        `User must have all of the permissions in [${allowedPermissions.map((perm) => `'${perm}'`).join(', ')}]`,
        401
      )
    );
  } else {
    cb(req, res, next);
  }
};

const isAuthorized = (user, allowedPermissions) => {
  return allowedPermissions.every((permission) => user.permissions.indexOf(permission) !== -1);
};

const isAdmin = (accessToken, user) => {
  return axios({
    method: 'GET',
    url: `${process.env.API_AUTH0_MANAGEMENT_API_AUDIENCE}users/${user.sub}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then((rolesResponse) => rolesResponse.data.some((role) => role.name === 'Admin'));
};

exports.enforceAuthorization = enforceAuthorization;
exports.isAdmin = isAdmin;
