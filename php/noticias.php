<?php
/**
 * API de Últimas Notícias - Taylor Swift
 * Servidor PHP que fornece notícias em formato JSON
 * para o frontend React consumir.
 * 
 * Rodar com: php -S localhost:3002
 */

// Permite que o React (porta 3000) acesse essa API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json; charset=UTF-8');

// === BANCO DE NOTÍCIAS ===
// Em produção, isso viria de um banco de dados MySQL/PostgreSQL
// Por enquanto, usamos um array PHP como fonte de dados

$noticias = [
    [
        "id" => 1,
        "titulo" => "Taylor Swift anuncia novas datas da The Eras Tour para 2026",
        "resumo" => "A cantora confirmou shows adicionais em estádios da América Latina, incluindo datas no Brasil, Argentina e México para o segundo semestre de 2026.",
        "data" => "2026-05-10",
        "categoria" => "Tour",
        "fonte" => "Billboard",
        "imagem" => "https://rollingstone.com.br/wp-content/uploads/2023/12/taylor-swift-the-eras-tour-e-a-celebracao-de-uma-contadora-de-historias-leia-a-critica-foto-divulgacao-2.jpg",
        "link" => "#"
    ],
    [
        "id" => 2,
        "titulo" => "The Life Of a Showgirl ultrapassa 3 bilhões de streams no Spotify",
        "resumo" => "O álbum mais recente de Taylor Swift atinge marca histórica em tempo recorde, consolidando-se como um dos álbuns mais ouvidos da plataforma em 2026.",
        "data" => "2026-05-08",
        "categoria" => "Streaming",
        "fonte" => "Spotify Charts",
        "imagem" => "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUocPv34ci3s0Vx4V__NU2axdGaZUv9eAbZPg_35yO5li6yIVrnFBWDamnhr0qBZv2SxZkhFfG40kaMJW8vQyO2sCJVrJ7owNVTq3aGZ1g_3JzlQVjyl5cDcnzrLvuzPjMCuy-N6t_XV2gegNoSdp3fL_6CF8zCCfzfXrYMU3_0S7b-Gx-SBzARrEKlqkA/s16000/20251018%20Random%20J%20Pop%20(Album%20Review)%20Taylor%20Swift%20-%20The%20Life%20of%20a%20Showgirl%20%238.png",
        "link" => "#"
    ],
    [
        "id" => 3,
        "titulo" => "Taylor Swift é indicada a 15º Grammy Award",
        "resumo" => "A Recording Academy revelou as indicações para o Grammy 2027, e Taylor Swift concorre nas categorias de Álbum do Ano e Melhor Performance Pop com 'The Life Of a Showgirl'.",
        "data" => "2026-05-05",
        "categoria" => "Premiação",
        "fonte" => "Grammy.com",
        "imagem" => "https://i8.amplience.net/i/naras/Taylor-Swift-AOTY-2024-GRAMMYs",
        "link" => "#"
    ],
    [
        "id" => 4,
        "titulo" => "The Eras Tour se torna a primeira turnê a arrecadar $3 bilhões",
        "resumo" => "Com as novas datas adicionadas em 2025 e 2026, a Eras Tour ultrapassou a marca histórica de $3 bilhões em arrecadação total de bilheteria.",
        "data" => "2026-05-02",
        "categoria" => "Tour",
        "fonte" => "Pollstar",
        "imagem" => "https://www.lodgify.com/blog/wp-content/uploads/2024/06/1024px-Taylor_Swift_The_Eras_Tour_The_Folklore_Set_Era_53108930417.jpg",
        "link" => "#"
    ],
    [
        "id" => 5,
        "titulo" => "Os melhores momentos fashion de Taylor Swift em 2026",
        "resumo" => "De looks icônicos no tapete vermelho a figurinos deslumbrantes nos palcos da Eras Tour, Taylor Swift continua sendo referência de estilo e elegância na indústria.",
        "data" => "2026-04-28",
        "categoria" => "Estilo",
        "fonte" => "Vogue",
        "imagem" => "https://www.byrdie.com/thmb/TvJUwFKYwozMIg2tq4x2I50gtEA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/taylor-swift-style-moments-decf5be7ac3e45da931795456033822b.png",
        "link" => "#"
    ],
    [
        "id" => 6,
        "titulo" => "Versão deluxe de The Life Of a Showgirl com 4 faixas bônus é confirmada",
        "resumo" => "Taylor revelou nas redes sociais que a versão deluxe incluirá músicas gravadas ao vivo durante a Eras Tour e uma colaboração surpresa ainda não revelada.",
        "data" => "2026-04-25",
        "categoria" => "Lançamento",
        "fonte" => "Taylor Swift (Instagram)",
        "imagem" => "https://elcomercio.pe/resizer/v2/ZHHGC4EHBJFWRE4QLE34WYUFPQ.jpg?auth=987b3be19a355d27da1b66def667291fd91ceac1e5ff6bec4e02849dc580c81a&width=980&height=646&quality=75&smart=true",
        "link" => "#"
    ],
];

// === FILTROS (via query string) ===
// Exemplo: ?categoria=Tour  ou  ?limite=3

$categoriaFiltro = isset($_GET['categoria']) ? $_GET['categoria'] : null;
$limite = isset($_GET['limite']) ? intval($_GET['limite']) : null;

// Filtra por categoria se especificada
if ($categoriaFiltro) {
    $noticias = array_filter($noticias, function($noticia) use ($categoriaFiltro) {
        return strtolower($noticia['categoria']) === strtolower($categoriaFiltro);
    });
    $noticias = array_values($noticias); // Reindexa o array
}

// Limita quantidade se especificado
if ($limite && $limite > 0) {
    $noticias = array_slice($noticias, 0, $limite);
}

// === RESPOSTA ===
$resposta = [
    "total" => count($noticias),
    "fonte" => "PHP API - Taylor Eras",
    "atualizado_em" => date('Y-m-d H:i:s'),
    "noticias" => $noticias
];

echo json_encode($resposta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
