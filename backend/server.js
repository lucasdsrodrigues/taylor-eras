const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const db = new Database('database.db');

// Chave secreta para assinar os tokens JWT (em produção, use variável de ambiente)
const JWT_SECRET = 'taylor_eras_secret_key_1989';

app.use(cors());
app.use(express.json());

// === INICIALIZAÇÃO DO BANCO DE DADOS ===
// Habilita suporte a chaves estrangeiras
db.exec('PRAGMA foreign_keys = ON;');

// Tabela de Usuários
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

// Tabela de Avaliações (agora com usuario_id)
// Observação: Como o SQLite é chato com ALTER TABLE, em um cenário real ou recriamos ou adicionamos a coluna.
// Como o usuário aprovou recriar, para garantir que as constraints funcionem, vamos tentar criar a nova.
// Se ela já existe do formato antigo, o ideal é dropar, mas vamos adicionar a coluna se não existir, ou melhor:
// Vamos apenas criar a nova tabela e tentar adicionar a coluna caso já exista.
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

  // Migração: adiciona coluna 'tipo' se a tabela já existia sem ela
  try {
    db.exec(`ALTER TABLE avaliacoes ADD COLUMN tipo TEXT NOT NULL DEFAULT 'album'`);
    console.log('Coluna "tipo" adicionada com sucesso.');

    // Corrige registros antigos de MÚSICA: onde musica não é NULL e é diferente do nome da era
    // (são avaliações de músicas, não de álbum)
    const musicasCorrigidas = db.prepare(
      `UPDATE avaliacoes SET tipo = 'musica' WHERE musica IS NOT NULL AND musica != era`
    ).run();
    console.log(`Migração: ${musicasCorrigidas.changes} avaliações de músicas corrigidas (tipo -> 'musica').`);
  } catch (e) {
    // Coluna já existe, segue normalmente
  }

  // Migração: preenche registros antigos que tinham musica = NULL
  // Marca como 'album' e coloca o nome da era no campo musica
  const registrosNulos = db.prepare(`SELECT id, era FROM avaliacoes WHERE musica IS NULL`).all();
  if (registrosNulos.length > 0) {
    const updateStmt = db.prepare(`UPDATE avaliacoes SET musica = ?, tipo = 'album' WHERE id = ?`);
    for (const reg of registrosNulos) {
      updateStmt.run(reg.era, reg.id);
    }
    console.log(`Migração: ${registrosNulos.length} registros antigos corrigidos (musica NULL -> nome da era).`);
  }

  // Correção de segurança: garante que avaliações com nome de música diferente da era
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

// === MIDDLEWARE DE AUTENTICAÇÃO ===
// Função para verificar se o usuário está logado em rotas protegidas
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (token == null) return res.status(401).json({ error: 'Acesso negado. Faça login.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
    req.user = user; // Salva as infos do usuário logado na requisição (id, username)
    next();
  });
}

// === ROTAS DE AUTENTICAÇÃO ===

// ROTA: Criar Conta (POST /register)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Preencha usuário e senha.' });
  }

  try {
    // Verifica se usuário já existe
    const userExists = db.prepare('SELECT id FROM usuarios WHERE username = ?').get(username);
    if (userExists) {
      return res.status(400).json({ error: 'Nome de usuário já existe.' });
    }

    // Criptografa a senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Salva no banco
    const stmt = db.prepare('INSERT INTO usuarios (username, password_hash) VALUES (?, ?)');
    const result = stmt.run(username, passwordHash);

    res.status(201).json({ message: 'Conta criada com sucesso!', userId: result.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
});

// ROTA: Fazer Login (POST /login)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca o usuário no banco
    const user = db.prepare('SELECT * FROM usuarios WHERE username = ?').get(username);
    
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    // Compara a senha digitada com a criptografada no banco
    const match = await bcrypt.compare(password, user.password_hash);
    
    if (!match) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // Gera o Token JWT (válido por 24 horas)
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ message: 'Login realizado com sucesso', token, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// === ROTAS DE AVALIAÇÃO ===

// ROTA: Listar TODAS as avaliações (Usado pelo Admin e PainelAdmin)
app.get('/avaliacoes', (req, res) => {
  try {
    // Faz um JOIN para trazer o nome do usuário que fez a avaliação
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

// ROTA: Listar APENAS as avaliações do usuário logado
app.get('/minhas-avaliacoes', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM avaliacoes WHERE usuario_id = ?').all(req.user.id);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar suas avaliações' });
  }
});

// ROTA: Criar ou Atualizar uma avaliação (Exige Login)
app.post('/avaliar', authenticateToken, (req, res) => {
  const { era, nota, tipo, musica } = req.body;
  const usuario_id = req.user.id; // Vem do token JWT

  // Determina o tipo explícito: 'album' ou 'musica'
  const tipoFinal = tipo === 'musica' ? 'musica' : 'album';
  // Se for álbum, salva o nome da era no campo musica (nunca NULL)
  const nomeFinal = tipoFinal === 'album' ? era : (musica || era);
  
  try {
    // 1. Verifica se já existe uma avaliação desse usuário para essa era + tipo + nome
    const avaliacaoExistente = db.prepare(
      'SELECT id FROM avaliacoes WHERE usuario_id = ? AND era = ? AND tipo = ? AND musica = ?'
    ).get(usuario_id, era, tipoFinal, nomeFinal);

    if (avaliacaoExistente) {
      // 2. Se já existe, apenas atualiza a nota (UPDATE)
      const stmt = db.prepare('UPDATE avaliacoes SET nota = ? WHERE id = ?');
      stmt.run(nota, avaliacaoExistente.id);
      res.status(200).json({ id: avaliacaoExistente.id, action: 'updated' });
    } else {
      // 3. Se não existe, cria uma nova (INSERT)
      const stmt = db.prepare('INSERT INTO avaliacoes (usuario_id, era, nota, tipo, musica) VALUES (?, ?, ?, ?, ?)');
      const result = stmt.run(usuario_id, era, nota, tipoFinal, nomeFinal);
      res.status(201).json({ id: result.lastInsertRowid, action: 'created' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar avaliação' });
  }
});

// ROTA: Editar uma avaliação (Exige Login + Permissão)
app.put('/avaliacoes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { nota } = req.body;
  const usuario_id = req.user.id;
  
  try {
    // Verifica se a avaliação pertence ao usuário logado (ou a lógica poderia liberar se for admin)
    const avaliacao = db.prepare('SELECT usuario_id FROM avaliacoes WHERE id = ?').get(id);
    
    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }
    
    if (avaliacao.usuario_id !== usuario_id) {
      return res.status(403).json({ error: 'Você só pode editar suas próprias avaliações.' });
    }

    const stmt = db.prepare('UPDATE avaliacoes SET nota = ? WHERE id = ?');
    const result = stmt.run(nota, id);
    res.json({ message: 'Avaliação atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao editar avaliação' });
  }
});

// ROTA: Excluir uma avaliação (Exige Login + Permissão)
app.delete('/avaliacoes/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const usuario_id = req.user.id;
  
  try {
    const avaliacao = db.prepare('SELECT usuario_id FROM avaliacoes WHERE id = ?').get(id);
    
    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }
    
    // Simplificando: Apenas o dono pode apagar (O admin precisaria de uma flag "is_admin" no banco para bypass)
    // Se quiser que o admin possa apagar qualquer uma pelo atalho, ideal seria verificar se o usuário tem a role de admin.
    if (avaliacao.usuario_id !== usuario_id && req.user.username !== 'admin') { 
      return res.status(403).json({ error: 'Você só pode deletar suas próprias avaliações.' });
    }

    const stmt = db.prepare('DELETE FROM avaliacoes WHERE id = ?');
    stmt.run(id);
    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar avaliação' });
  }
});

// === ROTAS DE CONFIGURAÇÃO DO USUÁRIO ===

// ROTA: Alterar Senha (Exige Login)
app.put('/usuarios/senha', authenticateToken, async (req, res) => {
  const { novaSenha } = req.body;
  const usuario_id = req.user.id;
  
  if (!novaSenha || novaSenha.length < 3) {
    return res.status(400).json({ error: 'A nova senha deve ter pelo menos 3 caracteres.' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(novaSenha, saltRounds);
    
    const stmt = db.prepare('UPDATE usuarios SET password_hash = ? WHERE id = ?');
    stmt.run(passwordHash, usuario_id);
    res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar senha.' });
  }
});

// ROTA: Excluir a própria Conta (Exige Login)
app.delete('/usuarios', authenticateToken, (req, res) => {
  const usuario_id = req.user.id;
  
  try {
    // 1. Deletar todas as avaliações deste usuário primeiro (para evitar erro de Foreign Key se o ON DELETE CASCADE não tiver sido usado)
    db.prepare('DELETE FROM avaliacoes WHERE usuario_id = ?').run(usuario_id);
    
    // 2. Deletar o usuário
    db.prepare('DELETE FROM usuarios WHERE id = ?').run(usuario_id);
    
    res.json({ message: 'Sua conta e todas as suas avaliações foram excluídas permanentemente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar conta.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend seguro rodando na porta ${PORT}`);
});
