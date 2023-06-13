export type Response = {
  data?: any;
  status: string | number;
  error?: Error;
};

export type DebugOptions = {
  debug: boolean;
  logger: (message: string) => void;
};

export type AuthenticationConfigurationOptions = {
  passwordless: boolean;
  accountName: string;
  accountKey: string;
  connectionString: string;
  sasTokenUrl: string;
};
