/* Banco de cartões. Para adicionar um cartão, copie um objeto e edite.
   correta = índice (começando em 0) da opção certa em opcoes. */
window.CARDS = [
 {
  "tema": "Segurança",
  "pergunta": "Qual serviço guarda credenciais de banco RDS/Aurora com rotação automática e MENOR esforço?",
  "opcoes": [
   "Parameter Store SecureString + Lambda",
   "Secrets Manager com rotação nativa",
   "KMS com rotação de chave",
   "Arquivo criptografado no S3"
  ],
  "correta": 1,
  "explicacao": "Credencial que precisa ser rotacionada vai para o Secrets Manager. O Parameter Store não rotaciona sozinho, e o KMS guarda chaves, não credenciais.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Como acessar centenas de EC2 com segurança, sem chaves SSH compartilhadas?",
  "opcoes": [
   "STS gerando chaves SSH temporárias",
   "Instâncias bastião",
   "Systems Manager Session Manager",
   "Cognito + Lambda"
  ],
  "correta": 2,
  "explicacao": "O Session Manager dispensa chave SSH e porta 22 aberta, e ainda registra as sessões. O STS não gera chave SSH.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Qual serviço escaneia as instâncias EC2 em busca de vulnerabilidades de software?",
  "opcoes": [
   "GuardDuty",
   "Macie",
   "Inspector",
   "Shield"
  ],
  "correta": 2,
  "explicacao": "Inspector cuida de vulnerabilidades. GuardDuty detecta ameaças a partir de logs, Macie encontra PII no S3 e Shield protege contra DDoS. Detective serve para investigar incidentes.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Qual serviço aplica patches em uma frota de EC2 com agendamento e relatório de conformidade?",
  "opcoes": [
   "Systems Manager Patch Manager",
   "Session Manager",
   "Cron em cada instância",
   "EventBridge + Detective"
  ],
  "correta": 0,
  "explicacao": "Patch Manager aplica os patches com agendamento e mostra o status de conformidade. A combinação clássica é Inspector + Patch Manager.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Qual dupla rastreia mudanças de configuração e mostra QUEM fez cada alteração?",
  "opcoes": [
   "Config + CloudTrail",
   "Trusted Advisor + CloudTrail",
   "Config + Trusted Advisor",
   "CloudFormation + Config"
  ],
  "correta": 0,
  "explicacao": "O Config guarda o histórico e a conformidade da configuração. O CloudTrail registra quem fez cada chamada de API. O Trusted Advisor só dá recomendações de boas práticas.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "O Cognito já autentica o usuário. O que dá a ele credenciais AWS para ler um bucket S3?",
  "opcoes": [
   "Mudar a ACL do bucket",
   "Identity Pool assumindo um IAM role",
   "Mapeamento de atributos no User Pool",
   "Reimplantar o app"
  ],
  "correta": 1,
  "explicacao": "O User Pool só autentica. Quem troca o token por credenciais AWS temporárias, por meio de um IAM role, é o Identity Pool.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Como garantir que todo objeto enviado ao S3 seja criptografado em repouso?",
  "opcoes": [
   "Negar PutObject sem aws:SecureTransport",
   "Negar PutObject sem x-amz-server-side-encryption",
   "Negar PutObject sem x-amz-acl",
   "Ativar o Macie"
  ],
  "correta": 1,
  "explicacao": "O cabeçalho x-amz-server-side-encryption trata de criptografia em repouso. O aws:SecureTransport trata de criptografia em trânsito (HTTPS).",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Um API Gateway privado chama outra API pela internet em vez de pela VPC. Que tipo de endpoint resolve?",
  "opcoes": [
   "Gateway endpoint",
   "Interface endpoint",
   "NAT gateway",
   "Fila SQS entre as APIs"
  ],
  "correta": 1,
  "explicacao": "Gateway endpoints existem só para S3 e DynamoDB. Qualquer outro serviço, incluindo o API Gateway (execute-api), usa interface endpoint (PrivateLink).",
  "essencial": true
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Qual solução minimiza latência e perda de pacotes para um jogo multiplayer com UDP em 8 regiões?",
  "opcoes": [
   "CloudFront com UDP",
   "Global Accelerator",
   "Transit Gateway com peering",
   "Malha de VPC peering"
  ],
  "correta": 1,
  "explicacao": "O Global Accelerator atende TCP e UDP pela rede global da AWS. O CloudFront atende só HTTP/HTTPS.",
  "essencial": true
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Como posicionar as EC2 de um banco em memória para máxima taxa de transferência e mínimo custo de transferência?",
  "opcoes": [
   "Partition placement group em várias AZs",
   "Cluster placement group na mesma AZ",
   "Spread placement group",
   "Auto Scaling em várias AZs"
  ],
  "correta": 1,
  "explicacao": "No cluster placement group as instâncias ficam juntas na mesma AZ: menor latência, maior throughput e nenhum custo de transferência entre AZs.",
  "essencial": false
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Como redimensionar imagens dinamicamente atrás do CloudFront com MENOR sobrecarga?",
  "opcoes": [
   "Política de cabeçalhos de resposta do CloudFront",
   "Política de requisição de origem",
   "Lambda@Edge com biblioteca de imagens",
   "Biblioteca de imagens em um EC2"
  ],
  "correta": 2,
  "explicacao": "Para transformar conteúdo na borda, use Lambda@Edge. As políticas do CloudFront só controlam cabeçalhos e cache, não mexem no conteúdo.",
  "essencial": false
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Como reduzir o custo de transferência de downloads do S3 para clientes nos EUA e na Europa, mantendo o controle de acesso?",
  "opcoes": [
   "S3 Transfer Acceleration",
   "Replicação entre regiões",
   "CloudFront com URLs assinadas do CloudFront",
   "Streaming pelo app web"
  ],
  "correta": 2,
  "explicacao": "A transferência do S3 para o CloudFront não é cobrada, e o cache reduz custo e latência. O Transfer Acceleration acelera, mas aumenta o custo.",
  "essencial": true
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Como processar mensagens SQS de até 50 MB com o MENOR número de mudanças no código (Java)?",
  "opcoes": [
   "Aumentar o limite do SQS",
   "SQS Extended Client Library (S3)",
   "Guardar as mensagens no EFS",
   "Trocar por EventBridge"
  ],
  "correta": 1,
  "explicacao": "A Extended Client Library guarda o conteúdo no S3 e coloca só a referência na fila, aceitando até 2 GB. O limite de 256 KB do SQS não muda.",
  "essencial": false
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Como montar um workflow orientado a eventos, distribuído e serverless, com MENOR sobrecarga?",
  "opcoes": [
   "Step Functions + EC2",
   "EventBridge agendado + Lambda",
   "Step Functions (máquina de estados) + Lambda",
   "Glue + Lambda"
  ],
  "correta": 2,
  "explicacao": "Se a questão pede workflow com etapas e serverless, a resposta é Step Functions com Lambda. O EventBridge agendado só dispara tarefas, não orquestra um fluxo.",
  "essencial": true
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Como separar mensagens por tipo, sem perder nenhuma, com cada backend lendo da sua própria fila?",
  "opcoes": [
   "Um Kinesis Data Stream por tipo",
   "Um tópico SNS e uma Lambda por tipo",
   "SNS com filtro de mensagens para várias filas SQS",
   "Firehose para o OpenSearch"
  ],
  "correta": 2,
  "explicacao": "Fan-out SNS → SQS com filtro: o SNS distribui por tipo e o SQS garante que nenhuma mensagem se perca.",
  "essencial": true
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Como garantir que um pico repentino de pedidos processados de forma assíncrona não perca nenhum pedido?",
  "opcoes": [
   "Auto Scaling por tráfego de rede",
   "Fila SQS recebendo os pedidos para os workers",
   "ElastiCache na frente do ALB",
   "Mais instâncias EC2"
  ],
  "correta": 1,
  "explicacao": "Se a questão fala em pico com processamento assíncrono e nada pode se perder, a resposta é SQS como buffer.",
  "essencial": true
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Leitores de crachá enviam mensagens via HTTPS. Qual arquitetura serverless e altamente disponível recebe e processa essas mensagens?",
  "opcoes": [
   "Route 53 → Lambda → DynamoDB",
   "API Gateway → Lambda → DynamoDB",
   "Um EC2 como endpoint",
   "VPN + gateway endpoint do S3"
  ],
  "correta": 1,
  "explicacao": "Endpoint HTTPS serverless é API Gateway. O Route 53 é DNS e não invoca Lambda.",
  "essencial": false
 },
 {
  "tema": "DR e bancos",
  "pergunta": "Qual a solução de DR entre regiões para MySQL com MENOR sobrecarga operacional?",
  "opcoes": [
   "RDS Multi-AZ",
   "Backup no S3 com CRR e restore",
   "Aurora Global Database",
   "EC2 standby com replicação"
  ],
  "correta": 2,
  "explicacao": "Aurora Global Database replica entre regiões de forma gerenciada, com RPO de segundos. O Multi-AZ fica dentro de uma única região.",
  "essencial": true
 },
 {
  "tema": "DR e bancos",
  "pergunta": "Como fazer backup diário da configuração da EC2 e dos dados, recuperável em outra região?",
  "opcoes": [
   "AWS Backup com os volumes EBS como recurso",
   "AWS Backup com as instâncias EC2 como recurso",
   "Lambda tirando snapshots",
   "Snapshots copiados para outra AZ"
  ],
  "correta": 1,
  "explicacao": "Com a instância como recurso, o backup gera uma AMI com a configuração e todos os volumes. Adicionar só os volumes perde a configuração.",
  "essencial": false
 },
 {
  "tema": "DR e bancos",
  "pergunta": "Qual dupla dá alta disponibilidade ao RDS e tira os relatórios do primário?",
  "opcoes": [
   "Multi-AZ + RDS Proxy",
   "Multi-AZ + read replica para os relatórios",
   "Read replica + RDS Custom",
   "Snapshot + restore em outra AZ"
  ],
  "correta": 1,
  "explicacao": "Multi-AZ dá alta disponibilidade, e o standby não atende leitura. A read replica tira os relatórios do primário. O RDS Proxy só faz pool de conexões.",
  "essencial": true
 },
 {
  "tema": "Migração",
  "pergunta": "Qual serviço migra 30 TB em 5 dias por um link de 1 Gbps compartilhado, controlando a banda usada?",
  "opcoes": [
   "DataSync",
   "Snowcone",
   "Transfer Family",
   "FSx File Gateway"
  ],
  "correta": 0,
  "explicacao": "O DataSync permite limitar a banda e 1 Gbps transfere cerca de 10 TB por dia. O Snowcone guarda só 8 a 14 TB.",
  "essencial": true
 },
 {
  "tema": "Migração",
  "pergunta": "Como um cliente baixa arquivos do S3 por SFTP com login do Active Directory, sem mudar o app?",
  "opcoes": [
   "Transfer Family (SFTP) com AD",
   "DataSync",
   "EC2 Windows com SFTP",
   "DMS"
  ],
  "correta": 0,
  "explicacao": "Se a questão fala em SFTP, FTPS ou FTP para S3 ou EFS, a resposta é Transfer Family, que integra com o AD.",
  "essencial": false
 },
 {
  "tema": "Migração",
  "pergunta": "Qual opção de storage iSCSI mantém no local só os dados acessados recentemente?",
  "opcoes": [
   "Volume Gateway com volumes armazenados",
   "Volume Gateway com volumes em cache",
   "S3 File Gateway",
   "Tape Gateway"
  ],
  "correta": 1,
  "explicacao": "Com volumes em cache, só os dados recentes ficam no local e o resto vai para a AWS. Com volumes armazenados, tudo fica no local e a AWS guarda o backup.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Onde rodar um job em lote de 64 vCPUs e 512 GiB, a cada hora, com MENOR sobrecarga?",
  "opcoes": [
   "Lambda",
   "ECS no Fargate",
   "AWS Batch no EC2",
   "Lightsail"
  ],
  "correta": 2,
  "explicacao": "O Lambda tem limite de 15 minutos e 10 GB, e o Fargate não chega a 64 vCPUs e 512 GiB. Job em lote grande vai para o AWS Batch no EC2.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual política de escalabilidade provisiona capacidade antes de jobs semanais quando ninguém analisa as tendências?",
  "opcoes": [
   "Escalabilidade agendada",
   "Escalabilidade preditiva",
   "Target tracking em 60%",
   "EventBridge + Lambda"
  ],
  "correta": 1,
  "explicacao": "Na preditiva, a própria AWS analisa o histórico e pode pré-lançar as instâncias. Na agendada, você precisa saber a capacidade de antemão.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual dupla otimiza o custo no S3 com acesso inconsistente após 30 dias, alta disponibilidade e uploads multipart?",
  "opcoes": [
   "One Zone-IA + limpar marcadores de exclusão",
   "Intelligent-Tiering + limpar uploads multipart incompletos",
   "Standard-IA + One Zone-IA",
   "Glacier + Intelligent-Tiering"
  ],
  "correta": 1,
  "explicacao": "Para padrão de acesso imprevisível, use Intelligent-Tiering. Para upload multipart, crie uma regra de ciclo de vida que apague as partes incompletas. One Zone-IA perde disponibilidade.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como identificar buckets S3 pouco ou nunca acessados com MENOR sobrecarga?",
  "opcoes": [
   "CloudTrail + CloudWatch Logs",
   "S3 Storage Lens",
   "Métrica BucketSizeBytes + Athena",
   "Painel do S3 no console"
  ],
  "correta": 1,
  "explicacao": "O Storage Lens mostra métricas de atividade de todos os buckets em um painel pronto.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual armazenamento compartilhado usar para o código do servidor em instâncias EC2 Windows?",
  "opcoes": [
   "EFS",
   "FSx for Windows File Server",
   "EBS gp2 compartilhado",
   "ElastiCache"
  ],
  "correta": 1,
  "explicacao": "Se a questão fala em Windows ou SMB, a resposta é FSx for Windows. O EFS funciona só com Linux e NFS.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como dar permissão por COLUNA a dados do data lake e do Aurora no QuickSight com MENOR sobrecarga?",
  "opcoes": [
   "Glue Studio + política IAM",
   "Blueprint do Lake Formation + permissões do Lake Formation + Athena",
   "EMR para o SPICE",
   "Política de bucket por coluna"
  ],
  "correta": 1,
  "explicacao": "Permissão por coluna em data lake é feita no Lake Formation, com o Athena como fonte de dados do QuickSight. IAM e política de bucket não controlam colunas.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como ingerir dados JSON com consulta quase em tempo real e perda mínima de dados?",
  "opcoes": [
   "Kinesis Data Streams + Data Analytics (Flink)",
   "Armazenamento de instância + Firehose + Athena",
   "EBS + Redis pub/sub",
   "Firehose para o Redshift"
  ],
  "correta": 0,
  "explicacao": "O Data Streams guarda os dados de forma durável e o Data Analytics (hoje Managed Service for Apache Flink) consulta em tempo real. O Firehose entrega em lotes, com atraso.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Como proteger contra injeção de SQL um app que roda atrás de um ALB?",
  "opcoes": [
   "Inspector bloqueando as tentativas",
   "Regra de listener do ALB com resposta fixa",
   "Shield Advanced",
   "AWS WAF com web ACL no ALB"
  ],
  "correta": 3,
  "explicacao": "WAF filtra ataques de camada 7, como SQL injection e XSS. Shield protege contra DDoS e Inspector procura vulnerabilidades, mas nenhum dos dois bloqueia requisições.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual opção dá a máxima economia em 3 anos permitindo trocar família e tamanho das instâncias?",
  "opcoes": [
   "Zonal Reserved Instances",
   "Standard Reserved Instances",
   "Compute Savings Plan",
   "EC2 Instance Savings Plan"
  ],
  "correta": 2,
  "explicacao": "O Compute Savings Plan aceita trocar família, tamanho, região e até usar Fargate e Lambda. O EC2 Instance Savings Plan prende você a uma família em uma região.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Como compartilhar com outra conta um snapshot do Aurora criptografado com chave KMS do cliente?",
  "opcoes": [
   "Copiar para um snapshot sem criptografia",
   "Baixar e subir para o S3",
   "Usar uma chave gerenciada pela AWS diferente",
   "Adicionar a outra conta à key policy e compartilhar o snapshot"
  ],
  "correta": 3,
  "explicacao": "Snapshot criptografado com chave gerenciada pela AWS não pode ser compartilhado. Com chave do cliente, basta liberar a outra conta na key policy.",
  "essencial": false
 },
 {
  "tema": "Migração",
  "pergunta": "Qual solução de DR para um volume iSCSI de centenas de TB mantém acesso local imediato a todos os arquivos?",
  "opcoes": [
   "Tape Gateway",
   "Volume Gateway com volumes em cache de 10 TB",
   "S3 File Gateway",
   "Volume Gateway com volumes armazenados"
  ],
  "correta": 3,
  "explicacao": "Com volumes armazenados, todos os dados ficam no local, com baixa latência, e a AWS recebe snapshots assíncronos. O cache de 10 TB não guarda tudo no local.",
  "essencial": false
 },
 {
  "tema": "Migração",
  "pergunta": "Qual serviço transfere grandes volumes periodicamente entre sistemas NFS em duas regiões?",
  "opcoes": [
   "Servidor SFTP no EC2",
   "Snowball",
   "DataSync",
   "DMS"
  ],
  "correta": 2,
  "explicacao": "O DataSync transfere de forma gerenciada e agendada entre NFS, EFS, FSx e S3, inclusive entre regiões. O DMS serve para bancos de dados.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual modo de capacidade do DynamoDB usar para carga constante e previsível, dentro do orçamento?",
  "opcoes": [
   "On-demand com capacidade reservada",
   "On-demand com RCU/WCU altas",
   "Modo provisionado com RCU/WCU definidas",
   "Provisionado + Standard-IA"
  ],
  "correta": 2,
  "explicacao": "Carga previsível vai para o modo provisionado, que é mais barato. O on-demand é para carga imprevisível, e nele você nem define RCU e WCU.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Como criptografar dados em repouso no RDS?",
  "opcoes": [
   "Chave no Secrets Manager",
   "Chave no KMS e criptografia habilitada na instância",
   "Certificado do IAM com SSL/TLS",
   "Certificado do ACM com SSL/TLS"
  ],
  "correta": 1,
  "explicacao": "Criptografia em repouso usa KMS, habilitado na criação da instância. SSL/TLS trata de criptografia em trânsito.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como escalar tarefas do ECS no Fargate conforme CPU e memória?",
  "opcoes": [
   "Lambda acionada por alarme",
   "EC2 Auto Scaling simples",
   "EC2 Auto Scaling agendado",
   "Application Auto Scaling com target tracking"
  ],
  "correta": 3,
  "explicacao": "No Fargate não existem instâncias EC2 para escalar. Serviços ECS escalam com o Application Auto Scaling.",
  "essencial": false
 },
 {
  "tema": "DR e bancos",
  "pergunta": "Como acabar com os timeouts de conexão entre Lambda e RDS nos picos, com o mínimo de mudança no código?",
  "opcoes": [
   "Reduzir a concorrência do Lambda",
   "Aumentar a classe da instância",
   "Migrar para DynamoDB",
   "Ativar o RDS Proxy"
  ],
  "correta": 3,
  "explicacao": "O RDS Proxy faz pool e reaproveita conexões, o que resolve a enxurrada de conexões abertas pelas Lambdas sem mudar o código.",
  "essencial": true
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Como entregar conteúdo só a usuários autorizados de um app móvel com milhões de usuários?",
  "opcoes": [
   "Client VPN",
   "CloudFront com URLs assinadas",
   "S3 público + KMS",
   "VPN IPsec"
  ],
  "correta": 1,
  "explicacao": "Distribuição global com acesso restrito vai para o CloudFront com URLs ou cookies assinados. VPN não escala para milhões de usuários.",
  "essencial": false
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Um script em EC2 faz polling no SQS. Como reduzir custo e acompanhar o volume crescente de mensagens?",
  "opcoes": [
   "EventBridge desligando a instância",
   "Run Command sob demanda",
   "Migrar o script para Lambda",
   "Instância maior"
  ],
  "correta": 2,
  "explicacao": "A Lambda usa a fila SQS como fonte de eventos, escala sozinha e cobra só pelo uso.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Como permitir que EC2 em sub-rede privada acessem só as URLs de repositórios aprovados?",
  "opcoes": [
   "WAF com intervalos de IP",
   "Security group de saída com URLs",
   "ALB para o tráfego de saída",
   "Network Firewall com lista de domínios"
  ],
  "correta": 3,
  "explicacao": "Security group e NACL só filtram IP e porta, e o WAF protege a entrada HTTP. Filtrar a saída por domínio é com o Network Firewall.",
  "essencial": false
 },
 {
  "tema": "Migração",
  "pergunta": "Qual armazenamento compartilhado e totalmente gerenciado atende clientes SMB?",
  "opcoes": [
   "EC2 Windows com compartilhamento",
   "FSx for Windows File Server",
   "DataSync montável",
   "Bucket S3 montado"
  ],
  "correta": 1,
  "explicacao": "Se a questão fala em SMB e totalmente gerenciado, a resposta é FSx for Windows. Um EC2 Windows funciona, mas você teria que gerenciar o servidor.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Como garantir que dados de saúde (PHI) no S3 sejam criptografados em trânsito e em repouso, com a chave gerenciada pela equipe?",
  "opcoes": [
   "ACM associado ao S3 + SSE-KMS",
   "SecureTransport + SSE-S3",
   "SecureTransport + SSE-KMS",
   "SecureTransport + Macie"
  ],
  "correta": 2,
  "explicacao": "Com SSE-S3 quem gerencia a chave é a AWS. Para a equipe controlar a chave, use SSE-KMS. O trânsito se garante com aws:SecureTransport, porque o ACM não se associa ao S3.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual dupla resolve vídeos brutos travando no celular, com máximo desempenho e menor sobrecarga?",
  "opcoes": [
   "CloudFront + Elastic Transcoder",
   "EC2 em Local Zones + EC2 para converter",
   "DataSync entre regiões + CloudFront",
   "EC2 para converter + DataSync"
  ],
  "correta": 0,
  "explicacao": "A solução é converter os vídeos com um serviço gerenciado e entregar com CDN. O Elastic Transcoder foi descontinuado e hoje a AWS indica o MediaConvert, mas a prova pode ainda citar o antigo.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Um app COTS lê só Redshift e S3 e não processa os CSVs de um app legado. Como resolver com MENOR sobrecarga?",
  "opcoes": [
   "Lambda + DynamoDB",
   "Job ETL do Glue agendado gravando no Redshift",
   "Script Python em EC2",
   "EMR semanal via EventBridge"
  ],
  "correta": 1,
  "explicacao": "Para ETL serverless e gerenciado, use o Glue. O DynamoDB não é lido pelo app, e EC2 ou EMR dão mais trabalho.",
  "essencial": false
 },
 {
  "tema": "DR e bancos",
  "pergunta": "As read replicas do RDS MySQL atrasam nos picos. Como reduzir o lag com pouca mudança no código?",
  "opcoes": [
   "DynamoDB",
   "ElastiCache na frente",
   "Aurora MySQL com Aurora Replicas e auto scaling",
   "MySQL em EC2"
  ],
  "correta": 2,
  "explicacao": "As Aurora Replicas compartilham o mesmo armazenamento, então o lag costuma ficar abaixo de 100 ms, e o auto scaling ajusta o número de réplicas.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual classe usar para 75% dos dados que ficam raramente acessados após 30 dias, com acesso imediato e mesma disponibilidade?",
  "opcoes": [
   "One Zone-IA imediatamente",
   "Glacier Deep Archive após 30 dias",
   "Standard-IA após 30 dias",
   "One Zone-IA após 30 dias"
  ],
  "correta": 2,
  "explicacao": "Standard-IA mantém várias AZs e acesso imediato. One Zone-IA perde resiliência, e o Glacier Deep Archive leva horas para recuperar.",
  "essencial": false
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Qual combinação dá autenticação serverless e global, com a menor latência de login, para menos de 100 usuários?",
  "opcoes": [
   "Directory Service + Lambda@Edge + Beanstalk",
   "Cognito + Lambda@Edge + CloudFront",
   "Cognito + Lambda + Transfer Acceleration",
   "Directory Service + Lambda + ALB"
  ],
  "correta": 1,
  "explicacao": "Login serverless é Cognito. A autorização na borda é Lambda@Edge e a entrega global é CloudFront. O Directory Service é caro e não é serverless.",
  "essencial": false
 },
 {
  "tema": "DR e bancos",
  "pergunta": "Qual banco gerenciado e altamente disponível é o mais barato para 1 TB, com pico de 1.000 IOPS e folga para o dobro?",
  "opcoes": [
   "RDS Multi-AZ com io2 Block Express",
   "S3 Intelligent-Tiering",
   "RDS Multi-AZ com gp2",
   "Duas EC2 em ativo-passivo"
  ],
  "correta": 2,
  "explicacao": "O gp2 entrega 3 IOPS por GB, então 1 TB dá cerca de 3.000 IOPS e cobre o dobro do pico. O io2 seria desperdício.",
  "essencial": false
 },
 {
  "tema": "Migração",
  "pergunta": "Qual gateway leva um NAS com compartilhamentos SMB e NFS para o S3 com lifecycle, sem mudar nada nas estações?",
  "opcoes": [
   "Tape Gateway",
   "Volume Gateway",
   "S3 File Gateway",
   "FSx File Gateway"
  ],
  "correta": 2,
  "explicacao": "O S3 File Gateway expõe NFS e SMB e grava como objetos no S3, onde as regras de lifecycle funcionam. O FSx File Gateway é só SMB e grava no FSx.",
  "essencial": false
 },
 {
  "tema": "Migração",
  "pergunta": "Como dar acesso seguro a arquivos Windows confidenciais para funcionários remotos, com o servidor local sem espaço?",
  "opcoes": [
   "FSx for Windows + AD local + Client VPN",
   "S3 + endpoint público + SSO",
   "S3 + endpoint privado + URL assinada",
   "EC2 em sub-rede pública"
  ],
  "correta": 0,
  "explicacao": "FSx for Windows mantém o SMB e as permissões do AD, e o Client VPN dá acesso remoto seguro.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como reduzir ao mínimo a latência de inicialização de instâncias criadas a partir de uma AMI grande?",
  "opcoes": [
   "register-image + Step Functions",
   "DLM + Lambda",
   "EBS Fast Snapshot Restore no snapshot da AMI",
   "EventBridge + AWS Backup"
  ],
  "correta": 2,
  "explicacao": "O Fast Snapshot Restore entrega os volumes já inicializados, sem o carregamento lento dos blocos vindos do S3.",
  "essencial": false
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Como avisar o usuário na hora que a imagem chegou, se a miniatura leva até 60 s para ficar pronta?",
  "opcoes": [
   "Lambda gerando e avisando",
   "Fila SQS para gerar a miniatura e resposta imediata",
   "Step Functions orquestrando",
   "SNS com duas assinaturas"
  ],
  "correta": 1,
  "explicacao": "A imagem entra na fila SQS, o app responde na hora e um worker processa depois. Esse é o desacoplamento assíncrono clássico.",
  "essencial": false
 },
 {
  "tema": "Migração",
  "pergunta": "Como migrar 20 TB em 30 dias com um link de 15 Mbps limitado a 70% de uso?",
  "opcoes": [
   "S3 Transfer Acceleration",
   "Snowball",
   "DataSync",
   "VPN"
  ],
  "correta": 1,
  "explicacao": "15 Mbps a 70% dá cerca de 113 GB por dia, ou seja, uns 3,4 TB em 30 dias. Pela rede não cabe, então é Snowball.",
  "essencial": false
 },
 {
  "tema": "DR e bancos",
  "pergunta": "Qual serviço usar para um MySQL com acesso infrequente, pouca indisponibilidade e sem escolher tipo de instância?",
  "opcoes": [
   "Aurora MySQL",
   "RDS for MySQL",
   "Redshift Spectrum",
   "Aurora Serverless"
  ],
  "correta": 3,
  "explicacao": "Sem escolher tipo de instância e com uso intermitente, a resposta é Aurora Serverless, que escala a capacidade sozinho.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "A CPU vai a 100% todo dia 1º à meia-noite por causa do lote mensal. Qual política de escalabilidade evita isso?",
  "opcoes": [
   "Escalabilidade simples por CPU",
   "CloudFront na frente do ALB",
   "Escalabilidade agendada mensal",
   "ElastiCache"
  ],
  "correta": 2,
  "explicacao": "Horário conhecido pede escalabilidade agendada. A preditiva serve quando ninguém conhece a tendência e a AWS analisa o histórico.",
  "essencial": false
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Como reduzir a latência do conteúdo estático (S3) e dinâmico (ALB) de um app global, com o mínimo de peças?",
  "opcoes": [
   "CloudFront para o ALB + Global Accelerator para o S3",
   "Uma distribuição CloudFront com o S3 e o ALB como origens",
   "Global Accelerator com o ALB e o CloudFront como endpoints",
   "Dois domínios, um para cada serviço"
  ],
  "correta": 1,
  "explicacao": "Uma distribuição CloudFront aceita várias origens e escolhe por caminho (behaviors), por exemplo /static vai para o S3 e o resto para o ALB. O CloudFront também acelera conteúdo dinâmico. O Global Accelerator nem aceita S3 como endpoint.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual armazenamento usar para arquivos de dezenas de GB a centenas de TB, em sistema de arquivos padrão, que escale sozinho e seja altamente disponível?",
  "opcoes": [
   "EBS com EC2 em Auto Scaling",
   "EBS com EKS",
   "S3 com ECS",
   "EFS com EC2 em Auto Scaling Multi-AZ"
  ],
  "correta": 3,
  "explicacao": "O EFS é um sistema de arquivos (NFS) que cresce sozinho, funciona em várias AZs e é compartilhado entre instâncias. O EBS fica preso a uma AZ e tem tamanho fixo. O S3 guarda objetos, não é sistema de arquivos.",
  "essencial": true
 },
 {
  "tema": "Migração",
  "pergunta": "Como trazer dados de várias fontes SaaS para o S3 com MENOR sobrecarga, tirando essa carga do EC2?",
  "opcoes": [
   "Auto Scaling nas EC2",
   "ECS com Container Insights",
   "Amazon AppFlow + notificação de evento do S3 para o SNS",
   "Uma regra do EventBridge por fonte SaaS"
  ],
  "correta": 2,
  "explicacao": "Se a questão fala em integrar fontes SaaS (Salesforce, Zendesk, Slack etc.), a resposta é AppFlow, o serviço gerenciado para isso. A notificação de evento do S3 avisa quando o upload termina.",
  "essencial": false
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Como inspecionar todo o tráfego de entrada com um firewall virtual de terceiros (Marketplace), com MENOR sobrecarga?",
  "opcoes": [
   "NLB na sub-rede pública",
   "Transit Gateway na VPC de inspeção",
   "Gateway Load Balancer + endpoint do GWLB",
   "ALB na sub-rede pública"
  ],
  "correta": 2,
  "explicacao": "O Gateway Load Balancer foi feito para appliances de terceiros (firewall, IDS/IPS). Ele distribui os pacotes IP entre os appliances, e o endpoint do GWLB entra na tabela de rotas. Se a questão fala em appliance de terceiros, a resposta é GWLB.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Como aplicar um patch de software de terceiros em 1.000 EC2 o MAIS RÁPIDO possível?",
  "opcoes": [
   "Systems Manager Run Command com um comando personalizado",
   "Janela de manutenção do Systems Manager",
   "Função Lambda",
   "Patch Manager"
  ],
  "correta": 0,
  "explicacao": "O Run Command executa um comando agora em toda a frota. O Patch Manager cuida de patches recorrentes, com baseline e relatório, e a janela de manutenção é agendada. Correção urgente vai para o Run Command; patch recorrente com conformidade vai para o Patch Manager.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Como dar a um gerente sem conta AWS acesso a um dashboard do CloudWatch, seguindo o menor privilégio?",
  "opcoes": [
   "Bastion com RDP",
   "Usuário IAM com CloudWatchReadOnlyAccess",
   "Compartilhar o dashboard pelo console do CloudWatch, por e-mail",
   "Usuário IAM com ViewOnlyAccess"
  ],
  "correta": 2,
  "explicacao": "O CloudWatch permite compartilhar um dashboard com e-mails específicos, e a pessoa vê só aquele dashboard. Um usuário IAM daria acesso ao CloudWatch inteiro, mais do que o necessário.",
  "essencial": false
 },
 {
  "tema": "Migração",
  "pergunta": "Como migrar 70 TB de vídeos para o S3 o mais rápido possível usando a MENOR largura de banda de rede?",
  "opcoes": [
   "Direct Connect + S3 File Gateway",
   "AWS CLI copiando tudo",
   "Snowball Edge",
   "S3 File Gateway pela internet"
  ],
  "correta": 2,
  "explicacao": "Se a questão pede usar a menor banda possível para dezenas de TB, a resposta é Snowball. O Direct Connect leva semanas para ser instalado e ainda transfere pela rede.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Que serviço substitui na VPC um servidor on-premises de inspeção e filtragem de tráfego?",
  "opcoes": [
   "AWS Network Firewall",
   "GuardDuty",
   "Traffic Mirroring",
   "Firewall Manager"
  ],
  "correta": 0,
  "explicacao": "O Network Firewall inspeciona e filtra o tráfego (stateful, IPS, filtro por domínio). O GuardDuty só detecta ameaças e o Traffic Mirroring só copia o tráfego. O Firewall Manager administra regras de vários firewalls em várias contas, mas não inspeciona nada.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como clonar volumes EBS de produção para teste o mais rápido possível, com I/O alto desde o primeiro acesso?",
  "opcoes": [
   "Restaurar em instance store",
   "Criar volumes vazios e depois restaurar",
   "Fast Snapshot Restore + novos volumes a partir dos snapshots",
   "Multi-Attach nos volumes de produção"
  ],
  "correta": 2,
  "explicacao": "O Fast Snapshot Restore entrega o volume já inicializado, com desempenho total imediato. O Multi-Attach faria o teste usar os próprios volumes de produção.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como comparar 2 meses de custo do EC2 por tipo de instância, com o menor esforço?",
  "opcoes": [
   "Cost and Usage Report + QuickSight",
   "AWS Budgets",
   "Cost Explorer com filtros",
   "Painel do Billing"
  ],
  "correta": 2,
  "explicacao": "O Cost Explorer já tem gráficos prontos, com filtros e agrupamento por tipo de instância. CUR + QuickSight funciona, mas dá mais trabalho. O Budgets serve para alertas de orçamento.",
  "essencial": false
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Como levar usuários de um VoIP com UDP para a região de menor latência, com failover automático entre regiões?",
  "opcoes": [
   "NLB + Route 53 por latência + CloudFront",
   "ALB como endpoint do Global Accelerator",
   "NLB como endpoint do Global Accelerator",
   "ALB + Route 53 ponderado + CloudFront"
  ],
  "correta": 2,
  "explicacao": "UDP elimina o ALB e o CloudFront, que só atendem HTTP/HTTPS. O NLB aceita UDP, e o Global Accelerator dá a menor latência com failover entre regiões.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como fazer consultas simples e sob demanda em logs JSON no S3, com o mínimo de mudança?",
  "opcoes": [
   "CloudWatch Logs",
   "Glue + EMR",
   "Redshift",
   "Athena direto no S3"
  ],
  "correta": 3,
  "explicacao": "O Athena roda SQL serverless direto nos arquivos do S3 e cobra por consulta. Se a questão fala em consulta sob demanda em dados no S3, a resposta é Athena.",
  "essencial": true
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Como gerar todos os dias um relatório HTML a partir de uma API e enviar para vários e-mails (dupla)?",
  "opcoes": [
   "EventBridge agendado + Lambda consultando a API, e SES enviando o e-mail",
   "EventBridge + Glue, e SNS enviando o e-mail",
   "Firehose + SNS",
   "S3 + evento para o SNS"
  ],
  "correta": 0,
  "explicacao": "O SES envia e-mails formatados em HTML. O SNS manda só texto simples para assinantes, sem formatação. O Glue é ETL pesado demais para chamar uma API.",
  "essencial": false
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como visualizar dados do S3 e do RDS, com acesso total para a gerência e acesso limitado para o resto da empresa?",
  "opcoes": [
   "Glue ETL + políticas de bucket",
   "Athena federada + políticas de bucket",
   "QuickSight compartilhando dashboards com usuários e grupos",
   "QuickSight compartilhando dashboards com roles IAM"
  ],
  "correta": 2,
  "explicacao": "Os dashboards do QuickSight são compartilhados com usuários e grupos do próprio QuickSight, não com roles IAM.",
  "essencial": false
 },
 {
  "tema": "DR e bancos",
  "pergunta": "Inserts lentos no RDS MySQL com 2 TB de gp2 e milhões de escritas por dia. O problema é o armazenamento. O que resolve?",
  "opcoes": [
   "Instância otimizada para memória",
   "Instância burstable",
   "SSD de IOPS Provisionadas (io1/io2)",
   "Read replicas"
  ],
  "correta": 2,
  "explicacao": "Se o gargalo é o armazenamento, com muita escrita, a resposta é Provisioned IOPS. Mudar a classe da instância não muda o disco, e read replicas só ajudam na leitura.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como garantir capacidade de EC2 em 3 AZs específicas por apenas 1 semana?",
  "opcoes": [
   "Reserved Instances regionais",
   "Capacity Reservation indicando só a região",
   "On-Demand Capacity Reservation na região e nas 3 AZs",
   "Reserved Instances zonais"
  ],
  "correta": 2,
  "explicacao": "A Capacity Reservation garante capacidade em uma AZ específica, sem compromisso de prazo. Reserved Instances exigem 1 ou 3 anos, e as regionais não garantem capacidade.",
  "essencial": false
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Como compartilhar milhões de transações em tempo quase real com vários apps internos, removendo dados sensíveis antes de gravar no DynamoDB?",
  "opcoes": [
   "Lotes no S3 + Lambda",
   "Firehose gravando no DynamoDB e no S3",
   "DynamoDB com regra que remove dados + Streams",
   "Kinesis Data Streams + Lambda + DynamoDB"
  ],
  "correta": 3,
  "explicacao": "O Data Streams aceita vários consumidores em tempo real. O Firehose não grava no DynamoDB e entrega em lotes. O DynamoDB não tem regra para alterar dados na gravação.",
  "essencial": true
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Uma Lambda assinada a um tópico SNS perde dados quando há falha de rede. Como garantir que tudo seja ingerido (dupla)?",
  "opcoes": [
   "Assinar uma fila SQS ao tópico e fazer a Lambda ler da fila",
   "Lambda em várias AZs e com mais memória",
   "Mais throughput provisionado na Lambda",
   "Mais CPU e memória na Lambda"
  ],
  "correta": 0,
  "explicacao": "A fila guarda a mensagem até ela ser processada com sucesso e permite novas tentativas, com DLQ se precisar. A Lambda já roda em várias AZs.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Qual dupla rastreia mudanças de configuração e registra o histórico de chamadas de API?",
  "opcoes": [
   "Config para configuração + CloudTrail para API",
   "Config + CloudWatch",
   "CloudTrail para configuração + CloudWatch para API",
   "CloudTrail para configuração + Config para API"
  ],
  "correta": 0,
  "explicacao": "O Config guarda o estado da configuração ao longo do tempo. O CloudTrail registra quem chamou qual API. O CloudWatch cuida de métricas e logs.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Como dar a instâncias EC2 acesso a um bucket S3?",
  "opcoes": [
   "Grupo IAM anexado à EC2",
   "Política IAM anexada direto à EC2",
   "IAM role (perfil de instância) anexada à EC2",
   "Usuário IAM anexado à EC2"
  ],
  "correta": 2,
  "explicacao": "A EC2 recebe permissões por uma IAM role, por meio do perfil de instância. Grupos e usuários são para pessoas, e uma política não se anexa direto a uma instância.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Arquivos acessados aleatoriamente no 1º ano e raramente depois, com consulta rápida no 1º ano e atraso aceitável depois. Qual a solução mais econômica?",
  "opcoes": [
   "Standard → Deep Archive + metadados no RDS",
   "Intelligent-Tiering → Glacier Flexible Retrieval + Athena e Glacier Select",
   "Glacier Instant Retrieval com tags",
   "Standard → Glacier Instant Retrieval + metadados no S3"
  ],
  "correta": 1,
  "explicacao": "Acesso aleatório pede Intelligent-Tiering. Depois de 1 ano, com atraso aceitável, Glacier Flexible Retrieval. O Athena consulta no S3 e o Glacier Select consulta direto no arquivo. Um RDS só para metadados é infraestrutura a mais.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Como administrar EC2 remotamente e com segurança, com um processo repetível e nativo da AWS?",
  "opcoes": [
   "Chave SSH + bastion host",
   "IAM role + Session Manager",
   "Console serial do EC2",
   "VPN + SSH"
  ],
  "correta": 1,
  "explicacao": "Acesso a EC2 sem gerenciar chaves e sem bastion é Session Manager. A instância precisa de uma IAM role com permissão do Systems Manager.",
  "essencial": false
 },
 {
  "tema": "Segurança",
  "pergunta": "Dados em buckets S3 de duas regiões precisam ser criptografados com a MESMA chave KMS do cliente, com a chave presente nas duas regiões. Como fazer?",
  "opcoes": [
   "Uma chave KMS em cada região + SSE-S3",
   "SSE-S3 com replicação",
   "Uma chave KMS em cada região + SSE-KMS",
   "Chave KMS multi-região + replicação"
  ],
  "correta": 3,
  "explicacao": "Uma chave KMS comum existe em uma só região, então duas chaves são chaves diferentes. A mesma chave em duas regiões só existe como chave multi-região.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Só as EC2 das sub-redes privadas podem acessar o RDS. Como fazer?",
  "opcoes": [
   "Peering entre as sub-redes",
   "Security group do RDS liberando entrada a partir do security group das instâncias privadas",
   "Tabela de rotas sem as sub-redes públicas",
   "Security group negando as instâncias públicas"
  ],
  "correta": 1,
  "explicacao": "Um security group pode usar outro security group como origem. Security group não tem regra de negação, só de permissão. Peering é entre VPCs, e a tabela de rotas de uma VPC sempre tem a rota local.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Como permitir, com menor privilégio, que uma regra do EventBridge invoque uma Lambda?",
  "opcoes": [
   "Função de execução com principal *",
   "Política baseada em recurso na Lambda: lambda:InvokeFunction para events.amazonaws.com",
   "Função de execução com principal lambda.amazonaws.com",
   "Política baseada em recurso com lambda:*"
  ],
  "correta": 1,
  "explicacao": "Quem pode CHAMAR a Lambda fica na política baseada em recurso da própria função. A função de execução é o contrário: o que a Lambda pode fazer. Menor privilégio = só InvokeFunction e só para o EventBridge.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Um certificado emitido por uma CA externa precisa ficar no ALB e ser rotacionado todo ano. O que fazer?",
  "opcoes": [
   "Emitir no ACM e usar a renovação gerenciada",
   "Emitir pela ACM Private CA",
   "Importar no ACM, alertar perto da expiração e rotacionar manualmente"
  ],
  "correta": 2,
  "explicacao": "Certificado de CA externa é importado no ACM, e o ACM não renova certificado importado. Só os emitidos pelo próprio ACM têm renovação automática.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Como avisar a equipe 30 dias antes de certificados importados no ACM expirarem?",
  "opcoes": [
   "Regra dentro do ACM publicando no SNS",
   "Trusted Advisor + alarme do CloudWatch",
   "Regra do AWS Config de expiração + EventBridge + SNS"
  ],
  "correta": 2,
  "explicacao": "O Config tem regra gerenciada que marca certificados perto de expirar como não conformes, e o EventBridge transforma isso em alerta pelo SNS.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como gravar e consultar dados de localização por uma API REST, com a solução mais viável?",
  "opcoes": [
   "API Gateway + Lambda",
   "API Gateway + Kinesis Data Analytics",
   "Athena + S3",
   "QuickSight + Redshift"
  ],
  "correta": 0,
  "explicacao": "API REST serverless = API Gateway + Lambda. O Kinesis Data Analytics analisa streams; ele não atende uma API de gravar e consultar.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual armazenamento é o mais econômico para 900 TB de documentos acessados por EC2 em várias AZs, com picos de demanda?",
  "opcoes": [
   "S3",
   "EFS",
   "EBS",
   "OpenSearch"
  ],
  "correta": 0,
  "explicacao": "S3 escala sem limite e é o mais barato por GB. O EFS também escala e é compartilhado, mas custa bem mais. Muito volume + 'mais econômico' = S3.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Como proteger documentos de auditoria no S3 contra exclusão acidental?",
  "opcoes": [
   "MFA no login dos usuários IAM",
   "Versionamento + MFA delete no bucket",
   "Lifecycle negando DeleteObject",
   "KMS restringindo a chave"
  ],
  "correta": 1,
  "explicacao": "O versionamento guarda as versões antigas e o MFA delete exige um segundo fator para apagar de vez. Lifecycle não nega ações.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Documentos não podem ser alterados nem apagados depois de gravados. O que usar no S3?",
  "opcoes": [
   "Versionamento + ACL só de leitura",
   "Lifecycle para arquivar",
   "EFS montado só para leitura",
   "Versionamento + S3 Object Lock"
  ],
  "correta": 3,
  "explicacao": "Imutável (WORM) = Object Lock. Modo compliance: ninguém apaga, nem o root. Modo governance ou legal hold: só quem tem permissão especial consegue.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Como compartilhar com um parceiro uma AMI cujos snapshots usam chave KMS gerenciada pelo cliente?",
  "opcoes": [
   "Exportar para o S3 do parceiro",
   "launchPermission para a conta do parceiro + key policy liberando a chave para ela",
   "Tornar a AMI e os snapshots públicos",
   "launchPermission + trocar por uma chave do parceiro"
  ],
  "correta": 1,
  "explicacao": "Mesma lógica do snapshot do Aurora: compartilhe o recurso com a conta e libere a chave KMS para essa conta na key policy.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Como proteger APIs do API Gateway em várias contas e regiões contra SQL injection e XSS, com menor esforço administrativo?",
  "opcoes": [
   "Shield nas duas regiões",
   "WAF configurado à mão em cada região",
   "Firewall Manager administrando as regras do WAF de forma central"
  ],
  "correta": 2,
  "explicacao": "SQL injection e XSS = WAF. Várias contas com gestão central = Firewall Manager por cima do WAF.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "SSH da rede da empresa até o bastion, e do bastion às instâncias privadas. Quais regras de security group (dupla)?",
  "opcoes": [
   "Bastion aceita o IP externo da empresa; app aceita SSH do IP privado do bastion",
   "Bastion aceita o IP interno da empresa; app aceita o IP público do bastion",
   "Bastion aceita só as instâncias do app"
  ],
  "correta": 0,
  "explicacao": "Vindo pela internet, a empresa chega com o IP externo (público). Dentro da VPC, o bastion fala com o app pelo IP privado.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "App web público com SQL Server em sub-rede privada. Quais regras de security group (dupla)?",
  "opcoes": [
   "Web: entrada 443 de 0.0.0.0/0; banco: entrada 1433 vinda do SG da web",
   "Web: saída 443 para 0.0.0.0/0; banco: saída para o SG da web",
   "Banco: entrada 443 e 1433 vinda do SG da web"
  ],
  "correta": 0,
  "explicacao": "Pense em entrada: a web recebe HTTPS de todos, e o banco recebe só a porta do SQL Server (1433) vinda do SG da web. Abrir 443 no banco é porta a mais.",
  "essencial": true
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "A fila SQS não tem duplicatas, mas cada mensagem é processada duas vezes. O que resolve com menor esforço?",
  "opcoes": [
   "Ativar long polling",
   "Trocar por fila FIFO",
   "Apagar a mensagem antes de processar",
   "Aumentar o visibility timeout para mais que o tempo de processamento"
  ],
  "correta": 3,
  "explicacao": "Enquanto um consumidor processa, a mensagem fica invisível. Se o processamento passa do visibility timeout, ela reaparece e é processada de novo.",
  "essencial": true
 },
 {
  "tema": "Desacoplamento",
  "pergunta": "Jobs sem estado, guardados de forma durável, com nós adicionados conforme a quantidade de trabalho. Qual design?",
  "opcoes": [
   "SNS + Auto Scaling por CPU",
   "SQS + Auto Scaling pelo número de mensagens na fila",
   "SQS + Auto Scaling por rede",
   "SNS + Auto Scaling por mensagens publicadas"
  ],
  "correta": 1,
  "explicacao": "Durável = SQS, porque o SNS não guarda mensagens. Escalar pela quantidade de trabalho = tamanho da fila.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como mandar logs do CloudWatch Logs para o OpenSearch em quase tempo real com MENOR esforço?",
  "opcoes": [
   "Lambda acionada pelo grupo de logs",
   "Firehose com o grupo de logs como fonte",
   "Kinesis Agent nos servidores",
   "Assinatura (subscription) do CloudWatch Logs para o OpenSearch"
  ],
  "correta": 3,
  "explicacao": "O CloudWatch Logs tem assinatura nativa que transmite direto para o OpenSearch. Não há nada a construir.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Qual modo do DynamoDB para tráfego imprevisível, com picos súbitos e manhãs sem uso?",
  "opcoes": [
   "Provisionado com auto scaling",
   "On-demand",
   "Provisionado como tabela global"
  ],
  "correta": 1,
  "explicacao": "Imprevisível + picos súbitos + períodos ociosos = on-demand. O auto scaling do provisionado reage devagar a picos. Tráfego previsível é que vai para provisionado.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Como converter PDFs em JPG para 700 mil usuários, de forma escalável e mais econômica?",
  "opcoes": [
   "Beanstalk com EBS",
   "S3 + evento de PUT invocando Lambda, salvando no S3",
   "DynamoDB Streams + Lambda",
   "Beanstalk com EFS"
  ],
  "correta": 1,
  "explicacao": "Arquivo enviado + processamento simples = evento do S3 chamando Lambda. Arquivo fica no S3; o DynamoDB aceita no máximo 400 KB por item.",
  "essencial": true
 },
 {
  "tema": "Rede e borda",
  "pergunta": "DNS autogerenciado atrás de NLBs em duas regiões. Como rotear para todas as instâncias com melhor desempenho e disponibilidade?",
  "opcoes": [
   "Route 53 por latência + ALB + CloudFront",
   "Global Accelerator com os dois NLBs como endpoints",
   "Route 53 por geolocalização + CloudFront"
  ],
  "correta": 1,
  "explicacao": "DNS usa UDP, então CloudFront e ALB saem. NLBs em várias regiões + desempenho = Global Accelerator.",
  "essencial": true
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Site dinâmico em servidores próprios nos EUA precisa carregar rápido na Europa em poucos dias, com o backend nos EUA. O que usar?",
  "opcoes": [
   "Mover para o S3 com replicação entre regiões",
   "CloudFront com origem personalizada apontando para os servidores locais",
   "EC2 em us-east-1",
   "Route 53 por geoproximidade"
  ],
  "correta": 1,
  "explicacao": "O CloudFront aceita origem fora da AWS (custom origin) e acelera também conteúdo dinâmico. É o mais rápido de implantar.",
  "essencial": true
 },
 {
  "tema": "Segurança",
  "pergunta": "Como proteger um site em EC2 contra DDoS grande, de milhares de IPs, sem downtime (dupla)?",
  "opcoes": [
   "CloudFront na frente + Shield Advanced",
   "GuardDuty bloqueando os atacantes",
   "Spot com Auto Scaling",
   "Lambda atualizando NACLs"
  ],
  "correta": 0,
  "explicacao": "O CloudFront absorve o tráfego na borda e o Shield Advanced protege contra DDoS, com equipe de resposta. O GuardDuty só detecta, não bloqueia.",
  "essencial": true
 },
 {
  "tema": "Migração",
  "pergunta": "Como enviar 10 TB por dia de uma SAN local para o S3, com transferência segura e o mais confiável possível?",
  "opcoes": [
   "DataSync pela internet",
   "DMS sobre Direct Connect",
   "DataSync sobre Direct Connect"
  ],
  "correta": 2,
  "explicacao": "Arquivos = DataSync; o DMS é para bancos de dados. Confiável e seguro todo dia = Direct Connect, que não depende da internet.",
  "essencial": true
 },
 {
  "tema": "Migração",
  "pergunta": "Como migrar 200 GB de um servidor SFTP com NFS local para uma EC2 com EFS, de forma automatizada (dupla)?",
  "opcoes": [
   "Agente DataSync no data center + EC2 na mesma AZ do EFS",
   "DataSync configurado direto no servidor SFTP + EBS extra",
   "Cópia manual pelo sistema operacional"
  ],
  "correta": 0,
  "explicacao": "O DataSync precisa de um agente local para ler o NFS e grava no EFS. A EC2 é lançada na mesma AZ do sistema de arquivos.",
  "essencial": true
 },
 {
  "tema": "Compute, S3 e dados",
  "pergunta": "Produção ligada 24 horas e dev/teste desligados fora do expediente. Qual compra de EC2 é a mais econômica?",
  "opcoes": [
   "On-Demand na produção, Spot blocks em dev/teste",
   "Spot na produção, reservadas em dev/teste",
   "Reservadas na produção, On-Demand em dev/teste"
  ],
  "correta": 2,
  "explicacao": "Uso contínuo = reservada. Uso parcial que vai ser desligado = On-Demand, porque reservada cobra mesmo desligada. Spot não serve para produção que não pode cair.",
  "essencial": true
 },
 {
  "tema": "Rede e borda",
  "pergunta": "Apps em EC2 precisam usar a API do S3 sem nenhum tráfego pela internet. O que fazer?",
  "opcoes": [
   "Criar o bucket em uma sub-rede privada",
   "Configurar um gateway endpoint do S3",
   "Configurar um NAT gateway na mesma sub-rede"
  ],
  "correta": 1,
  "explicacao": "O NAT gateway sai pela internet, e bucket não fica em sub-rede. S3 sem passar pela internet = gateway endpoint.",
  "essencial": true
 }
];
