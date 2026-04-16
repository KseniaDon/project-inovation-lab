INSERT INTO t_p7851806_project_inovation_la.access_list (nickname, role, created_by, href, hospital_role)
VALUES 
  ('cccuvigon',      'editor', 'soul__shu', 'https://vk.ru/cccuvigon',      'ЗЗОИ'),
  ('andrei_schmidt', 'editor', 'soul__shu', 'https://vk.com/andrei_schmidt', 'ЗЗОИ')
ON CONFLICT (nickname) DO UPDATE SET
  role = EXCLUDED.role,
  href = EXCLUDED.href,
  hospital_role = EXCLUDED.hospital_role;
