create table public.cdm_institute_pocs (
  id uuid not null default gen_random_uuid (),
  institute_id uuid null,
  full_name text not null,
  email text null,
  phone text null,
  designation text null,
  is_primary_contact boolean null default false,
  created_at timestamp with time zone null default now(),
  user_id uuid null,
  constraint cdm_institute_pocs_pkey primary key (id),
  constraint cdm_institute_pocs_user_id_key unique (user_id),
  constraint cdm_institute_pocs_institute_id_fkey foreign KEY (institute_id) references cdm_institutes (id) on delete CASCADE,
  constraint cdm_institute_pocs_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete set null
) TABLESPACE pg_default;

create table public.cdm_institutes (
  id uuid not null default gen_random_uuid (),
  name text not null,
  code text null,
  location text null,
  logo_url text null,
  website_url text null,
  status text null default 'Active'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint cdm_institutes_pkey primary key (id),
  constraint cdm_institutes_code_key unique (code)
) TABLESPACE pg_default;

create table public.cdm_batches (
  id uuid not null default gen_random_uuid (),
  institute_id uuid null,
  proposal_id uuid null,
  name text not null,
  status text null default 'Tentative'::text,
  start_date date null,
  end_date date null,
  schedule_description text null,
  mentor_id uuid null,
  created_at timestamp with time zone null default now(),
  department text null,
  constraint cdm_batches_pkey primary key (id),
  constraint cdm_batches_institute_id_fkey foreign KEY (institute_id) references cdm_institutes (id),
  constraint cdm_batches_mentor_id_fkey foreign KEY (mentor_id) references mentors (id)
) TABLESPACE pg_default;

create table public.cdm_journey_item_mentors (
  id uuid not null default gen_random_uuid (),
  journey_item_id uuid null,
  mentor_id uuid null,
  constraint cdm_journey_item_mentors_pkey primary key (id),
  constraint cdm_journey_item_mentors_item_mentor_unique unique (journey_item_id, mentor_id),
  constraint cdm_journey_item_mentors_journey_item_id_fkey foreign KEY (journey_item_id) references cdm_learning_journey_items (id) on delete CASCADE,
  constraint cdm_journey_item_mentors_mentor_id_fkey foreign KEY (mentor_id) references mentors (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.cdm_journey_sessions (
  id uuid not null default gen_random_uuid (),
  journey_item_id uuid null,
  student_id uuid not null,
  mentor_id uuid null,
  scheduled_date timestamp with time zone null,
  meeting_link text null,
  status text null default 'Pending'::text,
  student_feedback_rating integer null,
  student_feedback_comment text null,
  is_report_generated boolean null default false,
  recording_link text null,
  constraint cdm_journey_sessions_pkey primary key (id),
  constraint cdm_journey_sessions_journey_item_id_fkey foreign KEY (journey_item_id) references cdm_learning_journey_items (id),
  constraint cdm_journey_sessions_mentor_id_fkey foreign KEY (mentor_id) references mentors (id),
  constraint cdm_journey_sessions_student_id_fkey foreign KEY (student_id) references cdm_students (id)
) TABLESPACE pg_default;

create table public.cdm_learning_journey_items (
  id uuid not null default gen_random_uuid (),
  learning_journey_id uuid null,
  product_id uuid null,
  particulars text null,
  product_code text null,
  delivery_mode text null,
  format text null,
  total_hours numeric(5, 1) null,
  student_count integer null,
  num_sessions integer null,
  start_date date null,
  end_date date null,
  status text null default 'Yet to Schedule'::text,
  average_rating numeric(3, 2) null default 0.00,
  sequence_order integer null default 1,
  constraint cdm_learning_journey_items_pkey primary key (id),
  constraint cdm_learning_journey_items_learning_journey_id_fkey foreign KEY (learning_journey_id) references cdm_learning_journeys (id),
  constraint cdm_learning_journey_items_product_id_fkey foreign KEY (product_id) references cdm_products (id)
) TABLESPACE pg_default;

create table public.cdm_learning_journeys (
  id uuid not null default gen_random_uuid (),
  proposal_id uuid null,
  institute_id uuid null,
  batch_id uuid null,
  status text null default 'Active'::text,
  created_at timestamp with time zone null default now(),
  constraint cdm_learning_journeys_pkey primary key (id),
  constraint cdm_learning_journeys_batch_id_fkey foreign KEY (batch_id) references cdm_batches (id),
  constraint cdm_learning_journeys_institute_id_fkey foreign KEY (institute_id) references cdm_institutes (id),
  constraint cdm_learning_journeys_proposal_id_fkey foreign KEY (proposal_id) references cdm_proposals (id)
) TABLESPACE pg_default;

create table public.cdm_modules (
  id uuid not null default gen_random_uuid (),
  title text not null,
  category text not null,
  category_code text null,
  description text null,
  mode text not null,
  delivery_type text not null,
  indicative_timeline text null,
  total_hours_per_student numeric(5, 2) null,
  session_count integer null default 1,
  num_students integer null default 1,
  price_per_session_ctu numeric(12, 2) null default 0,
  ctc numeric(12, 2) not null default 0,
  ctu numeric(12, 2) null default 0,
  price_per_student numeric(12, 2) null default 0,
  ctc_per_session numeric(12, 2) null default 0,
  margin numeric(12, 2) null default 0,
  margin_percentage numeric(5, 2) null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint modules_pkey primary key (id),
  constraint check_category check (
    (
      category = any (
        array[
          'Clarity'::text,
          'Prep'::text,
          'Last-mile Prep'::text
        ]
      )
    )
  ),
  constraint check_category_code check (
    (
      category_code = any (
        array[
          'ORN'::text,
          'ASM'::text,
          'WKS'::text,
          'MCL'::text,
          'PRP'::text,
          'APT'::text,
          'BCP'::text,
          'LMH'::text,
          'SIEP'::text,
          'PMF'::text,
          'LMS'::text
        ]
      )
    )
  ),
  constraint check_delivery check (
    (
      delivery_type = any (
        array[
          'Offline'::text,
          'Online'::text,
          'Platform'::text,
          'Offline/Online'::text
        ]
      )
    )
  ),
  constraint check_mode check (
    (
      mode = any (
        array[
          '1:1'::text,
          '1:M'::text,
          '1:8'::text,
          '1:10'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;


create table public.cdm_products (
  id uuid not null default gen_random_uuid (),
  module_id uuid null,
  particulars text not null,
  product_code text not null,
  delivery_mode text null,
  format text null,
  total_hours numeric(5, 1) null,
  max_students integer null,
  num_sessions integer null,
  ctc_per_session numeric(12, 2) null,
  asking_price_per_session numeric(12, 2) null,
  created_at timestamp with time zone null default now(),
  constraint cdm_products_pkey primary key (id),
  constraint cdm_products_product_code_key unique (product_code)
) TABLESPACE pg_default;


create table public.cdm_proposal_items (
  id uuid not null default gen_random_uuid (),
  proposal_id uuid null,
  product_id uuid null,
  sequence_order integer not null default 1,
  tentative_start_date date null,
  tentative_end_date date null,
  student_count integer not null,
  quoted_price_per_session numeric(12, 2) null,
  snapshot_particulars text null,
  snapshot_product_code text null,
  snapshot_delivery_mode text null,
  snapshot_max_students integer null,
  snapshot_ctc_per_session numeric(12, 2) null,
  num_sessions integer null,
  total_ctc numeric(12, 2) null,
  total_asking_price numeric(12, 2) null,
  created_at timestamp with time zone null default now(),
  constraint cdm_proposal_items_pkey primary key (id),
  constraint cdm_proposal_items_product_id_fkey foreign KEY (product_id) references cdm_products (id),
  constraint cdm_proposal_items_proposal_id_fkey foreign KEY (proposal_id) references cdm_proposals (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger trigger_calc_proposal_totals BEFORE INSERT
or
update on cdm_proposal_items for EACH row
execute FUNCTION calculate_proposal_item_totals ();


create table public.cdm_proposals (
  id uuid not null default gen_random_uuid (),
  proposal_ref_id text null,
  institute_id uuid not null,
  batch_id uuid not null,
  status text null default 'Draft'::text,
  discount_percentage numeric(5, 2) null default 0,
  gst_percentage numeric(5, 2) null default 18.00,
  created_by uuid null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint cdm_proposals_pkey primary key (id),
  constraint cdm_proposals_proposal_ref_id_key unique (proposal_ref_id),
  constraint cdm_proposals_batch_id_fkey foreign KEY (batch_id) references cdm_batches (id),
  constraint cdm_proposals_created_by_fkey foreign KEY (created_by) references tcc_admins (id),
  constraint cdm_proposals_institute_id_fkey foreign KEY (institute_id) references cdm_institutes (id)
) TABLESPACE pg_default;

create trigger trigger_on_proposal_approval
after
update on cdm_proposals for EACH row
execute FUNCTION handle_proposal_approval ();


create table public.cdm_student_reports (
  id uuid not null default gen_random_uuid (),
  session_id uuid null,
  report_type text not null,
  report_data jsonb null,
  created_at timestamp with time zone null default now(),
  constraint cdm_student_reports_pkey primary key (id),
  constraint cdm_student_reports_session_id_fkey foreign KEY (session_id) references cdm_journey_sessions (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_cdm_student_reports_session_id on public.cdm_student_reports using btree (session_id) TABLESPACE pg_default;

create index IF not exists idx_reports_data_gin on public.cdm_student_reports using gin (report_data) TABLESPACE pg_default;

create index IF not exists idx_reports_score on public.cdm_student_reports using btree ((((report_data ->> 'score'::text))::numeric)) TABLESPACE pg_default;

create trigger trigger_update_session_report_status
after INSERT on cdm_student_reports for EACH row
execute FUNCTION handle_report_generation ();


create table public.cdm_students (
  id uuid not null default gen_random_uuid (),
  batch_id uuid null,
  email text null,
  phone text null,
  full_name text not null,
  gender text null,
  enrollment_id text null,
  constraint cdm_students_pkey primary key (id),
  constraint cdm_students_enrollment_id_key unique (enrollment_id),
  constraint cdm_students_batch_id_fkey foreign KEY (batch_id) references cdm_batches (id)
) TABLESPACE pg_default;