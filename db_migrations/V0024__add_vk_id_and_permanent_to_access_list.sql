ALTER TABLE t_p7851806_project_inovation_la.access_list
  ADD COLUMN IF NOT EXISTS vk_id BIGINT,
  ADD COLUMN IF NOT EXISTS is_permanent BOOLEAN NOT NULL DEFAULT FALSE;

-- Добавляем уникальный индекс по vk_id (только для ненулевых значений)
CREATE UNIQUE INDEX IF NOT EXISTS access_list_vk_id_unique
  ON t_p7851806_project_inovation_la.access_list (vk_id)
  WHERE vk_id IS NOT NULL;

-- Добавляем себя как постоянного super_admin
INSERT INTO t_p7851806_project_inovation_la.access_list (nickname, role, vk_id, is_permanent, created_by, href)
VALUES ('id132273284', 'super_admin', 132273284, TRUE, 'system', 'https://vk.com/id132273284')
ON CONFLICT (nickname) DO UPDATE
  SET role = 'super_admin',
      vk_id = 132273284,
      is_permanent = TRUE,
      href = 'https://vk.com/id132273284';
