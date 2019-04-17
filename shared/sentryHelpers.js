const onProductionSite = (projectDomain, apiEnvironment) =>
  (projectDomain === 'community' || projectDomain === 'community-staging') && apiEnvironment === 'production';

const filterSecrets = function(jsonEvent) {
  const secrets = ['\\w+Token', 'email'];
  secrets.forEach((secret) => {
    const regexp = new RegExp(`"${secret}":\\s*"[^"]+"`, 'g');
    jsonEvent = jsonEvent.replace(regexp, `"${secret}":"****"`);
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
