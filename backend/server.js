// Aqui eu importo o Express, que é o framework que uso pra criar o servidor e as rotas da API
const express = require('express');
// Importo o CORS pra permitir que o front-end (React) se comunique com esse backend sem bloqueio
const cors = require('cors');
// Importo o better-sqlite3, que é o banco de dados local que uso pra guardar tudo (usuários, avaliações)
const Database = require('better-sqlite3');
// Importo o bcrypt pra criptografar as senhas dos usuários antes de salvar no banco
const bcrypt = require('bcrypt');
// Importo o jsonwebtoken pra gerar tokens JWT que controlam as sessões de login
const jwt = require('jsonwebtoken');

// Crio a instância do servidor Express
const app = express();
// Abro (ou crio) o banco de dados SQLite num arquivo chamado database.db
const db = new Database('database.db');

// Essa é a chave secreta que uso pra assinar os tokens JWT — em produção eu colocaria numa variável de ambiente
const JWT_SECRET = 'taylor_eras_secret_key_1989';

// Ativo o CORS pra liberar requisições vindas do React (que roda em outra porta)
app.use(cors());
// Ativo o parser de JSON pra conseguir ler o corpo das requisições POST/PUT
app.use(express.json());

// ========================
// INICIALIZAÇÃO DO BANCO DE DADOS
// ========================

// Ativo suporte a chaves estrangeiras no SQLite (ele não vem ativado por padrão)
db.exec('PRAGMA foreign_keys = ON;');

// Crio a tabela de usuários se ela não existir ainda
// Cada usuário tem um id, um nome de usuário único e a senha criptografada
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

// Agora crio a tabela de avaliações com todas as colunas necessárias
// O campo 'tipo' diferencia se é avaliação de álbum ou de música individual
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS avaliacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      era TEXT NOT NULL,
      nota INTEGER NOT NULL,
      tipo TEXT NOT NULL DEFAULT 'album',
      musica TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  // Migração: se a tabela já existia sem a coluna 'tipo', eu adiciono ela aqui
  try {
    db.exec(`ALTER TABLE avaliacoes ADD COLUMN tipo TEXT NOT NULL DEFAULT 'album'`);
    console.log('Coluna "tipo" adicionada com sucesso.');

    // Corrijo os registros antigos de música: onde o campo musica é diferente do nome da era
    // Esses registros eram avaliações de músicas individuais, não de álbum
    const musicasCorrigidas = db.prepare(
      `UPDATE avaliacoes SET tipo = 'musica' WHERE musica IS NOT NULL AND musica != era`
    ).run();
    console.log(`Migração: ${musicasCorrigidas.changes} avaliações de músicas corrigidas (tipo -> 'musica').`);
  } catch (e) {
    // Se a coluna já existe, ignoro o erro e sigo normalmente
  }

  // Migração: pego os registros antigos que tinham o campo musica como NULL
  // e preencho com o nome da era, marcando como tipo 'album'
  const registrosNulos = db.prepare(`SELECT id, era FROM avaliacoes WHERE musica IS NULL`).all();
  if (registrosNulos.length > 0) {
    const updateStmt = db.prepare(`UPDATE avaliacoes SET musica = ?, tipo = 'album' WHERE id = ?`);
    for (const reg of registrosNulos) {
      updateStmt.run(reg.era, reg.id);
    }
    console.log(`Migração: ${registrosNulos.length} registros antigos corrigidos (musica NULL -> nome da era).`);
  }

  // Correção extra de segurança: garanto que avaliações com nome de música diferente da era
  // estejam marcadas como tipo 'musica' (cobre dados que já existiam antes da migração)
  const correcaoMusicas = db.prepare(
    `UPDATE avaliacoes SET tipo = 'musica' WHERE tipo = 'album' AND musica IS NOT NULL AND musica != era`
  ).run();
  if (correcaoMusicas.changes > 0) {
    console.log(`Correção: ${correcaoMusicas.changes} avaliações de músicas corrigidas (tipo 'album' -> 'musica').`);
  }

} catch (e) {
  console.log("Aviso ao criar tabela avaliacoes:", e.message);
}

// ========================
// TABELA DE SUGESTÕES DE NOTÍCIAS
// ========================
// Sugestões enviadas por usuários autenticados — passam por moderação antes de ficarem públicas
db.exec(`
  CREATE TABLE IF NOT EXISTS sugestoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    categoria TEXT,
    autor_id INTEGER,
    status TEXT DEFAULT 'pendente',
    motivo_rejeicao TEXT NULL,
    data_envio TEXT,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
  )
`);
console.log('Tabela "sugestoes" pronta.');

// ========================
// TABELA UNIFICADA DE COMENTÁRIOS
// ========================
// Todos os comentários (comunidade + PHP) ficam na mesma tabela
// O campo 'tipo' diferencia: 'comunidade' ou 'php'
// O campo 'noticia_titulo' armazena o título da notícia pra exibição nos painéis
db.exec(`
  CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    noticia_id INTEGER,
    usuario_id INTEGER,
    texto TEXT NOT NULL,
    status TEXT DEFAULT 'ativo',
    motivo_remocao TEXT NULL,
    data_comentario TEXT,
    tipo TEXT DEFAULT 'comunidade',
    noticia_titulo TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  )
`);
// Adiciona colunas novas caso a tabela já exista sem elas
try { db.exec("ALTER TABLE comentarios ADD COLUMN tipo TEXT DEFAULT 'comunidade'"); } catch (e) { }
try { db.exec("ALTER TABLE comentarios ADD COLUMN noticia_titulo TEXT"); } catch (e) { }

// Migra dados antigos de comentarios_php para comentarios (se existir)
try {
  const phpRows = db.prepare('SELECT * FROM comentarios_php').all();
  if (phpRows.length > 0) {
    const insert = db.prepare('INSERT INTO comentarios (noticia_id, usuario_id, texto, status, motivo_remocao, data_comentario, tipo, noticia_titulo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const r of phpRows) {
      insert.run(r.noticia_php_id, r.usuario_id, r.texto, r.status, r.motivo_remocao, r.data_comentario, 'php', r.noticia_titulo);
    }
    console.log(`Migrados ${phpRows.length} comentários PHP para tabela unificada.`);
  }
  db.exec('DROP TABLE IF EXISTS comentarios_php');
  db.exec('DROP TABLE IF EXISTS comentarios_oficiais');
} catch (e) { }

console.log('Tabela "comentarios" (unificada) pronta.');

// ========================
// MIDDLEWARE DE AUTENTICAÇÃO
// ========================

// Essa função verifica se o usuário está logado antes de acessar rotas protegidas
// Ela extrai o token JWT do header da requisição e valida
function authenticateToken(req, res, next) {
  // Pego o header Authorization da requisição
  const authHeader = req.headers['authorization'];
  // Extraio só o token (formato: "Bearer TOKEN_AQUI")
  const token = authHeader && authHeader.split(' ')[1];

  // Se não tem token, bloqueia o acesso
  if (token == null) return res.status(401).json({ error: 'Acesso negado. Faça login.' });

  // Verifico se o token é válido usando a chave secreta
  jwt.verify(token, JWT_SECRET, (err, user) => {
    // Se o token é inválido ou expirou, retorno erro 403
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
    // Se tudo certo, salvo os dados do usuário (id, username) na requisição pra usar nas rotas
    req.user = user;
    next();
  });
}

// Middleware que verifica se o usuário logado é o admin
// Reutiliza o padrão já existente (username === 'admin') da rota DELETE /avaliacoes
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acesso negado.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido.' });
    if (user.username !== 'admin') return res.status(403).json({ error: 'Acesso restrito a administradores.' });
    req.user = user;
    next();
  });
}

// ========================
// ROTAS DE AUTENTICAÇÃO
// ========================

// Rota pra criar uma conta nova (POST /register)
app.post('/register', async (req, res) => {
  // Pego o nome de usuário e senha que o front-end mandou
  const { username, password } = req.body;

  // Valido se os campos foram preenchidos
  if (!username || !password) {
    return res.status(400).json({ error: 'Preencha usuário e senha.' });
  }

  try {
    // Verifico se já existe um usuário com esse nome
    const userExists = db.prepare('SELECT id FROM usuarios WHERE username = ?').get(username);
    if (userExists) {
      return res.status(400).json({ error: 'Nome de usuário já existe.' });
    }

    // Criptografo a senha com bcrypt (10 rounds de salt)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Salvo o novo usuário no banco de dados
    const stmt = db.prepare('INSERT INTO usuarios (username, password_hash) VALUES (?, ?)');
    const result = stmt.run(username, passwordHash);

    // Retorno sucesso com o ID do novo usuário
    res.status(201).json({ message: 'Conta criada com sucesso!', userId: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
});

// Rota pra fazer login (POST /login)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busco o usuário no banco pelo nome
    const user = db.prepare('SELECT * FROM usuarios WHERE username = ?').get(username);

    // Se não encontrou, retorno erro
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    // Comparo a senha digitada com a hash que tá salva no banco usando bcrypt
    const match = await bcrypt.compare(password, user.password_hash);

    // Se a senha não bate, retorno erro
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Se tudo certo, gero um token JWT válido por 24 horas
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    // Retorno o token e o nome do usuário pro front-end salvar
    res.json({ message: 'Login realizado com sucesso', token, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// ========================
// ROTAS DE AVALIAÇÃO
// ========================

// Rota pra listar TODAS as avaliações (usada pelo painel admin e pra mostrar avaliações públicas)
app.get('/avaliacoes', (req, res) => {
  try {
    // Faço um JOIN com a tabela de usuários pra trazer o nome de quem avaliou
    const rows = db.prepare(`
      SELECT avaliacoes.*, usuarios.username 
      FROM avaliacoes 
      LEFT JOIN usuarios ON avaliacoes.usuario_id = usuarios.id
    `).all();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
});

// Rota pra listar só as avaliações do usuário que tá logado (usada no painel do usuário)
app.get('/minhas-avaliacoes', authenticateToken, (req, res) => {
  try {
    // Filtro as avaliações pelo ID do usuário que veio do token JWT
    const rows = db.prepare('SELECT * FROM avaliacoes WHERE usuario_id = ?').all(req.user.id);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar suas avaliações' });
  }
});

// Rota pra criar ou atualizar uma avaliação (exige login)
app.post('/avaliar', authenticateToken, (req, res) => {
  // Pego os dados da avaliação que o front-end mandou
  const { era, nota, tipo, musica } = req.body;
  // O ID do usuário vem automaticamente do token JWT
  const usuario_id = req.user.id;

  // Defino o tipo final: 'album' ou 'musica'
  const tipoFinal = tipo === 'musica' ? 'musica' : 'album';
  // Se for avaliação de álbum, salvo o nome da era no campo musica (pra nunca ficar NULL)
  const nomeFinal = tipoFinal === 'album' ? era : (musica || era);

  try {
    // Primeiro verifico se esse usuário já avaliou essa combinação de era + tipo + música
    const avaliacaoExistente = db.prepare(
      'SELECT id FROM avaliacoes WHERE usuario_id = ? AND era = ? AND tipo = ? AND musica = ?'
    ).get(usuario_id, era, tipoFinal, nomeFinal);

    if (avaliacaoExistente) {
      // Se já existe, só atualizo a nota (UPDATE)
      const stmt = db.prepare('UPDATE avaliacoes SET nota = ? WHERE id = ?');
      stmt.run(nota, avaliacaoExistente.id);
      res.status(200).json({ id: avaliacaoExistente.id, action: 'updated' });
    } else {
      // Se não existe, crio uma avaliação nova (INSERT)
      const stmt = db.prepare('INSERT INTO avaliacoes (usuario_id, era, nota, tipo, musica) VALUES (?, ?, ?, ?, ?)');
      const result = stmt.run(usuario_id, era, nota, tipoFinal, nomeFinal);
      res.status(201).json({ id: result.lastInsertRowid, action: 'created' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar avaliação' });
  }
});

// Rota pra editar uma avaliação específica pelo ID (exige login + ser o dono)
app.put('/avaliacoes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { nota } = req.body;
  const usuario_id = req.user.id;

  try {
    // Verifico se a avaliação existe e se pertence ao usuário logado
    const avaliacao = db.prepare('SELECT usuario_id FROM avaliacoes WHERE id = ?').get(id);

    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    // Só o dono pode editar a própria avaliação
    if (avaliacao.usuario_id !== usuario_id) {
      return res.status(403).json({ error: 'Você só pode editar suas próprias avaliações.' });
    }

    // Atualizo a nota no banco
    const stmt = db.prepare('UPDATE avaliacoes SET nota = ? WHERE id = ?');
    const result = stmt.run(nota, id);
    res.json({ message: 'Avaliação atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao editar avaliação' });
  }
});

// Rota pra excluir uma avaliação (exige login + ser o dono ou admin)
app.delete('/avaliacoes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;

  try {
    // Verifico se a avaliação existe
    const avaliacao = db.prepare('SELECT usuario_id FROM avaliacoes WHERE id = ?').get(id);

    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    // Só o dono pode apagar, ou o usuário 'admin' (que tem poderes especiais)
    if (avaliacao.usuario_id !== usuario_id && req.user.username !== 'admin') {
      return res.status(403).json({ error: 'Você só pode deletar suas próprias avaliações.' });
    }

    // Deleto a avaliação do banco
    const stmt = db.prepare('DELETE FROM avaliacoes WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar avaliação' });
  }
});

// ========================
// ROTAS DE CONFIGURAÇÃO DO USUÁRIO
// ========================

// Rota pra alterar a senha do usuário logado
app.put('/usuarios/senha', authenticateToken, async (req, res) => {
  const { novaSenha } = req.body;
  const usuario_id = req.user.id;

  // Valido que a nova senha tem pelo menos 3 caracteres
  if (!novaSenha || novaSenha.length < 3) {
    return res.status(400).json({ error: 'A nova senha deve ter pelo menos 3 caracteres.' });
  }

  try {
    // Criptografo a nova senha com bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(novaSenha, saltRounds);

    // Atualizo a senha no banco de dados
    const stmt = db.prepare('UPDATE usuarios SET password_hash = ? WHERE id = ?');
    stmt.run(passwordHash, usuario_id);
    res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar senha.' });
  }
});

// Rota pra excluir a conta do usuário logado (ação permanente!)
app.delete('/usuarios', authenticateToken, (req, res) => {
  const usuario_id = req.user.id;

  try {
    // Deleto comentários, sugestões e avaliações antes de deletar o usuário
    db.prepare('DELETE FROM comentarios WHERE usuario_id = ?').run(usuario_id);
    db.prepare('DELETE FROM sugestoes WHERE autor_id = ?').run(usuario_id);
    db.prepare('DELETE FROM avaliacoes WHERE usuario_id = ?').run(usuario_id);

    db.prepare('DELETE FROM usuarios WHERE id = ?').run(usuario_id);

    res.json({ message: 'Sua conta e todos os seus dados foram excluídos permanentemente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar conta.' });
  }
});

// ========================
// ROTAS DE SUGESTÕES DE NOTÍCIAS
// ========================

// Enviar uma sugestão de notícia (exige login)
app.post('/sugestoes', authenticateToken, (req, res) => {
  const { titulo, conteudo, categoria } = req.body;
  const autor_id = req.user.id;

  if (!titulo || !conteudo) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
  }

  try {
    const data_envio = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO sugestoes (titulo, conteudo, categoria, autor_id, status, data_envio) VALUES (?, ?, ?, ?, ?, ?)');
    const result = stmt.run(titulo, conteudo, categoria || 'Outro', autor_id, 'pendente', data_envio);
    res.status(201).json({ message: 'Sugestão enviada com sucesso! Aguarde a moderação.', id: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao enviar sugestão.' });
  }
});

// Retornar SOMENTE sugestões aprovadas (rota pública)
app.get('/noticias', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT sugestoes.*, usuarios.username as autor
      FROM sugestoes
      LEFT JOIN usuarios ON sugestoes.autor_id = usuarios.id
      WHERE sugestoes.status = 'aprovado'
      ORDER BY sugestoes.data_envio DESC
    `).all();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar notícias.' });
  }
});

// Sugestões do usuário logado
app.get('/minhas-sugestoes', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM sugestoes WHERE autor_id = ? ORDER BY data_envio DESC').all(req.user.id);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar suas sugestões.' });
  }
});

// Editar sugestão do usuário logado (volta pra pendente)
app.put('/sugestoes/:id', authenticateToken, (req, res) => {
  const { titulo, conteudo, categoria } = req.body;
  if (!titulo || !conteudo) return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
  try {
    const result = db.prepare('UPDATE sugestoes SET titulo = ?, conteudo = ?, categoria = ?, status = ?, motivo_rejeicao = NULL WHERE id = ? AND autor_id = ?')
      .run(titulo, conteudo, categoria || 'Outro', 'pendente', req.params.id, req.user.id);
    if (result.changes === 0) return res.status(403).json({ error: 'Sugestão não encontrada ou você não tem permissão.' });
    res.json({ message: 'Sugestão atualizada e enviada para moderação.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao editar sugestão.' });
  }
});

// Solicitar exclusão de sugestão aprovada
app.put('/sugestoes/:id/solicitar-exclusao', authenticateToken, (req, res) => {
  try {
    const result = db.prepare("UPDATE sugestoes SET status = 'exclusao_pendente' WHERE id = ? AND autor_id = ? AND status = 'aprovado'")
      .run(req.params.id, req.user.id);
    if (result.changes === 0) return res.status(403).json({ error: 'Apenas sugestões aprovadas podem ter a exclusão solicitada.' });
    res.json({ message: 'Solicitação de exclusão enviada à moderação.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao solicitar exclusão.' });
  }
});

// ========================
// ROTAS ADMIN DE SUGESTÕES
// ========================

// Listar todas as sugestões (admin)
app.get('/admin/sugestoes', authenticateAdmin, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT sugestoes.*, usuarios.username as autor
      FROM sugestoes
      LEFT JOIN usuarios ON sugestoes.autor_id = usuarios.id
      ORDER BY sugestoes.data_envio DESC
    `).all();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar sugestões.' });
  }
});

// Aprovar sugestão (admin)
app.put('/admin/sugestoes/:id/aprovar', authenticateAdmin, (req, res) => {
  try {
    const stmt = db.prepare('UPDATE sugestoes SET status = ? WHERE id = ?');
    stmt.run('aprovado', req.params.id);
    res.json({ message: 'Sugestão aprovada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao aprovar sugestão.' });
  }
});

// Rejeitar sugestão com motivo (admin)
app.put('/admin/sugestoes/:id/rejeitar', authenticateAdmin, (req, res) => {
  const { motivo } = req.body;
  if (!motivo) return res.status(400).json({ error: 'Motivo da rejeição é obrigatório.' });
  try {
    const stmt = db.prepare('UPDATE sugestoes SET status = ?, motivo_rejeicao = ? WHERE id = ?');
    stmt.run('rejeitado', motivo, req.params.id);
    res.json({ message: 'Sugestão rejeitada.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao rejeitar sugestão.' });
  }
});

// Excluir sugestão permanentemente (admin)
app.delete('/admin/sugestoes/:id', authenticateAdmin, (req, res) => {
  try {
    // Deleto comentários associados primeiro
    db.prepare('DELETE FROM comentarios WHERE noticia_id = ?').run(req.params.id);
    db.prepare('DELETE FROM sugestoes WHERE id = ?').run(req.params.id);
    res.json({ message: 'Sugestão excluída permanentemente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir sugestão.' });
  }
});

// Rejeitar solicitação de exclusão (admin) - volta para aprovado
app.put('/admin/sugestoes/:id/rejeitar-exclusao', authenticateAdmin, (req, res) => {
  try {
    const stmt = db.prepare("UPDATE sugestoes SET status = 'aprovado' WHERE id = ? AND status = 'exclusao_pendente'");
    const result = stmt.run(req.params.id);
    if (result.changes === 0) return res.status(400).json({ error: 'Nenhuma solicitação de exclusão pendente.' });
    res.json({ message: 'Solicitação de exclusão rejeitada, postagem mantida.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao rejeitar exclusão.' });
  }
});

// ========================
// ROTAS DE COMENTÁRIOS (tabela unificada)
// ========================

// Enviar comentário (exige login) — funciona para comunidade e PHP
app.post('/comentarios', authenticateToken, (req, res) => {
  const { noticia_id, texto, tipo, noticia_titulo } = req.body;
  const usuario_id = req.user.id;

  if (!texto || !texto.trim()) {
    return res.status(400).json({ error: 'Texto do comentário é obrigatório.' });
  }

  try {
    // Se for comentário de comunidade, verifico se a notícia está aprovada
    if (tipo === 'comunidade') {
      const noticia = db.prepare('SELECT id, titulo FROM sugestoes WHERE id = ? AND status = ?').get(noticia_id, 'aprovado');
      if (!noticia) return res.status(404).json({ error: 'Notícia não encontrada ou não aprovada.' });
      const data_comentario = new Date().toISOString();
      const stmt = db.prepare('INSERT INTO comentarios (noticia_id, usuario_id, texto, status, data_comentario, tipo, noticia_titulo) VALUES (?, ?, ?, ?, ?, ?, ?)');
      const result = stmt.run(noticia_id, usuario_id, texto.trim(), 'ativo', data_comentario, 'comunidade', noticia.titulo);
      return res.status(201).json({ message: 'Comentário enviado!', id: result.lastInsertRowid });
    }

    // Se for comentário PHP, salvo direto com o título
    const data_comentario = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO comentarios (noticia_id, usuario_id, texto, status, data_comentario, tipo, noticia_titulo) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(noticia_id, usuario_id, texto.trim(), 'ativo', data_comentario, 'php', noticia_titulo || '');
    res.status(201).json({ message: 'Comentário enviado!', id: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao enviar comentário.' });
  }
});

// Listar comentários ativos de uma notícia (público) — usa query ?tipo=php ou ?tipo=comunidade
app.get('/comentarios/:noticiaId', (req, res) => {
  const tipo = req.query.tipo || 'comunidade';
  try {
    const rows = db.prepare(`
      SELECT comentarios.*, usuarios.username as autor
      FROM comentarios
      LEFT JOIN usuarios ON comentarios.usuario_id = usuarios.id
      WHERE comentarios.noticia_id = ? AND comentarios.tipo = ? AND comentarios.status = 'ativo'
      ORDER BY comentarios.data_comentario ASC
    `).all(req.params.noticiaId, tipo);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar comentários.' });
  }
});

// Deletar próprio comentário (exige login + ser o dono ou admin)
app.delete('/comentarios/:id', authenticateToken, (req, res) => {
  try {
    const comentario = db.prepare('SELECT usuario_id FROM comentarios WHERE id = ?').get(req.params.id);
    if (!comentario) return res.status(404).json({ error: 'Comentário não encontrado.' });
    if (comentario.usuario_id !== req.user.id && req.user.username !== 'admin') return res.status(403).json({ error: 'Você só pode excluir seus próprios comentários.' });
    db.prepare('DELETE FROM comentarios WHERE id = ?').run(req.params.id);
    res.json({ message: 'Comentário excluído.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir comentário.' });
  }
});

// Meus comentários — retorna TODOS (comunidade + PHP) do usuário logado
app.get('/meus-comentarios', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT comentarios.*, usuarios.username as autor,
        CASE
          WHEN comentarios.tipo = 'comunidade' THEN COALESCE(sugestoes.titulo, comentarios.noticia_titulo)
          ELSE comentarios.noticia_titulo
        END as noticia_titulo_final
      FROM comentarios
      LEFT JOIN usuarios ON comentarios.usuario_id = usuarios.id
      LEFT JOIN sugestoes ON comentarios.noticia_id = sugestoes.id AND comentarios.tipo = 'comunidade'
      WHERE comentarios.usuario_id = ?
      ORDER BY comentarios.data_comentario DESC
    `).all(req.user.id);
    // Renomeia pra manter compatibilidade
    const result = rows.map(r => ({ ...r, noticia_titulo: r.noticia_titulo_final }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar seus comentários.' });
  }
});

// ========================
// ROTAS ADMIN DE COMENTÁRIOS
// ========================

// Listar todos os comentários (admin) — tabela unificada
app.get('/admin/comentarios', authenticateAdmin, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT comentarios.*, usuarios.username as autor,
        CASE
          WHEN comentarios.tipo = 'comunidade' THEN COALESCE(sugestoes.titulo, comentarios.noticia_titulo)
          ELSE comentarios.noticia_titulo
        END as noticia_titulo_final
      FROM comentarios
      LEFT JOIN usuarios ON comentarios.usuario_id = usuarios.id
      LEFT JOIN sugestoes ON comentarios.noticia_id = sugestoes.id AND comentarios.tipo = 'comunidade'
      ORDER BY comentarios.data_comentario DESC
    `).all();
    const result = rows.map(r => ({ ...r, noticia_titulo: r.noticia_titulo_final }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar comentários.' });
  }
});

// Remover comentário com motivo (admin — soft delete)
app.put('/admin/comentarios/:id/remover', authenticateAdmin, (req, res) => {
  const { motivo_remocao } = req.body;
  if (!motivo_remocao) return res.status(400).json({ error: 'Motivo da remoção é obrigatório.' });
  try {
    db.prepare('UPDATE comentarios SET status = ?, motivo_remocao = ? WHERE id = ?').run('removido', motivo_remocao, req.params.id);
    res.json({ message: 'Comentário removido.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover comentário.' });
  }
});

// Excluir comentário permanentemente (admin)
app.delete('/admin/comentarios/:id', authenticateAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM comentarios WHERE id = ?').run(req.params.id);
    res.json({ message: 'Comentário excluído permanentemente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir comentário.' });
  }
});


// Defino a porta 3001 e inicio o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend seguro rodando na porta ${PORT}`);
});

