-- Обновляем существующих пользователей на новые роли
UPDATE t_p7851806_project_inovation_la.access_list SET role = 'admin' WHERE nickname = 'soul__shu';
UPDATE t_p7851806_project_inovation_la.access_list SET role = 'deputy' WHERE nickname = 'cccuvigon';

-- Добавляем новых (если уже есть — обновляем роль)
INSERT INTO t_p7851806_project_inovation_la.access_list (nickname, role, created_by)
VALUES ('andrei_schmidt', 'deputy', 'soul__shu')
ON CONFLICT (nickname) DO UPDATE SET role = 'deputy';

INSERT INTO t_p7851806_project_inovation_la.access_list (nickname, role, created_by)
VALUES ('kurrochkaa', 'head_doctor', 'soul__shu')
ON CONFLICT (nickname) DO UPDATE SET role = 'head_doctor';
