
export interface Scholarship {
  id: string;
  title: string;
  tags: string[];
  isBookmarked: boolean;
  category: string;
  level: string;
  description: string;
  amount: string;
  deadline: string;
  institutionType: 'Public-U' | 'Private-U' | 'International' | 'Any';
  fundType: 'Sponsorship' | 'Loan' | 'Bursary' | 'Any';
  status: 'OPEN' | 'CLOSED';
}

export interface UserApplication {
  id: string;
  scholarshipId: string;
  status: 'In Progress' | 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  appliedDate: string;
}

export type AppView = 'home' | 'applications' | 'profile' | 'details' | 'ai-search' | 'saved';

export interface FilterState {
  fieldOfStudy: string;
  level: string;
  institutionType: string;
  fundType: string;
}
