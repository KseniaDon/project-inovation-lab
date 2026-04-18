CREATE TABLE IF NOT EXISTS t_p7851806_project_inovation_la.tkm_submissions (
  id SERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  vk_link TEXT NOT NULL,
  department TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER DEFAULT NULL,
  max_score INTEGER DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewer TEXT DEFAULT NULL,
  reviewer_comment TEXT DEFAULT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ DEFAULT NULL
);