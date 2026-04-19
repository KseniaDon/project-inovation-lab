INSERT INTO t_p7851806_project_inovation_la.tkm_scores (key, max_score) VALUES ('3.17', 4)
ON CONFLICT (key) DO UPDATE SET max_score = EXCLUDED.max_score;