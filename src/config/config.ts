export class MissingConfigValueException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, MissingConfigValueException.prototype);
  }
}

type Config = {
  port: number;
  dbUrl: string;
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  coindeskUrl: string;
};

function getConfigValue(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new MissingConfigValueException(
      `Missing config value for attribute ${key}`,
    );
  }
  return value;
}

export const config: Config = {
  port: Number(process.env.PORT) || 8080,
  dbUrl: getConfigValue('DB_URL'),
  dbHost: getConfigValue('DB_HOST'),
  dbUser: getConfigValue('DB_USER'),
  dbPassword: getConfigValue('DB_PASSWORD'),
  dbName: getConfigValue('DB_NAME'),
  coindeskUrl: getConfigValue('COINDESK_URL'),
};
