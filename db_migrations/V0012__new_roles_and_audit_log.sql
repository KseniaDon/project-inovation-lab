-- Создаём таблицу журнала правок
CREATE TABLE IF NOT EXISTS t_p7851806_project_inovation_la.audit_log (
    id SERIAL PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Обновляем роли на новые названия
UPDATE t_p7851806_project_inovation_la.access_list SET role = 'super_admin' WHERE nickname = 'soul__shu';
UPDATE t_p7851806_project_inovation_la.access_list SET role = 'head_admin'  WHERE nickname = 'kurrochkaa';
UPDATE t_p7851806_project_inovation_la.access_list SET role = 'editor'      WHERE nickname = 'cccuvigon';
UPDATE t_p7851806_project_inovation_la.access_list SET role = 'editor'      WHERE nickname = 'andrei_schmidt';
