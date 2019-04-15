const onProductionSite = (projectDomain, apiEnvironment) =>
  (projectDomain === 'community' || projectDomain === 'community-staging') && apiEnvironment === 'production';

const filterSecrets = function(jsonEvent) {
  const tokens = ['facebookToken', 'gitAccessToken', 'githubToken', 'inviteToken', 'persistentToken'];
  tokens.forEach((token) => {
    const regexp = new RegExp(`"${token}":"[^"]+"`, 'g');
    jsonEvent = jsonEvent.replace(regexp, `"${token}":"****"`);
  });
  return jsonEvent;
};

const ignoreErrors = ['Network Error', 'timeout', 'status code 401'];

const beforeSend = function(projectDomain, apiEnv, event) {
  if (!onProductionSite(projectDomain, apiEnv)) {
    return null;
  }

  const json = filterSecrets(JSON.stringify(event));
  return JSON.parse(json);
};

const beforeBreadcrumb = function(breadcrumb) {
  if (breadcrumb.category === 'console' && breadcrumb.data) {
    const extras = JSON.stringify(breadcrumb.data.extra);
    const filteredExtras = filterSecrets(extras);
    breadcrumb.data.extra = filteredExtras; // eslint-disable-line no-param-reassign
  }
  if (typeof breadcrumb.message === 'string') {
    breadcrumb.message = filterSecrets(breadcrumb.message);
  }
  return breadcrumb;
};

module.exports = {
  ignoreErrors,
  beforeSend,
  beforeBreadcrumb,
};
