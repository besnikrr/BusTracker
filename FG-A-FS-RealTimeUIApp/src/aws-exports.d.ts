interface AwsConfig {
  oauth: {
    redirectSignIn: string;
    redirectSignOut: string;
  };
}

declare const awsmobile: AwsConfig | Record<string, any>;
export default awsmobile;
