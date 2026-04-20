ALTER TABLE t_p7851806_project_inovation_la.tkm_submissions 
ADD COLUMN IF NOT EXISTS manual_scores jsonb NOT NULL DEFAULT '{}'::jsonb;