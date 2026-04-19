UPDATE t_p7851806_project_inovation_la.site_content
SET value = value::jsonb || '{"content_after_pme": "<ol start=\"4\"><li>Сдать клятву врача.</li></ol>"}'::jsonb
WHERE key = 'intern_exam';