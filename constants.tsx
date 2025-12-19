
import { Scholarship, AppNotification } from './types';

export const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: '1',
    title: 'Future Innovators Scholarship',
    tags: ['Engineering', 'Degree'],
    isBookmarked: false,
    category: 'Engineering',
    level: 'Degree',
    description: 'Supporting the next generation of engineers who are pushing boundaries in tech and sustainable energy.',
    amount: '$10,000',
    deadline: '2026-01-31',
    institutionType: 'Public-U',
    fundType: 'Sponsorship',
    status: 'OPEN'
  },
  {
    id: '2',
    title: 'Global Business Leaders Grant',
    tags: ['Business', 'Master'],
    isBookmarked: false,
    category: 'Business',
    level: 'Master',
    description: 'A grant for exceptional students pursuing postgraduate studies in business administration and international management.',
    amount: '$15,000',
    deadline: '2024-11-15',
    institutionType: 'Private-U',
    fundType: 'Sponsorship',
    status: 'CLOSED'
  },
  {
    id: '3',
    title: 'Creative Minds Award',
    tags: ['Arts', 'SPM/STPM'],
    isBookmarked: false,
    category: 'Arts',
    level: 'SPM/STPM',
    description: 'Recognizing artistic talent in students coming from diverse creative backgrounds.',
    amount: '$5,000',
    deadline: '2026-02-15',
    institutionType: 'Any',
    fundType: 'Bursary',
    status: 'OPEN'
  },
  {
    id: '4',
    title: 'Digital Accounting Scholarship',
    tags: ['Accounting', 'Degree'],
    isBookmarked: false,
    category: 'Accounting',
    level: 'Degree',
    description: 'Focusing on the intersection of finance and digital transformation in the modern accounting landscape.',
    amount: '$8,000',
    deadline: '2026-03-10',
    institutionType: 'Public-U',
    fundType: 'Loan',
    status: 'OPEN'
  },
  {
    id: '5',
    title: 'Women in STEM Excellence',
    tags: ['Science', 'Degree'],
    isBookmarked: false,
    category: 'Science',
    level: 'Degree',
    description: 'Encouraging female students to excel in science, technology, engineering, and mathematics.',
    amount: '$12,000',
    deadline: '2025-03-01',
    institutionType: 'Any',
    fundType: 'Sponsorship',
    status: 'CLOSED'
  },
  {
    id: '6',
    title: 'International Medical Grant',
    tags: ['Medicine', 'PhD'],
    isBookmarked: false,
    category: 'Medicine',
    level: 'PhD',
    description: 'For students pursuing advanced medical research in international clinical environments.',
    amount: '$25,000',
    deadline: '2026-04-20',
    institutionType: 'International',
    fundType: 'Sponsorship',
    status: 'OPEN'
  },
  {
    id: '7',
    title: 'Sustainability Champions Fund',
    tags: ['Science', 'Foundation'],
    isBookmarked: false,
    category: 'Science',
    level: 'Foundation',
    description: 'Awarding students who demonstrate leadership in environmental sustainability and conservation.',
    amount: '$4,000',
    deadline: '2026-05-05',
    institutionType: 'Any',
    fundType: 'Bursary',
    status: 'OPEN'
  },
  {
    id: '8',
    title: 'Premier Law Fellowship',
    tags: ['Law', 'Master'],
    isBookmarked: false,
    category: 'Law',
    level: 'Master',
    description: 'Prestigious fellowship for top-tier law graduates looking to specialize in corporate legal frameworks.',
    amount: '$20,000',
    deadline: '2024-09-30',
    institutionType: 'Private-U',
    fundType: 'Sponsorship',
    status: 'CLOSED'
  },
  {
    id: '9',
    title: 'Silicon Valley Tech Grant',
    tags: ['Computer Science', 'Degree'],
    isBookmarked: false,
    category: 'Computer Science',
    level: 'Degree',
    description: 'Funding for innovative computer science projects and students aiming for careers in software engineering.',
    amount: '$15,000',
    deadline: '2026-06-15',
    institutionType: 'International',
    fundType: 'Sponsorship',
    status: 'OPEN'
  },
  {
    id: '10',
    title: 'Psychology & Wellness Award',
    tags: ['Psychology', 'Degree'],
    isBookmarked: false,
    category: 'Psychology',
    level: 'Degree',
    description: 'Supporting students dedicated to advancing mental health research and clinical practices.',
    amount: '$7,500',
    deadline: '2026-01-20',
    institutionType: 'Public-U',
    fundType: 'Bursary',
    status: 'OPEN'
  },
  {
    id: '11',
    title: 'National Engineering Foundation Sponsorship',
    tags: ['Engineering', 'Foundation', 'Local'],
    isBookmarked: false,
    category: 'Engineering',
    level: 'Foundation',
    description: 'A full sponsorship program for promising local students intending to pursue engineering degrees at public universities, starting from their foundation year.',
    amount: '$6,000',
    deadline: '2026-08-15',
    institutionType: 'Public-U',
    fundType: 'Sponsorship',
    status: 'OPEN'
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Deadline Approaching',
    message: 'The "Future Innovators Scholarship" closes in 2 days. Complete your application now!',
    type: 'deadline',
    timestamp: '2 hours ago',
    isRead: false
  },
  {
    id: 'n2',
    title: 'New Match Found',
    message: 'We found a new PhD grant in Medicine that matches your profile.',
    type: 'match',
    timestamp: '5 hours ago',
    isRead: false
  },
  {
    id: 'n3',
    title: 'Application Status',
    message: 'Your application for "Digital Accounting" has been moved to "Under Review".',
    type: 'status',
    timestamp: '1 day ago',
    isRead: true
  },
  {
    id: 'n4',
    title: 'Profile Tip',
    message: 'Upload your latest transcript to improve your recommendation accuracy.',
    type: 'info',
    timestamp: '2 days ago',
    isRead: true
  }
];

export const FILTER_OPTIONS = {
  fieldOfStudy: ['All', 'Engineering', 'Accounting', 'Business', 'Science', 'Medicine', 'Arts', 'Education', 'Law', 'Architecture', 'Computer Science', 'Psychology'],
  level: ['All', 'SPM/STPM', 'Foundation', 'Diploma', 'Degree', 'Master', 'PhD'],
  institutionType: ['All', 'Public-U', 'Private-U', 'International', 'Any'],
  fundType: ['All', 'Sponsorship', 'Loan', 'Bursary']
};
