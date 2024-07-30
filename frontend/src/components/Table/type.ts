type Custom = {
  value?: string;
  render?: (value: string, item: any) => JSX.Element;
  avoid?: boolean;
};

export type { Custom };
