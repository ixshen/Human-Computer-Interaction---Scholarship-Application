
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'match' | 'status' | 'info';
  timestamp: string;
  isRead: boolean;
}

export type AppView = 'home' | 'applications' | 'profile' | 'details' | 'ai-search' | 'saved' | 'notifications' | 'eligibility';

export interface FilterState {
  fieldOfStudy: string;
  level: string;
  institutionType: string;
  fundType: string;
}

export interface EligibilityState {
  cgpa: string;
  household: 'B40' | 'M40' | 'T20' | null;
  score: number;
}
