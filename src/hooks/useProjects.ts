import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Project } from '../types';
import toast from 'react-hot-toast';

export function useProjects() {
  const { user, demoMode } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load projects
  useEffect(() => {
    if (demoMode || !user) {
      setLoading(false);
      return;
    }

    loadProjects();
  }, [user, demoMode]);

  const loadProjects = async () => {
    if (!supabase || !user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProjects(data || []);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error(`Failed to load projects: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (name: string, description?: string): Promise<Project | null> => {
    if (demoMode) {
      toast.error('Demo mode: Add Supabase credentials to create projects');
      return null;
    }

    if (!supabase || !user) {
      toast.error('You must be logged in to create a project');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: user.id,
          name,
          description: description || null,
        }] as any)
        .select()
        .single();

      if (error) throw error;

      setProjects((prev) => [data, ...prev]);
      toast.success(`Project "${name}" created successfully`);
      return data;
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed to create project: ${error.message}`);
      return null;
    }
  };

  const updateProject = async (
    id: string,
    updates: { name?: string; description?: string }
  ): Promise<boolean> => {
    if (demoMode) {
      toast.error('Demo mode: Add Supabase credentials to update projects');
      return false;
    }

    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .update(updates as any)
        .eq('id', id);

      if (error) throw error;

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
      toast.success('Project updated successfully');
      return true;
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed to update project: ${error.message}`);
      return false;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    if (demoMode) {
      toast.error('Demo mode: Add Supabase credentials to delete projects');
      return false;
    }

    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted successfully');
      return true;
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed to delete project: ${error.message}`);
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: loadProjects,
  };
}
