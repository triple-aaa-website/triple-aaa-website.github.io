import { Application } from '../types/application';

class ApplicationStorage {
  private applications: Application[] = [];

  saveApplication(application: Application): void {
    this.applications.push(application);
  }

  getApplications(): Application[] {
    return [...this.applications];
  }

  updateApplication(id: string, updates: Partial<Application>): void {
    const index = this.applications.findIndex(app => app.id === id);
    if (index !== -1) {
      this.applications[index] = { ...this.applications[index], ...updates };
    }
  }

  deleteApplication(id: string): void {
    this.applications = this.applications.filter(app => app.id !== id);
  }

  getApplicationsCount(): number {
    return this.applications.length;
  }

  getApplicationsByStatus(status: Application['status']): Application[] {
    return this.applications.filter(app => app.status === status);
  }
}

export const applicationStorage = new ApplicationStorage();