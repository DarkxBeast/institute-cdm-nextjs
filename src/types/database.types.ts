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
            cdm_batches: {
                Row: {
                    id: string
                    institute_id: string | null
                    proposal_id: string | null
                    name: string
                    status: string | null
                    start_date: string | null
                    end_date: string | null
                    schedule_description: string | null
                    mentor_id: string | null
                    department: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    institute_id?: string | null
                    proposal_id?: string | null
                    name: string
                    status?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    schedule_description?: string | null
                    mentor_id?: string | null
                    department?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    institute_id?: string | null
                    proposal_id?: string | null
                    name?: string
                    status?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    schedule_description?: string | null
                    mentor_id?: string | null
                    department?: string | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_batches_institute_id_fkey"
                        columns: ["institute_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_institutes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_batches_mentor_id_fkey"
                        columns: ["mentor_id"]
                        isOneToOne: false
                        referencedRelation: "mentors_new"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_institute_pocs: {
                Row: {
                    id: string
                    institute_id: string | null
                    full_name: string
                    email: string | null
                    phone: string | null
                    designation: string | null
                    is_primary_contact: boolean | null
                    created_at: string | null
                    user_id: string | null
                }
                Insert: {
                    id?: string
                    institute_id?: string | null
                    full_name: string
                    email?: string | null
                    phone?: string | null
                    designation?: string | null
                    is_primary_contact?: boolean | null
                    created_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    id?: string
                    institute_id?: string | null
                    full_name?: string
                    email?: string | null
                    phone?: string | null
                    designation?: string | null
                    is_primary_contact?: boolean | null
                    created_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_institute_pocs_institute_id_fkey"
                        columns: ["institute_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_institutes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_institute_pocs_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_institutes: {
                Row: {
                    id: string
                    name: string
                    code: string | null
                    location: string | null
                    logo_url: string | null
                    website_url: string | null
                    status: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    code?: string | null
                    location?: string | null
                    logo_url?: string | null
                    website_url?: string | null
                    status?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    code?: string | null
                    location?: string | null
                    logo_url?: string | null
                    website_url?: string | null
                    status?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            cdm_journey_sessions: {
                Row: {
                    id: string
                    journey_item_id: string | null
                    journey_item_name: string | null
                    mentor_id: string | null
                    scheduled_date: string | null
                    meeting_link: string | null
                    status: string | null
                    session_type: string | null
                    recording_link: string | null
                }
                Insert: {
                    id?: string
                    journey_item_id?: string | null
                    journey_item_name?: string | null
                    mentor_id?: string | null
                    scheduled_date?: string | null
                    meeting_link?: string | null
                    status?: string | null
                    session_type?: string | null
                    recording_link?: string | null
                }
                Update: {
                    id?: string
                    journey_item_id?: string | null
                    journey_item_name?: string | null
                    mentor_id?: string | null
                    scheduled_date?: string | null
                    meeting_link?: string | null
                    status?: string | null
                    session_type?: string | null
                    recording_link?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_journey_sessions_journey_item_id_fkey"
                        columns: ["journey_item_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_learning_journey_items"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_journey_sessions_mentor_id_fkey"
                        columns: ["mentor_id"]
                        isOneToOne: false
                        referencedRelation: "mentors_new"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_learning_journey_items: {
                Row: {
                    id: string
                    learning_journey_id: string | null
                    product_id: string | null
                    particulars: string | null
                    product_code: string | null
                    delivery_mode: string | null
                    format: string | null
                    total_hours: number | null
                    student_count: number | null
                    num_sessions: number | null
                    start_date: string | null
                    end_date: string | null
                    status: string | null
                    average_rating: number | null
                    sequence_order: number | null
                }
                Insert: {
                    id?: string
                    learning_journey_id?: string | null
                    product_id?: string | null
                    particulars?: string | null
                    product_code?: string | null
                    delivery_mode?: string | null
                    format?: string | null
                    total_hours?: number | null
                    student_count?: number | null
                    num_sessions?: number | null
                    start_date?: string | null
                    end_date?: string | null
                    status?: string | null
                    average_rating?: number | null
                    sequence_order?: number | null
                }
                Update: {
                    id?: string
                    learning_journey_id?: string | null
                    product_id?: string | null
                    particulars?: string | null
                    product_code?: string | null
                    delivery_mode?: string | null
                    format?: string | null
                    total_hours?: number | null
                    student_count?: number | null
                    num_sessions?: number | null
                    start_date?: string | null
                    end_date?: string | null
                    status?: string | null
                    average_rating?: number | null
                    sequence_order?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_learning_journey_items_learning_journey_id_fkey"
                        columns: ["learning_journey_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_learning_journeys"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_learning_journey_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_learning_journeys: {
                Row: {
                    id: string
                    proposal_id: string | null
                    institute_id: string | null
                    batch_id: string | null
                    status: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    proposal_id?: string | null
                    institute_id?: string | null
                    batch_id?: string | null
                    status?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    proposal_id?: string | null
                    institute_id?: string | null
                    batch_id?: string | null
                    status?: string | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_learning_journeys_batch_id_fkey"
                        columns: ["batch_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_batches"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_learning_journeys_institute_id_fkey"
                        columns: ["institute_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_institutes"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_learning_journeys_proposal_id_fkey"
                        columns: ["proposal_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_proposals"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_modules: {
                Row: {
                    id: string
                    title: string
                    category: string
                    category_code: string | null
                    description: string | null
                    mode: string
                    delivery_type: string
                    indicative_timeline: string | null
                    total_hours_per_student: number | null
                    session_count: number | null
                    num_students: number | null
                    price_per_session_ctu: number | null
                    ctc: number
                    ctu: number | null
                    price_per_student: number | null
                    ctc_per_session: number | null
                    margin: number | null
                    margin_percentage: number | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    category: string
                    category_code?: string | null
                    description?: string | null
                    mode: string
                    delivery_type: string
                    indicative_timeline?: string | null
                    total_hours_per_student?: number | null
                    session_count?: number | null
                    num_students?: number | null
                    price_per_session_ctu?: number | null
                    ctc?: number
                    ctu?: number | null
                    price_per_student?: number | null
                    ctc_per_session?: number | null
                    margin?: number | null
                    margin_percentage?: number | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    category?: string
                    category_code?: string | null
                    description?: string | null
                    mode?: string
                    delivery_type?: string
                    indicative_timeline?: string | null
                    total_hours_per_student?: number | null
                    session_count?: number | null
                    num_students?: number | null
                    price_per_session_ctu?: number | null
                    ctc?: number
                    ctu?: number | null
                    price_per_student?: number | null
                    ctc_per_session?: number | null
                    margin?: number | null
                    margin_percentage?: number | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            cdm_products: {
                Row: {
                    id: string
                    module_id: string | null
                    particulars: string
                    product_code: string
                    delivery_mode: string | null
                    format: string | null
                    total_hours: number | null
                    max_students: number | null
                    num_sessions: number | null
                    ctc_per_session: number | null
                    asking_price_per_session: number | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    module_id?: string | null
                    particulars: string
                    product_code: string
                    delivery_mode?: string | null
                    format?: string | null
                    total_hours?: number | null
                    max_students?: number | null
                    num_sessions?: number | null
                    ctc_per_session?: number | null
                    asking_price_per_session?: number | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    module_id?: string | null
                    particulars?: string
                    product_code?: string
                    delivery_mode?: string | null
                    format?: string | null
                    total_hours?: number | null
                    max_students?: number | null
                    num_sessions?: number | null
                    ctc_per_session?: number | null
                    asking_price_per_session?: number | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_products_module_id_fkey" // Implicitly assuming or adding if it exists
                        columns: ["module_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_modules"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_proposal_items: {
                Row: {
                    id: string
                    proposal_id: string | null
                    product_id: string | null
                    sequence_order: number
                    tentative_start_date: string | null
                    tentative_end_date: string | null
                    student_count: number
                    quoted_price_per_session: number | null
                    snapshot_particulars: string | null
                    snapshot_product_code: string | null
                    snapshot_delivery_mode: string | null
                    snapshot_max_students: number | null
                    snapshot_ctc_per_session: number | null
                    num_sessions: number | null
                    total_ctc: number | null
                    total_asking_price: number | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    proposal_id?: string | null
                    product_id?: string | null
                    sequence_order?: number
                    tentative_start_date?: string | null
                    tentative_end_date?: string | null
                    student_count: number
                    quoted_price_per_session?: number | null
                    snapshot_particulars?: string | null
                    snapshot_product_code?: string | null
                    snapshot_delivery_mode?: string | null
                    snapshot_max_students?: number | null
                    snapshot_ctc_per_session?: number | null
                    num_sessions?: number | null
                    total_ctc?: number | null
                    total_asking_price?: number | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    proposal_id?: string | null
                    product_id?: string | null
                    sequence_order?: number
                    tentative_start_date?: string | null
                    tentative_end_date?: string | null
                    student_count?: number
                    quoted_price_per_session?: number | null
                    snapshot_particulars?: string | null
                    snapshot_product_code?: string | null
                    snapshot_delivery_mode?: string | null
                    snapshot_max_students?: number | null
                    snapshot_ctc_per_session?: number | null
                    num_sessions?: number | null
                    total_ctc?: number | null
                    total_asking_price?: number | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_proposal_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_products"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_proposal_items_proposal_id_fkey"
                        columns: ["proposal_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_proposals"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_proposals: {
                Row: {
                    id: string
                    proposal_ref_id: string | null
                    institute_id: string
                    batch_id: string
                    status: string | null
                    discount_percentage: number | null
                    gst_percentage: number | null
                    created_by: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    proposal_ref_id?: string | null
                    institute_id: string
                    batch_id: string
                    status?: string | null
                    discount_percentage?: number | null
                    gst_percentage?: number | null
                    created_by?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    proposal_ref_id?: string | null
                    institute_id?: string
                    batch_id?: string
                    status?: string | null
                    discount_percentage?: number | null
                    gst_percentage?: number | null
                    created_by?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_proposals_batch_id_fkey"
                        columns: ["batch_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_batches"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_proposals_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "users" // Assumption
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_proposals_institute_id_fkey"
                        columns: ["institute_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_institutes"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_session_attendees: {
                Row: {
                    id: string
                    session_id: string
                    student_id: string
                    attendance_status: string | null
                    feedback_data: Json | null
                    is_report_generated: boolean | null
                    session_name: string | null
                    batch_name: string | null
                    student_name: string | null
                    journey_item_id: string | null
                }
                Insert: {
                    id?: string
                    session_id: string
                    student_id: string
                    attendance_status?: string | null
                    feedback_data?: Json | null
                    is_report_generated?: boolean | null
                    session_name?: string | null
                    batch_name?: string | null
                    student_name?: string | null
                    journey_item_id?: string | null
                }
                Update: {
                    id?: string
                    session_id?: string
                    student_id?: string
                    attendance_status?: string | null
                    feedback_data?: Json | null
                    is_report_generated?: boolean | null
                    session_name?: string | null
                    batch_name?: string | null
                    student_name?: string | null
                    journey_item_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_attendees_session_fkey"
                        columns: ["session_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_journey_sessions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_attendees_student_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_students"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_attendees_lji_fkey"
                        columns: ["journey_item_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_learning_journey_items"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_student_reports: {
                Row: {
                    id: string
                    attendee_id: string
                    session_id: string | null
                    journey_item_id: string | null
                    report_type: string
                    report_data: Json | null
                    batch_name: string | null
                    student_name: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    attendee_id: string
                    session_id?: string | null
                    journey_item_id?: string | null
                    report_type: string
                    report_data?: Json | null
                    batch_name?: string | null
                    student_name?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    attendee_id?: string
                    session_id?: string | null
                    journey_item_id?: string | null
                    report_type?: string
                    report_data?: Json | null
                    batch_name?: string | null
                    student_name?: string | null
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_reports_attendee_fkey"
                        columns: ["attendee_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_session_attendees"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_student_reports_session_id_fkey"
                        columns: ["session_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_journey_sessions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "cdm_reports_lji_fkey"
                        columns: ["journey_item_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_learning_journey_items"
                        referencedColumns: ["id"]
                    }
                ]
            }
            cdm_students: {
                Row: {
                    id: string
                    batch_id: string | null
                    full_name: string
                    email: string | null
                    phone: string | null
                    gender: string | null
                    enrollment_id: string | null
                }
                Insert: {
                    id?: string
                    batch_id?: string | null
                    full_name: string
                    email?: string | null
                    phone?: string | null
                    gender?: string | null
                    enrollment_id?: string | null
                }
                Update: {
                    id?: string
                    batch_id?: string | null
                    full_name?: string
                    email?: string | null
                    phone?: string | null
                    gender?: string | null
                    enrollment_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "cdm_students_batch_id_fkey"
                        columns: ["batch_id"]
                        isOneToOne: false
                        referencedRelation: "cdm_batches"
                        referencedColumns: ["id"]
                    }
                ]
            }
            mentors_new: {
                Row: {
                    id: string
                    mentor_first_name: string | null
                    mentor_last_name: string | null
                }
                Insert: {
                    id?: string
                    mentor_first_name?: string | null
                    mentor_last_name?: string | null
                }
                Update: {
                    id?: string
                    mentor_first_name?: string | null
                    mentor_last_name?: string | null
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
