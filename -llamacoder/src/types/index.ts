export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  additionalInfo: string;
  status: 'pending' | 'review' | 'approved' | 'rejected';
  submittedAt: Date;
}

export interface Position {
  id: string;
  title: string;
  createdAt: Date;
}