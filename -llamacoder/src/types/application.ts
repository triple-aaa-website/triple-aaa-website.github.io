export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  additionalInfo: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  submittedAt: Date;
}