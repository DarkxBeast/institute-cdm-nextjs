-- ============================================================
-- CDM Schema (16 tables) — Supabase project: Career Company
-- Generated from live database on 2026-02-19
-- ============================================================

-- ----------------------------------------
-- 1. cdm_modules
-- ----------------------------------------
CREATE TABLE public.cdm_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  category_code text,
  description text,
  mode text NOT NULL,
  delivery_type text NOT NULL,
  indicative_timeline text,
  total_hours_per_student numeric,
  session_count integer DEFAULT 1,
  num_students integer DEFAULT 1,
  price_per_session_ctu numeric DEFAULT 0,
  ctc numeric NOT NULL DEFAULT 0,
  ctu numeric DEFAULT 0,
  price_per_student numeric DEFAULT 0,
  ctc_per_session numeric DEFAULT 0,
  margin numeric DEFAULT 0,
  margin_percentage numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT cdm_modules_pkey PRIMARY KEY (id)
);

-- ----------------------------------------
-- 2. cdm_institutes
-- ----------------------------------------
CREATE TABLE public.cdm_institutes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text,
  location text,
  logo_url text,
  website_url text,
  status text DEFAULT 'Active'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT cdm_institutes_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_institutes_code_key UNIQUE (code)
);

-- ----------------------------------------
-- 3. cdm_institute_pocs
-- ----------------------------------------
CREATE TABLE public.cdm_institute_pocs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institute_id uuid,
  full_name text NOT NULL,
  email text,
  phone text,
  designation text,
  is_primary_contact boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid,

  CONSTRAINT cdm_institute_pocs_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_institute_pocs_user_id_key UNIQUE (user_id),
  CONSTRAINT cdm_institute_pocs_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.cdm_institutes(id),
  CONSTRAINT cdm_institute_pocs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- ----------------------------------------
-- 4. cdm_batches
-- ----------------------------------------
CREATE TABLE public.cdm_batches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institute_id uuid,
  proposal_id uuid,
  name text NOT NULL,
  status text DEFAULT 'Tentative'::text,
  start_date date,
  end_date date,
  schedule_description text,
  mentor_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  department text,

  CONSTRAINT cdm_batches_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_batches_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.cdm_institutes(id),
  CONSTRAINT cdm_batches_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.mentors_new(id)
);

-- ----------------------------------------
-- 5. cdm_students
-- ----------------------------------------
CREATE TABLE public.cdm_students (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  batch_id uuid,
  email text,
  phone text,
  full_name text NOT NULL,
  gender text,
  enrollment_id text,

  CONSTRAINT cdm_students_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_students_enrollment_id_key UNIQUE (enrollment_id),
  CONSTRAINT cdm_students_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.cdm_batches(id)
);

-- ----------------------------------------
-- 6. cdm_products
-- ----------------------------------------
CREATE TABLE public.cdm_products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  module_id uuid,
  particulars text NOT NULL,
  product_code text NOT NULL,
  delivery_mode text,
  format text,
  total_hours numeric,
  max_students integer,
  num_sessions integer,
  ctc_per_session numeric,
  asking_price_per_session numeric,
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT cdm_products_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_products_product_code_key UNIQUE (product_code),
  CONSTRAINT cdm_products_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.cdm_modules(id)
);

-- ----------------------------------------
-- 7. cdm_proposals
-- ----------------------------------------
CREATE TABLE public.cdm_proposals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  proposal_ref_id text,
  institute_id uuid NOT NULL,
  batch_id uuid NOT NULL,
  status text DEFAULT 'Draft'::text,
  discount_percentage numeric DEFAULT 0,
  gst_percentage numeric DEFAULT 18.00,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT cdm_proposals_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_proposals_proposal_ref_id_key UNIQUE (proposal_ref_id),
  CONSTRAINT cdm_proposals_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.cdm_institutes(id),
  CONSTRAINT cdm_proposals_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.cdm_batches(id),
  CONSTRAINT cdm_proposals_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.tcc_admins(id)
);

-- ----------------------------------------
-- 8. cdm_proposal_items
-- ----------------------------------------
CREATE TABLE public.cdm_proposal_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  proposal_id uuid,
  product_id uuid,
  sequence_order integer NOT NULL DEFAULT 1,
  tentative_start_date date,
  tentative_end_date date,
  student_count integer NOT NULL,
  quoted_price_per_session numeric,
  snapshot_particulars text,
  snapshot_product_code text,
  snapshot_delivery_mode text,
  snapshot_max_students integer,
  snapshot_ctc_per_session numeric,
  num_sessions integer,
  total_ctc numeric,
  total_asking_price numeric,
  created_at timestamp with time zone DEFAULT now(),
  snapshot_format text,
  snapshot_total_hours numeric,

  CONSTRAINT cdm_proposal_items_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_proposal_items_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.cdm_proposals(id),
  CONSTRAINT cdm_proposal_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.cdm_products(id)
);

-- ----------------------------------------
-- 9. cdm_learning_journeys
-- ----------------------------------------
CREATE TABLE public.cdm_learning_journeys (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  proposal_id uuid,
  institute_id uuid,
  batch_id uuid,
  status text DEFAULT 'Active'::text,
  created_at timestamp with time zone DEFAULT now(),

  CONSTRAINT cdm_learning_journeys_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_learning_journeys_proposal_id_fkey FOREIGN KEY (proposal_id) REFERENCES public.cdm_proposals(id),
  CONSTRAINT cdm_learning_journeys_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.cdm_institutes(id),
  CONSTRAINT cdm_learning_journeys_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.cdm_batches(id)
);

-- ----------------------------------------
-- 10. cdm_learning_journey_items
-- ----------------------------------------
CREATE TABLE public.cdm_learning_journey_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  learning_journey_id uuid,
  product_id uuid,
  particulars text,
  product_code text,
  delivery_mode text,
  format text,
  total_hours numeric,
  student_count integer,
  num_sessions integer,
  start_date date,
  end_date date,
  status text DEFAULT 'Yet to Schedule'::text,
  average_rating numeric DEFAULT 0.00,
  sequence_order integer DEFAULT 1,

  CONSTRAINT cdm_learning_journey_items_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_learning_journey_items_learning_journey_id_fkey FOREIGN KEY (learning_journey_id) REFERENCES public.cdm_learning_journeys(id),
  CONSTRAINT cdm_learning_journey_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.cdm_products(id)
);

-- ----------------------------------------
-- 11. mentors_new
-- ----------------------------------------
create table public.mentors_new (
  id uuid not null default auth.uid (),
  mentor_email text null,
  mentor_phone text null,
  mentor_profile_url text null,
  mentor_first_name text null,
  mentor_last_name text null,
  mentor_address text null,
  mentor_city text null,
  mentor_pincode text null,
  mentor_state text null,
  mentor_country text null,
  mentor_about text null,
  mentor_education json null,
  mentor_work_experience json null,
  mentor_resume_url text null,
  mentor_domain_expertise text[] null,
  mentor_technical_skills text[] null,
  mentor_soft_skills text[] null,
  mentor_certification json null,
  mentor_languages json null,
  mentor_who_do_you text[] null,
  mentor_prefer_mentoring text[] null,
  mentor_area_interest text[] null,
  mentor_weekly_time text null,
  mentor_earnings text null,
  mentor_linkedin_url text null,
  mentor_other_profile_url text null,
  mentor_account_holder_name text null,
  mentor_bank_name text null,
  mentor_average_rating text null,
  mentor_threshold_rating text null,
  mentor_account_no text null,
  mentor_ifsc_code text null,
  mentor_weekly_availability json null,
  mentor_access_token text null,
  mentor_referesh_token text null,
  is_delete boolean null default false,
  is_suspended boolean null,
  suspended_duration text null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  personal_draft boolean null default false,
  education_draft boolean null default false,
  skills_draft boolean null default false,
  service_payment_draft boolean null default false,
  username text null,
  experience_years text null,
  mentor_functional_domain_expertise text[] null,
  gd_session boolean null default false,
  mentor_pan_number text null,
  constraint mentors_new_pkey primary key (id),
  constraint mentors_new_mentor_email_key unique (mentor_email)
) TABLESPACE pg_default;

-- ----------------------------------------
-- 12. cdm_journey_sessions
-- ----------------------------------------
CREATE TABLE public.cdm_journey_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  journey_item_id uuid,
  mentor_id uuid,
  scheduled_date timestamp with time zone,
  meeting_link text,
  status text DEFAULT 'Pending'::text,
  recording_link text,
  session_type text DEFAULT '1:1'::text,
  journey_item_name text,

  CONSTRAINT cdm_journey_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_journey_sessions_journey_item_id_fkey FOREIGN KEY (journey_item_id) REFERENCES public.cdm_learning_journey_items(id),
  CONSTRAINT cdm_journey_sessions_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.mentors_new(id)
);

-- ----------------------------------------
-- 13. cdm_session_attendees
-- ----------------------------------------
CREATE TABLE public.cdm_session_attendees (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL,
  student_id uuid NOT NULL,
  attendance_status text DEFAULT 'Pending'::text,
  is_report_generated boolean DEFAULT false,
  feedback_data jsonb DEFAULT '{}'::jsonb,
  student_name text,
  batch_name text,
  session_name text,
  journey_item_id uuid,

  CONSTRAINT cdm_session_attendees_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_attendees_unique UNIQUE (session_id, student_id),
  CONSTRAINT cdm_attendees_session_fkey FOREIGN KEY (session_id) REFERENCES public.cdm_journey_sessions(id),
  CONSTRAINT cdm_attendees_student_fkey FOREIGN KEY (student_id) REFERENCES public.cdm_students(id),
  CONSTRAINT cdm_attendees_lji_fkey FOREIGN KEY (journey_item_id) REFERENCES public.cdm_learning_journey_items(id)
);

-- ----------------------------------------
-- 14. cdm_student_reports
-- ----------------------------------------
CREATE TABLE public.cdm_student_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id uuid,
  report_type text NOT NULL,
  report_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  student_name text,
  batch_name text,
  attendee_id uuid NOT NULL,
  journey_item_id uuid,

  CONSTRAINT cdm_student_reports_pkey PRIMARY KEY (id),
  CONSTRAINT cdm_student_reports_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.cdm_journey_sessions(id),
  CONSTRAINT cdm_reports_attendee_fkey FOREIGN KEY (attendee_id) REFERENCES public.cdm_session_attendees(id),
  CONSTRAINT cdm_reports_lji_fkey FOREIGN KEY (journey_item_id) REFERENCES public.cdm_learning_journey_items(id)
);

-- ----------------------------------------
-- 15. cdm_product_analytics (VIEW)
-- ----------------------------------------
-- Note: This is a database view, not a table.
-- Columns listed for reference:
--   id uuid
--   product_code text
--   particulars text
--   total_ctc numeric
--   total_asking_price numeric
--   asking_price_per_student numeric
--   margin_value numeric
--   margin_percentage numeric

-- ----------------------------------------
-- 16. cdm_proposal_analytics (VIEW)
-- ----------------------------------------
-- Note: This is a database view, not a table.
-- Columns listed for reference:
--   proposal_id uuid
--   proposal_ref_id text
--   status text
--   discount_percentage numeric
--   gst_percentage numeric
--   subtotal_asking_price numeric
--   total_cost_company numeric
--   discount_amount numeric
--   net_total_before_tax numeric
--   gst_amount numeric
--   final_total_payable numeric
--   final_margin_value numeric
