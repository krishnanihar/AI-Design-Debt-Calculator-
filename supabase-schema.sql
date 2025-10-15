-- AI Design Debt Calculator Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Components table
CREATE TABLE IF NOT EXISTS public.components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('interactive', 'display', 'input', 'layout', 'feedback')),
  instances INTEGER DEFAULT 0,
  dependencies TEXT[] DEFAULT '{}',
  last_modified DATE DEFAULT CURRENT_DATE,
  team TEXT DEFAULT 'Unknown',
  metrics JSONB NOT NULL,
  debt_score INTEGER NOT NULL,
  dimension_scores JSONB NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  issues JSONB DEFAULT '[]',
  remediation_effort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project shares table (for team collaboration)
CREATE TABLE IF NOT EXISTS public.project_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL CHECK (permission IN ('view', 'edit')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Analysis snapshots table (for historical tracking)
CREATE TABLE IF NOT EXISTS public.analysis_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  snapshot_name TEXT NOT NULL,
  total_components INTEGER NOT NULL,
  average_debt_score NUMERIC(5,2) NOT NULL,
  critical_count INTEGER DEFAULT 0,
  high_count INTEGER DEFAULT 0,
  medium_count INTEGER DEFAULT 0,
  low_count INTEGER DEFAULT 0,
  total_remediation_effort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_components_project_id ON public.components(project_id);
CREATE INDEX IF NOT EXISTS idx_components_severity ON public.components(severity);
CREATE INDEX IF NOT EXISTS idx_project_shares_project_id ON public.project_shares(project_id);
CREATE INDEX IF NOT EXISTS idx_project_shares_user_id ON public.project_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_snapshots_project_id ON public.analysis_snapshots(project_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for projects table
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.project_shares
      WHERE project_shares.project_id = projects.id
      AND project_shares.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.project_shares
      WHERE project_shares.project_id = projects.id
      AND project_shares.user_id = auth.uid()
      AND project_shares.permission = 'edit'
    )
  );

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for components table
CREATE POLICY "Users can view components in their projects" ON public.components
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = components.project_id
      AND (
        projects.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.project_shares
          WHERE project_shares.project_id = projects.id
          AND project_shares.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create components in their projects" ON public.components
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = components.project_id
      AND (
        projects.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.project_shares
          WHERE project_shares.project_id = projects.id
          AND project_shares.user_id = auth.uid()
          AND project_shares.permission = 'edit'
        )
      )
    )
  );

CREATE POLICY "Users can update components in their projects" ON public.components
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = components.project_id
      AND (
        projects.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.project_shares
          WHERE project_shares.project_id = projects.id
          AND project_shares.user_id = auth.uid()
          AND project_shares.permission = 'edit'
        )
      )
    )
  );

CREATE POLICY "Users can delete components in their projects" ON public.components
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = components.project_id
      AND (
        projects.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.project_shares
          WHERE project_shares.project_id = projects.id
          AND project_shares.user_id = auth.uid()
          AND project_shares.permission = 'edit'
        )
      )
    )
  );

-- RLS Policies for project_shares table
CREATE POLICY "Users can view shares for their projects" ON public.project_shares
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_shares.project_id
      AND projects.user_id = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Project owners can create shares" ON public.project_shares
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_shares.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can update shares" ON public.project_shares
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_shares.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete shares" ON public.project_shares
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_shares.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for analysis_snapshots table
CREATE POLICY "Users can view snapshots of their projects" ON public.analysis_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = analysis_snapshots.project_id
      AND (
        projects.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.project_shares
          WHERE project_shares.project_id = projects.id
          AND project_shares.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create snapshots in their projects" ON public.analysis_snapshots
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = analysis_snapshots.project_id
      AND (
        projects.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.project_shares
          WHERE project_shares.project_id = projects.id
          AND project_shares.user_id = auth.uid()
          AND project_shares.permission = 'edit'
        )
      )
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at BEFORE UPDATE ON public.components
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
