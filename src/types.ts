export interface ContentData {
  id?: string;
  key?: string;
  value: {
    [prop: string]: TermDescriptor
  },
  version?: {
    number: number
  }
}

export interface TermDescriptor {
  definition: string;
  synonyms?: string[];
  abbreviations: string[];
}

export interface Dictionary {
  [prop: string]: TermDescriptor
}
