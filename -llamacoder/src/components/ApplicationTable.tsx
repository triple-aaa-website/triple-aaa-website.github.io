import { useState } from 'react';
import { Application } from '../types/application';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Edit, Save, X, Download, Trash, Eye } from 'lucide-react';

interface ApplicationTableProps {
  applications: Application[];
  onUpdateApplication: (id: string, updates: Partial<Application>) => void;
  onDeleteApplication: (id: string) => void;
  onExportApplications: (format: 'json' | 'csv') => void;
}

export function ApplicationTable({ 
  applications, 
  onUpdateApplication, 
  onDeleteApplication,
  onExportApplications
}: ApplicationTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Application>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const startEdit = (application: Application) => {
    setEditingId(application.id);
    setEditForm(application);
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      onUpdateApplication(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const getStatusBadge = (status: Application['status']) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
          <p className="text-gray-600 mt-1">{applications.length} total submissions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onExportApplications('json')} 
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onExportApplications('csv')} 
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {editingId === application.id ? (
                      <Input
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
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
                  <td className="px-6 py-4">
                    {editingId === application.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full text-sm"
                          placeholder="Email"
                        />
                        <Input
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
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
                  <td className="px-6 py-4">
                    {editingId === application.id ? (
                      <Input
                        value={editForm.position || ''}
                        onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{application.position}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === application.id ? (
                      <Select
                        value={editForm.status}
                        onValueChange={(value) => setEditForm({ ...editForm, status: value as Application['status'] })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getStatusBadge(application.status)
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {editingId === application.id ? (
                        <>
                          <Button size="sm" onClick={saveEdit} className="gap-1">
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit} className="gap-1">
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setExpandedId(expandedId === application.id ? null : application.id)}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => startEdit(application)} className="gap-1">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onDeleteApplication(application.id)}
                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
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
      </div>

      {expandedId && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {applications.find(app => app.id === expandedId)?.additionalInfo || 'No additional information provided'}
          </p>
        </div>
      )}
    </div>
  );
}