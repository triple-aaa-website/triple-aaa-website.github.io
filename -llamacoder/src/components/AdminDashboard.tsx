import { useState, useEffect } from 'react';
import { Application, Position } from '../types';
import { storageService } from '../services/storageService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Edit, 
  Save, 
  X, 
  Download, 
  Trash, 
  Eye, 
  LogOut, 
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  Briefcase
} from 'lucide-react';
import { Toast } from './Toast';

export function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Edit states
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editAppForm, setEditAppForm] = useState<Partial<Application>>({});
  const [editingPosId, setEditingPosId] = useState<string | null>(null);
  const [editPosForm, setEditPosForm] = useState<Partial<Position>>({});
  const [newPositionTitle, setNewPositionTitle] = useState('');
  const [showAddPosition, setShowAddPosition] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appsData, positionsData] = await Promise.all([
        storageService.getApplications(),
        storageService.getPositions()
      ]);
      setApplications(appsData);
      setPositions(positionsData);
    } catch (error) {
      setToast({ message: 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplication = async (id: string, updates: Partial<Application>) => {
    try {
      await storageService.updateApplication(id, updates);
      await loadData();
      setToast({ message: 'Application updated successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update application', type: 'error' });
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await storageService.deleteApplication(id);
        await loadData();
        setToast({ message: 'Application deleted successfully', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete application', type: 'error' });
      }
    }
  };

  const handleAddPosition = async () => {
    if (!newPositionTitle.trim()) return;
    
    try {
      await storageService.addPosition(newPositionTitle);
      setNewPositionTitle('');
      setShowAddPosition(false);
      await loadData();
      setToast({ message: 'Position added successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to add position', type: 'error' });
    }
  };

  const handleUpdatePosition = async (id: string, title: string) => {
    try {
      await storageService.updatePosition(id, title);
      setEditingPosId(null);
      setEditPosForm({});
      await loadData();
      setToast({ message: 'Position updated successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update position', type: 'error' });
    }
  };

  const handleDeletePosition = async (id: string) => {
    if (confirm('Are you sure you want to delete this position?')) {
      try {
        await storageService.deletePosition(id);
        await loadData();
        setToast({ message: 'Position deleted successfully', type: 'success' });
      } catch (error) {
        setToast({ message: 'Failed to delete position', type: 'error' });
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      await storageService.exportApplicationsAsCSV();
      setToast({ message: 'Applications exported successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to export applications', type: 'error' });
    }
  };

  const handleStatusChange = async (id: string, status: Application['status']) => {
    await handleUpdateApplication(id, { status });
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'review':
        return <Eye className="w-5 h-5 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    review: applications.filter(app => app.status === 'review').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Review</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.review}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Positions Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Positions
                </CardTitle>
                <CardDescription>Manage job positions</CardDescription>
              </div>
              <div className="flex gap-2">
                {showAddPosition ? (
                  <div className="flex gap-2">
                    <Input
                      value={newPositionTitle}
                      onChange={(e) => setNewPositionTitle(e.target.value)}
                      placeholder="Position title"
                      className="w-48"
                    />
                    <Button size="sm" onClick={handleAddPosition}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddPosition(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => setShowAddPosition(true)} className="gap-1">
                    <Plus className="w-4 h-4" />
                    Add Position
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {positions.map((position) => (
                <div key={position.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {editingPosId === position.id ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        value={editPosForm.title || position.title}
                        onChange={(e) => setEditPosForm({ ...editPosForm, title: e.target.value })}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => handleUpdatePosition(position.id, editPosForm.title || position.title)}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingPosId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">{position.title}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingPosId(position.id);
                          setEditPosForm(position);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeletePosition(position.id)} className="text-red-600 hover:text-red-700">
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Applications</CardTitle>
                <CardDescription>{applications.length} total submissions</CardDescription>
              </div>
              <Button onClick={handleExportCSV} className="gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        {editingAppId === application.id ? (
                          <Input
                            value={editAppForm.name || ''}
                            onChange={(e) => setEditAppForm({ ...editAppForm, name: e.target.value })}
                            className="w-full"
                          />
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{application.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(application.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingAppId === application.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editAppForm.email || ''}
                              onChange={(e) => setEditAppForm({ ...editAppForm, email: e.target.value })}
                              className="w-full text-sm"
                              placeholder="Email"
                            />
                            <Input
                              value={editAppForm.phone || ''}
                              onChange={(e) => setEditAppForm({ ...editAppForm, phone: e.target.value })}
                              className="w-full text-sm"
                              placeholder="Phone"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">{application.email}</div>
                            <div className="text-sm text-gray-600">{application.phone}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingAppId === application.id ? (
                          <Input
                            value={editAppForm.position || ''}
                            onChange={(e) => setEditAppForm({ ...editAppForm, position: e.target.value })}
                            className="w-full"
                          />
                        ) : (
                          <span className="text-sm text-gray-900">{application.position}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <span className="text-sm capitalize">{application.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          {editingAppId === application.id ? (
                            <>
                              <Button size="sm" onClick={() => handleUpdateApplication(application.id, editAppForm)}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingAppId(null)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleStatusChange(application.id, 'review')} title="Mark for review">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleStatusChange(application.id, 'approved')} title="Approve">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleStatusChange(application.id, 'rejected')} title="Reject">
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => {
                                setEditingAppId(application.id);
                                setEditAppForm(application);
                              }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteApplication(application.id)} className="text-red-600 hover:text-red-700">
                                <Trash className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {applications.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-sm">No applications received yet</div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}