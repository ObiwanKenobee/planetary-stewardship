export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ledger_entries: {
        Row: {
          description: string | null
          event_at: string
          id: string
          proof_type: string
          quantity: string
          river_id: string | null
          title: string
          tx_hash: string
          verified: boolean
        }
        Insert: {
          description?: string | null
          event_at?: string
          id?: string
          proof_type: string
          quantity: string
          river_id?: string | null
          title: string
          tx_hash: string
          verified?: boolean
        }
        Update: {
          description?: string | null
          event_at?: string
          id?: string
          proof_type?: string
          quantity?: string
          river_id?: string | null
          title?: string
          tx_hash?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_river_id_fkey"
            columns: ["river_id"]
            isOneToOne: false
            referencedRelation: "rivers"
            referencedColumns: ["id"]
          },
        ]
      }
      rangers: {
        Row: {
          created_at: string
          id: string
          name: string
          reputation: number
          river_id: string | null
          status: string
          zone: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          reputation?: number
          river_id?: string | null
          status?: string
          zone: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          reputation?: number
          river_id?: string | null
          status?: string
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "rangers_river_id_fkey"
            columns: ["river_id"]
            isOneToOne: false
            referencedRelation: "rivers"
            referencedColumns: ["id"]
          },
        ]
      }
      river_photos: {
        Row: {
          caption: string | null
          id: string
          river_id: string
          taken_at: string
          url: string
        }
        Insert: {
          caption?: string | null
          id?: string
          river_id: string
          taken_at?: string
          url: string
        }
        Update: {
          caption?: string | null
          id?: string
          river_id?: string
          taken_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "river_photos_river_id_fkey"
            columns: ["river_id"]
            isOneToOne: false
            referencedRelation: "rivers"
            referencedColumns: ["id"]
          },
        ]
      }
      rivers: {
        Row: {
          baseline_year: number
          basin: string
          biodiversity: number
          city: string
          created_at: string
          do_mgl: number | null
          flood_risk: string
          flow_m3s: number | null
          health: number
          health_trend: number
          id: string
          lat: number
          lng: number
          map_x: number
          map_y: number
          name: string
          ph: number | null
          rangers_active: number
          slug: string
          status_note: string | null
          trees_restored: number
          turbidity: string | null
          updated_at: string
          waste_removed_t: number
        }
        Insert: {
          baseline_year?: number
          basin: string
          biodiversity?: number
          city: string
          created_at?: string
          do_mgl?: number | null
          flood_risk?: string
          flow_m3s?: number | null
          health?: number
          health_trend?: number
          id?: string
          lat: number
          lng: number
          map_x?: number
          map_y?: number
          name: string
          ph?: number | null
          rangers_active?: number
          slug: string
          status_note?: string | null
          trees_restored?: number
          turbidity?: string | null
          updated_at?: string
          waste_removed_t?: number
        }
        Update: {
          baseline_year?: number
          basin?: string
          biodiversity?: number
          city?: string
          created_at?: string
          do_mgl?: number | null
          flood_risk?: string
          flow_m3s?: number | null
          health?: number
          health_trend?: number
          id?: string
          lat?: number
          lng?: number
          map_x?: number
          map_y?: number
          name?: string
          ph?: number | null
          rangers_active?: number
          slug?: string
          status_note?: string | null
          trees_restored?: number
          turbidity?: string | null
          updated_at?: string
          waste_removed_t?: number
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
