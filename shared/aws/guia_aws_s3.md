# Guia de Hospedagem de Imagens na AWS S3 & CloudFront
## LL Imports CWB

Este guia orienta a configuração do **Amazon S3** (armazenamento de arquivos) para servir as imagens de produtos, banners e fotos de clientes da landing page, garantindo carregamento rápido e escalabilidade.

---

## 1. Criar o Bucket no Amazon S3

1. Acesse o **AWS Management Console** e vá até o serviço **S3** (`https://s3.console.aws.amazon.com/`).
2. Clique em **Create bucket** (Criar bucket).
3. **Nome do Bucket:** Escolha um nome exclusivo (exemplo: `llimports-assets-cwb`).
4. **Região da AWS:** Selecione `sa-east-1` (São Paulo) ou `us-east-1` (Norte da Virgínia).
5. **Bloqueio de Acesso Público (Block Public Access):**
   - Como as imagens do catálogo precisam ser acessadas publicamente pelos visitantes do site, **desmarque** a opção *"Block all public access"*.
   - Marque a caixa de confirmação de que o bucket terá leitura pública para objetos de imagem.
6. Clique em **Create bucket**.

---

## 2. Política de Leitura Pública do Bucket (Bucket Policy)

Para permitir que qualquer visitante veja as fotos salvas na pasta `produtos/*` e `assets/*`:

1. Entre no bucket criado e clique na aba **Permissions** (Permissões).
2. Na seção **Bucket policy**, clique em **Edit** e cole o seguinte JSON (substitua `llimports-assets-cwb` pelo nome do seu bucket):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::llimports-assets-cwb/*"
    }
  ]
}
```

3. Clique em **Save changes** (Salvar alterações).

---

## 3. Configuração de CORS (Cross-Origin Resource Sharing)

Para permitir que a landing page (ou o painel de administração em `localhost` ou no seu domínio próprio) envie arquivos diretamente para o S3:

1. Ainda na aba **Permissions**, role até **Cross-origin resource sharing (CORS)** e clique em **Edit**.
2. Cole a configuração abaixo:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://llimportscwb.com.br",
      "https://*.vercel.app"
    ],
    "ExposeHeaders": ["ETag"]
  }
]
```

3. Clique em **Save changes**.

---

## 4. Estrutura de Pastas Sugerida no S3

```
llimports-assets-cwb/
├── produtos/
│   ├── iphone-17-pro-max.webp
│   ├── iphone-17-pro.webp
│   ├── macbook-air-m4.webp
│   ├── apple-watch-ultra-2.webp
│   └── ipad-pro-m4.webp
├── banners/
│   ├── hero-keynote.webp
│   └── showroom-cabral.webp
└── clientes/
    └── entrega-real-01.webp
```

---

## 5. Como usar as URLs no Banco Supabase

O link público de qualquer imagem segue o padrão:
`https://NOME-DO-BUCKET.s3.amazonaws.com/produtos/NOME-DO-ARQUIVO.webp`

Exemplo:
`https://llimports-assets-cwb.s3.sa-east-1.amazonaws.com/produtos/iphone-17-pro-max.webp`

Basta colar esta URL no campo `image_url` do produto pelo **Painel do Admin** da página ou no Supabase SQL Editor.

*(Opcional: se ativar o **CloudFront**, a URL fica ainda mais rápida com CDN global e domínio personalizado: `https://midia.llimportscwb.com.br/produtos/...`)*
