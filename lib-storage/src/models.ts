export type Response = {
  data?: any;
  status: string | number;
  error?: Error;
};

export type DebugOptions = {
  debug: boolean;
  logger: (message: string) => void;
};
