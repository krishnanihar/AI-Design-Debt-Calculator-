export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      components: {
        Row: {
          id: string
          project_id: string
          name: string
          type: 'interactive' | 'display' | 'input' | 'layout' | 'feedback'
          instances: number
          dependencies: string[]
          last_modified: string
          team: string
          metrics: Json
          debt_score: number
          dimension_scores: Json
          severity: 'critical' | 'high' | 'medium' | 'low'
          issues: Json
          remediation_effort: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          type: 'interactive' | 'display' | 'input' | 'layout' | 'feedback'
          instances: number
          dependencies?: string[]
          last_modified: string
          team: string
          metrics: Json
          debt_score: number
          dimension_scores: Json
          severity: 'critical' | 'high' | 'medium' | 'low'
          issues: Json
          remediation_effort: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          type?: 'interactive' | 'display' | 'input' | 'layout' | 'feedback'
          instances?: number
          dependencies?: string[]
          last_modified?: string
          team?: string
          metrics?: Json
          debt_score?: number
          dimension_scores?: Json
          severity?: 'critical' | 'high' | 'medium' | 'low'
          issues?: Json
          remediation_effort?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_shares: {
        Row: {
          id: string
          project_id: string
          user_id: string
          permission: 'view' | 'edit'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          permission?: 'view' | 'edit'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          permission?: 'view' | 'edit'
          created_at?: string
        }
      }
      analysis_snapshots: {
        Row: {
          id: string
          project_id: string
          snapshot_name: string
          total_components: number
          average_debt_score: number
          critical_count: number
          high_count: number
          medium_count: number
          low_count: number
          total_remediation_effort: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          snapshot_name: string
          total_components: number
          average_debt_score: number
          critical_count: number
          high_count: number
          medium_count: number
          low_count: number
          total_remediation_effort: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          snapshot_name?: string
          total_components?: number
          average_debt_score?: number
          critical_count?: number
          high_count?: number
          medium_count?: number
          low_count?: number
          total_remediation_effort?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
