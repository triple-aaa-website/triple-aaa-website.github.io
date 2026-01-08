import { Application, Position } from '../types';

class StorageService {
  private readonly APPLICATIONS_KEY = 'jobflow_applications';
  private readonly POSITIONS_KEY = 'jobflow_positions';

  // Initialize default positions if none exist
  initializePositions(): void {
    const existing = this.getPositionsFromStorage();
    if (existing.length === 0) {
      const defaultPositions: Position[] = [
        { id: '1', title: 'Frontend Developer', createdAt: new Date() },
        { id: '2', title: 'Backend Developer', createdAt: new Date() },
        { id: '3', title: 'Full Stack Developer', createdAt: new Date() },
        { id: '4', title: 'UI/UX Designer', createdAt: new Date() },
        { id: '5', title: 'Product Manager', createdAt: new Date() },
        { id: '6', title: 'Data Analyst', createdAt: new Date() },
        { id: '7', title: 'DevOps Engineer', createdAt: new Date() },
        { id: '8', title: 'QA Engineer', createdAt: new Date() },
      ];
      this.savePositionsToStorage(defaultPositions);
    }
  }

  // Application methods
  async submitApplication(application: Application): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const applications = this.getApplicationsFromStorage();
    applications.push(application);
    this.saveApplicationsToStorage(applications);
  }

  async getApplications(): Promise<Application[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.getApplicationsFromStorage();
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const applications = this.getApplicationsFromStorage();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      this.saveApplicationsToStorage(applications);
    }
  }

  async deleteApplication(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const applications = this.getApplicationsFromStorage();
    const filtered = applications.filter(app => app.id !== id);
    this.saveApplicationsToStorage(filtered);
  }

  // Position methods
  async getPositions(): Promise<Position[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.getPositionsFromStorage();
  }

  async addPosition(title: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const positions = this.getPositionsFromStorage();
    const newPosition: Position = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date()
    };
    positions.push(newPosition);
    this.savePositionsToStorage(positions);
  }

  async updatePosition(id: string, title: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const positions = this.getPositionsFromStorage();
    const index = positions.findIndex(pos => pos.id === id);
    if (index !== -1) {
      positions[index].title = title;
      this.savePositionsToStorage(positions);
    }
  }

  async deletePosition(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const positions = this.getPositionsFromStorage();
    const filtered = positions.filter(pos => pos.id !== id);
    this.savePositionsToStorage(filtered);
  }

  // Export methods
  async exportApplicationsAsCSV(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const applications = this.getApplicationsFromStorage();
    
    const headers = ['Name', 'Email', 'Phone', 'Position', 'Status', 'Submitted At', 'Additional Info'];
    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        `"${app.name}"`,
        `"${app.email}"`,
        `"${app.phone}"`,
        `"${app.position}"`,
        `"${app.status}"`,
        `"${app.submittedAt.toISOString()}"`,
        `"${app.additionalInfo.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Private storage methods
  private getApplicationsFromStorage(): Application[] {
    try {
      const stored = localStorage.getItem(this.APPLICATIONS_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.map((app: any) => ({
        ...app,
        submittedAt: new Date(app.submittedAt)
      }));
    } catch (error) {
      console.error('Error reading applications from storage:', error);
      return [];
    }
  }

  private saveApplicationsToStorage(applications: Application[]): void {
    try {
      localStorage.setItem(this.APPLICATIONS_KEY, JSON.stringify(applications));
    } catch (error) {
      console.error('Error saving applications to storage:', error);
    }
  }

  private getPositionsFromStorage(): Position[] {
    try {
      const stored = localStorage.getItem(this.POSITIONS_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.map((pos: any) => ({
        ...pos,
        createdAt: new Date(pos.createdAt)
      }));
    } catch (error) {
      console.error('Error reading positions from storage:', error);
      return [];
    }
  }

  private savePositionsToStorage(positions: Position[]): void {
    try {
      localStorage.setItem(this.POSITIONS_KEY, JSON.stringify(positions));
    } catch (error) {
      console.error('Error saving positions to storage:', error);
    }
  }

  clearAllData(): void {
    localStorage.removeItem(this.APPLICATIONS_KEY);
    localStorage.removeItem(this.POSITIONS_KEY);
  }
}

export const storageService = new StorageService();