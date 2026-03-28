
export type SchemeData = {
  id: string;
  name: string;
  ministry: string;
  category: string;
  description: string;
  fullPolicy: string;
  benefits: string[];
  documents: string[];
  howToApply: string[];
  isNational: boolean;
  type: string;
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
};

export const realSchemes: SchemeData[] = [
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    description: "Direct financial assistance of ₹6,000 per year provided in three equal installments to all landholding farmer families.",
    fullPolicy: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a central sector scheme that provides income support to all landholding farmers' families in the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities. Under the scheme, the entire financial liability for transfer of benefit to appropriate beneficiaries is borne by Government of India.",
    benefits: ["₹6,000 annually in 3 installments", "Direct Benefit Transfer (DBT)", "Universal coverage for landholders"],
    documents: ["Aadhaar Card", "Land holding papers", "Bank Account Details"],
    howToApply: ["Register on PM-Kisan Portal", "Contact local Patwari/Nodal Officer", "Submit Aadhaar verified documents"],
    isNational: true,
    type: "Central Sector",
    eligibilityCriteria: { occupation: "Farmer", income: "Small/Marginal farmers" }
  },
  {
    id: "pmjay",
    name: "Ayushman Bharat (PM-JAY)",
    ministry: "Ministry of Health & Family Welfare",
    category: "Health",
    description: "Health coverage of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
    fullPolicy: "Ayushman Bharat PM-JAY is the largest health assurance scheme in the world which aims at providing a health cover of Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization to over 12 crores poor and vulnerable families.",
    benefits: ["₹5 Lakh health cover", "Cashless treatment", "Pre-existing diseases covered from Day 1"],
    documents: ["Aadhaar Card", "Ration Card", "PM Letter (if available)"],
    howToApply: ["Check eligibility on portal", "Visit nearest Ayushman Mitra at hospital", "E-card generation"],
    isNational: true,
    type: "Health Insurance",
    eligibilityCriteria: { income: "Low income families" }
  },
  {
    id: "pmay",
    name: "Pradhan Mantri Awas Yojana",
    ministry: "Ministry of Housing & Urban Affairs",
    category: "Housing",
    description: "Financial assistance to construct houses for eligible families in urban and rural areas.",
    fullPolicy: "PMAY aims to provide 'Housing for All'. The Mission provides central assistance to implementing agencies through States/Union Territories for providing houses to all eligible families.",
    benefits: ["Subsidy on home loan interest", "Direct financial support for construction", "Provision for basic civic infrastructure"],
    documents: ["Aadhaar Card", "Income Certificate", "Affidavit of not owning a house"],
    howToApply: ["Apply online through PMAY portal", "Visit Common Service Center (CSC)", "Submit details to Urban Local Body"],
    isNational: true,
    type: "Housing Support",
    eligibilityCriteria: { income: "EWS/LIG categories" }
  },
  {
    id: "ssy",
    name: "Sukanya Samriddhi Yojana",
    ministry: "Ministry of Finance",
    category: "Women & Child",
    description: "A high-interest savings scheme for the girl child offering tax benefits.",
    fullPolicy: "Sukanya Samriddhi Account is a Government of India backed saving scheme targeted at the parents of girl children. The scheme encourages parents to build a fund for the future education and marriage expenses of their female child.",
    benefits: ["High interest rate (compounded annually)", "Tax benefits under Section 80C", "Transferable anywhere in India"],
    documents: ["Birth Certificate of girl child", "Aadhaar Card of Parent/Guardian", "Address Proof"],
    howToApply: ["Visit nearest Post Office", "Apply at any authorized commercial bank", "Submit SSY Account opening form"],
    isNational: true,
    type: "Savings Scheme",
    eligibilityCriteria: { gender: "Female (child)" }
  },
  {
    id: "mgnrega",
    name: "MGNREGA",
    ministry: "Ministry of Rural Development",
    category: "Employment",
    description: "Guarantees 100 days of wage employment in a financial year to rural households.",
    fullPolicy: "The Mahatma Gandhi National Rural Employment Guarantee Act aims to enhance livelihood security in rural areas by providing at least 100 days of guaranteed wage employment in a financial year to every household whose adult members volunteer to do unskilled manual work.",
    benefits: ["Guaranteed 100 days of work", "Unemployment allowance if work not provided", "Timely wage payment through bank/post office"],
    documents: ["Job Card", "Aadhaar Card", "Bank Account Details"],
    howToApply: ["Apply for Job Card at Gram Panchayat", "Submit application for work (oral or written)", "Register with local Panchayat Secretary"],
    isNational: true,
    type: "Employment Guarantee",
    eligibilityCriteria: { occupation: "Unskilled Rural Labor", income: "Rural households" }
  },
  {
    id: "pm-vishwakarma",
    name: "PM Vishwakarma",
    ministry: "Ministry of MSME",
    category: "Business",
    description: "Support for artisans and craftspeople through credit support, skill upgrading, and toolkit incentives.",
    fullPolicy: "PM Vishwakarma scheme provides end-to-end support to artisans and craftspeople who work with their hands and tools. It includes collateral-free credit, skill training, and marketing support.",
    benefits: ["Collateral-free credit support", "Stipend during skill training", "Incentive for digital transactions"],
    documents: ["Aadhaar Card", "Voter ID", "Bank Account", "Artisan Certificate (if any)"],
    howToApply: ["Register on PM Vishwakarma Portal", "Verification by Gram Panchayat/ULB", "District Implementation Committee approval"],
    isNational: true,
    type: "Skill & Credit Support",
    eligibilityCriteria: { occupation: "Artisan/Craftsperson" }
  },
  {
    id: "pm-gkay",
    name: "PM Garib Kalyan Anna Yojana",
    ministry: "Ministry of Consumer Affairs, Food & Public Distribution",
    category: "Food",
    description: "Providing 5kg of free food grains monthly to eligible households under NFSA.",
    fullPolicy: "PMGKAY is a food security welfare scheme announced by the Government of India during the COVID-19 pandemic to provide free food grains to the poorest citizens of the country.",
    benefits: ["5kg free food grains (Rice/Wheat)", "Available at Fair Price Shops", "Direct support to BPL families"],
    documents: ["Ration Card", "Aadhaar Card"],
    howToApply: ["No separate application needed for NFSA card holders", "Visit nearest Fair Price Shop", "Biometric authentication"],
    isNational: true,
    type: "Food Security",
    eligibilityCriteria: { income: "Below Poverty Line (BPL)" }
  },
  {
    id: "stand-up-india",
    name: "Stand-Up India",
    ministry: "Ministry of Finance",
    category: "Business",
    description: "Facilitating bank loans between ₹10 lakh and ₹1 crore to SC/ST and Women entrepreneurs.",
    fullPolicy: "Stand-Up India Scheme facilitates bank loans between Rs 10 lakh and Rs 1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
    benefits: ["Large loan amount for greenfield projects", "Credit guarantee scheme support", "Mentorship and training"],
    documents: ["Detailed Project Report", "Caste Certificate (if SC/ST)", "Identity & Address Proof"],
    howToApply: ["Apply through Stand-Up India Portal", "Contact Lead District Manager", "Visit any scheduled commercial bank"],
    isNational: true,
    type: "Business Loan",
    eligibilityCriteria: { casteCategory: "SC/ST", gender: "Female" }
  }
];
