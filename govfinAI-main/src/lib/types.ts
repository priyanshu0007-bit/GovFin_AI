
export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  state: string;
  age: number;
  income: number;
  occupation: string;
  casteCategory: string;
  gender: string;
  familySize: number;
  disabilityStatus: boolean;
  language: string;
  createdAt: any;
};

export type Transaction = {
  id: string;
  uid: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  note: string;
  date: string;
  aiCategory?: string;
  createdAt: any;
};

export type Scheme = {
  id: string;
  name: string;
  ministry: string;
  category: string;
  state: string;
  description: string;
  eligibilityCriteria: {
    age?: string;
    income?: string;
    state?: string;
    gender?: string;
    casteCategory?: string;
    occupation?: string;
    familySize?: string;
    disabilityStatus?: string;
  };
  benefits: string[];
  documentsRequired: string[];
  howToApply: string[];
  deadline?: string;
  isNational: boolean;
};

export type SavedScheme = {
  schemeId: string;
  savedAt: any;
  notes?: string;
};

export type FinancialInsight = {
  id: string;
  type: string;
  content: string;
  generatedAt: any;
  dismissed: boolean;
};
