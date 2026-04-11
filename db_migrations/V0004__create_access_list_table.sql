
CREATE TABLE IF NOT EXISTS t_p7851806_project_inovation_la.access_list (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'editor',
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100)
);

INSERT INTO t_p7851806_project_inovation_la.access_list (nickname, role, password_hash)
VALUES (
  'soul__shu',
  'super_admin',
  '5e7e8c7b6e8a4f2d1c9b0a3e6f7d8c9b2a1e4f5d6c7b8a9e0f1d2c3b4a5e6f7'
)
ON CONFLICT (nickname) DO NOTHING;

INSERT INTO t_p7851806_project_inovation_la.access_list (nickname, role)
VALUES ('cccuvigon', 'editor')
ON CONFLICT (nickname) DO NOTHING;
