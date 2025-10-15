import { useState } from 'react';
import { FolderOpen, Plus, ChevronDown } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useDebtScore } from '../../hooks/useDebtScore';
import { useAuth } from '../../contexts/AuthContext';
import { CreateProjectModal } from './CreateProjectModal';

export function ProjectSelector() {
  const { projects, loading } = useProjects();
  const { currentProjectId, loadComponentsForProject } = useDebtScore();
  const { demoMode } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const currentProject = projects.find((p) => p.id === currentProjectId);

  const handleProjectSelect = async (projectId: string) => {
    await loadComponentsForProject(projectId);
    setIsOpen(false);
  };

  if (demoMode) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg">
        <FolderOpen className="w-4 h-4 text-white" />
        <span className="text-sm font-medium text-white">Sample Project</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-white">Loading projects...</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          <FolderOpen className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">
            {currentProject?.name || 'Select Project'}
          </span>
          <ChevronDown className="w-4 h-4 text-white" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Project</span>
                </button>
              </div>

              {projects.length > 0 && (
                <>
                  <div className="border-t border-gray-100" />
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleProjectSelect(project.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          currentProjectId === project.id
                            ? 'bg-purple-50 text-purple-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <FolderOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {project.name}
                            </div>
                            {project.description && (
                              <div className="text-xs text-gray-500 truncate mt-0.5">
                                {project.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {projects.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">
                  <p>No projects yet</p>
                  <p className="text-xs mt-1">Create your first project to get started</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
}
