declare module "*.json" {
  interface LottieJsonType {
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    nm: string;
    ddd: number;
    assets: unknown[];
    layers: unknown[];
    markers?: unknown[];
    [key: string]: unknown;
  }

  const value: LottieJsonType;
  export default value;
}
