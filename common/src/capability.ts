export interface AppInfo {
  name: string;
  description: string;
  url: string;
}

export type Capabilities = Capability[];

export interface Capability {
  with: Resource;
  can: string[];
}

export interface Resource {
  domain: string;
  pointers: string[];
}

export const WILD_CARD = '*';

// admin capabilities
export const ALL_CAPABILITY: Capability = {
  with: {
    domain: WILD_CARD,
    pointers: [WILD_CARD],
  },
  can: [WILD_CARD],
};
