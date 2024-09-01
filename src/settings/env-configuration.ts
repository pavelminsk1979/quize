enum Environments {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
  TEST = 'TEST',
}

export type EnvironmentVariableType = { [key: string]: string | undefined };

export type ConfigurationType = ReturnType<typeof getConfig>;

const getConfig = (environmentVariables: EnvironmentVariableType) => {
  return {
    apiSettings: {
      PORT: Number.parseInt(environmentVariables.PORT || '3000'),
    },
    authSettings: {
      ACCESSTOKEN_SECRET:
        environmentVariables.ACCESSTOKEN_SECRET || 'AccessConfig',
      RefreshTOKEN_SECRET:
        environmentVariables.environmentVariables || 'RefreshConfig',
    },

    databaseSettings: {
      MONGO_CONNECTION_URI: environmentVariables.MONGO_URL || ' ',
      MONGO_CONNECTION_URI_FOR_TESTS:
        environmentVariables.MONGO_CONNECTION_URI_FOR_TESTS || ' ',
    },

    environmentSettings: {
      isDevelopment: environmentVariables.ENV === Environments.DEVELOPMENT,
      isTesting: environmentVariables.ENV === Environments.TEST,
      isProduction: environmentVariables.ENV === Environments.PRODUCTION,
      isStaging: environmentVariables.ENV === Environments.STAGING,
    },
  };
};

export default () => {
  const environmentVariables = process.env;

  return getConfig(environmentVariables);
};
