import { Application } from '../types/application';

// This service layer makes it easy to swap with a real backend later
class ApiService {
  private applications: Application[] = [];

  // Simulate API calls with async methods
  async submitApplication(application: Application): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    this.applications.push(application);
  }

  async getApplications(): Promise<Application[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.applications];
  }

  async updateApplication(id: string, updates: Partial<Application>): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = this.applications.findIndex(app => app.id === id);
    if (index !== -1) {
      this.applications[index] = { ...this.applications[index], ...updates };
    }
  }

  async deleteApplication(id: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    this.applications = this.applications.filter(app => app.id !== id);
  }

  async exportApplications(format: 'json' | 'csv'): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (format === 'json') {
      const dataStr = JSON.stringify(this.applications, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `applications-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Position', 'Status', 'Submitted At', 'Additional Info'],
        ...this.applications.map(app => [
          app.name,
          app.email,
          app.phone,
          app.position,
          app.status,
          app.submittedAt.toISOString(),
          app.additionalInfo
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}

export const apiService = new ApiService();