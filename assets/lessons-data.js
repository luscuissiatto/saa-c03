/* Aulas animadas.
   Cada aula:
     t     título            cat  categoria (agrupa a lista)
     n     caixas do diagrama: id: [x, y, largura, altura, tipo, título, subtítulo]
           tipo: user, compute, db, storage, net, sec, int, mon, onprem, note, zone
           (zone = área tracejada, como VPC, AZ ou sub-rede)
     sc    cenas: t título da cena, c explicação,
                  s caixas visíveis (se omitido, repete a cena anterior; '*' = todas),
                  hl destaque, x riscadas, f setas [de, para, tipo, rótulo]
                  tipos de seta: ok (tráfego), alt (réplica ou alternativa), no (bloqueado)
     regras  cola final: [gatilho no enunciado, resposta]
     q     pergunta final {q, o: opções, c: índice certo, e: explicação}
   O diagrama usa um espaço de 640 × 380. */
window.LESSONS = [

/* ───────────── SEGURANÇA ───────────── */
{t:"IAM: usuários, roles e políticas", cat:"Segurança",
 n:{dev:[20,40,160,52,"user","Pessoa","usuário IAM + MFA"],
    grp:[20,150,160,52,"sec","Grupo IAM","política anexada"],
    ec2:[20,270,160,52,"compute","EC2","app rodando"],
    scp:[240,150,160,52,"sec","SCP","limite da conta"],
    role:[240,270,160,52,"sec","IAM role","credencial temporária"],
    acc:[460,40,165,52,"user","Outra conta","acesso entre contas"],
    s3:[460,150,165,52,"storage","Bucket S3",""],
    bp:[460,270,165,52,"sec","Bucket policy","política de recurso"]},
 sc:[
  {t:"Pessoas entram como usuário IAM",c:"Cada pessoa tem seu usuário com MFA. As permissões vêm de políticas, de preferência anexadas a um grupo, e não usuário por usuário.",s:"dev grp",hl:"grp",f:[["dev","grp","ok","membro de"]]},
  {t:"Política diz o que é permitido",c:"É um JSON com Effect, Action e Resource. Tudo começa negado; um Deny explícito sempre vence qualquer Allow.",s:"dev grp s3",f:[["dev","grp","ok"],["grp","s3","ok","s3:GetObject"]]},
  {t:"Aplicação usa IAM role, nunca chave",c:"EC2, Lambda e ECS recebem uma IAM role. Ela entrega credenciais temporárias que giram sozinhas, sem chave de acesso no código.",s:"dev grp s3 ec2 role",hl:"role",f:[["ec2","role","ok","assume"],["role","s3","ok","lê"]]},
  {t:"Política de recurso: quem pode entrar",c:"Bucket policy, política de fila SQS, de chave KMS e de Lambda ficam no próprio recurso e dizem quem pode acessá-lo, inclusive outra conta.",s:"dev grp s3 ec2 role acc bp",hl:"bp",f:[["acc","s3","ok","entre contas"],["bp","s3","alt","protege"]]},
  {t:"SCP é o teto da conta",c:"Nas AWS Organizations, a SCP limita o máximo que alguém pode fazer na conta, até o root. Ela não dá permissão: só corta.",s:"*",hl:"scp",f:[["scp","grp","no","limita"],["scp","role","no"]]}],
 regras:[["Aplicação acessando serviço AWS","IAM role (nunca chave no código)"],["Allow e Deny em conflito","Deny explícito vence"],["Dar acesso a outra conta","Role assumível ou política de recurso"],["Limitar o que contas inteiras podem fazer","SCP nas AWS Organizations"],["Várias pessoas com as mesmas permissões","Grupo IAM"]],
 q:{q:"Um app em EC2 precisa ler uma tabela do DynamoDB. Qual é a forma mais segura?",o:["Chave de acesso de um usuário IAM no código","IAM role anexada à instância","Chave guardada num arquivo criptografado no disco"],c:1,e:"A role entrega credenciais temporárias que giram sozinhas. Chave fixa no código ou no disco pode vazar."}},

{t:"Security group ou NACL?", cat:"Segurança",
 n:{pu:[130,40,150,300,"zone","Sub-rede pública"],pr:[300,40,150,300,"zone","Sub-rede privada"],dz:[470,40,160,300,"zone","Sub-rede de dados"],
    usr:[10,90,110,52,"user","Usuário"],web:[145,90,120,52,"compute","Web","SG-web"],app:[315,230,120,52,"compute","App","SG-app"],db:[485,160,130,52,"db","RDS","SG-db"]},
 sc:[
  {t:"Cada recurso tem um security group",c:"Aplicação em três camadas. O security group é o firewall de cada instância ou banco.",s:"*",f:[["usr","web","ok"],["web","app","ok"],["app","db","ok"]]},
  {t:"Um SG pode apontar para outro SG",c:"A regra do SG-db libera a porta 3306 vinda do SG-app. Só a camada de aplicação chega ao banco, mesmo que os IPs mudem.",hl:"db app",f:[["app","db","ok","porta 3306"],["web","db","no"]]},
  {t:"SG: só permite e lembra a conexão",c:"Security group só tem regra de permissão e é stateful: se a entrada foi permitida, a resposta volta sozinha.",hl:"web app db",f:[["usr","web","ok"],["web","app","ok"],["app","db","ok"]]},
  {t:"NACL: o firewall da sub-rede",c:"A NACL vale para a sub-rede inteira, tem regras de permitir e de negar, numeradas, e é stateless: libere a ida e a volta.",hl:"pu pr dz",f:[["usr","web","ok"]]},
  {t:"Bloquear um IP? NACL",c:"Security group não sabe negar. Para bloquear um IP ou faixa específica, use a NACL, ou o WAF se for tráfego HTTP.",hl:"pu",f:[["usr","web","no","IP bloqueado"]]}],
 regras:[["Firewall da instância","Security group (stateful, só permite)"],["Firewall da sub-rede","NACL (stateless, permite e nega)"],["Bloquear um IP específico","NACL, ou WAF para HTTP"],["Só a camada de app acessa o banco","SG do banco com o SG do app como origem"]],
 q:{q:"Como garantir que só os servidores de aplicação acessem o RDS?",o:["NACL negando a sub-rede pública","Security group do RDS com o security group do app como origem","Tabela de rotas sem a rota para a sub-rede pública"],c:1,e:"Um security group pode referenciar outro. A tabela de rotas sempre tem a rota local da VPC, então não isola sub-redes."}},

{t:"Criptografia: KMS, ACM e segredos", cat:"Segurança",
 n:{app:[20,50,150,52,"compute","App",""],s3:[245,50,150,52,"storage","Bucket S3",""],kms:[470,50,155,52,"sec","AWS KMS","chave do cliente"],
    cli:[20,175,150,52,"user","Cliente","navegador"],cert:[245,175,150,52,"sec","ACM","certificado TLS"],alb:[470,175,155,52,"net","ALB","termina o HTTPS"],
    sm:[245,295,150,52,"sec","Secrets Manager","senha do banco"],rds:[470,295,155,52,"db","RDS",""]},
 sc:[
  {t:"Em repouso, o padrão é SSE-S3",c:"O S3 já criptografa tudo com SSE-S3: a AWS cuida da chave. Simples, mas você não controla nem audita a chave.",s:"app s3",f:[["app","s3","ok","PUT"]]},
  {t:"Quer controlar a chave? SSE-KMS",c:"Com SSE-KMS a chave fica no KMS: a key policy define quem pode usá-la, ela pode girar todo ano e cada uso aparece no CloudTrail.",s:"app s3 kms",hl:"kms",f:[["app","s3","ok"],["s3","kms","alt","usa a chave"]]},
  {t:"Recusar upload sem criptografia",c:"A bucket policy nega PutObject sem o cabeçalho x-amz-server-side-encryption. Para exigir HTTPS, nega quando aws:SecureTransport é false.",hl:"s3",f:[["app","s3","no","sem cabeçalho"]]},
  {t:"Em trânsito: certificado do ACM",c:"O ACM emite certificados grátis e renova sozinho os que ele emitiu. Certificado importado de outra CA não renova: a troca é manual.",s:"app s3 kms cli cert alb",hl:"cert",f:[["cli","alb","ok","HTTPS"],["cert","alb","alt","instala"]]},
  {t:"Senha de banco: Secrets Manager",c:"Guarda a senha e gira automaticamente para RDS e Aurora. O Parameter Store guarda configurações, mas não gira senhas sozinho.",s:"*",hl:"sm",f:[["sm","rds","ok","rotação"]]}],
 regras:[["Controlar e auditar quem usa a chave","SSE-KMS com chave do cliente"],["Recusar upload sem criptografia","Bucket policy exigindo x-amz-server-side-encryption"],["Mesma chave em duas regiões","Chave KMS multi-região"],["Senha de banco com rotação automática","Secrets Manager"],["Certificado de uma CA externa","Importar no ACM e renovar manualmente"]],
 q:{q:"A segurança quer controlar quem usa a chave dos objetos no S3 e auditar cada uso. Qual opção?",o:["SSE-S3","SSE-KMS com chave gerenciada pelo cliente","Apenas HTTPS no envio"],c:1,e:"Com SSE-KMS você define a key policy e cada uso da chave fica registrado no CloudTrail. HTTPS protege só o trânsito."}},

{t:"Quem registra e quem protege?", cat:"Segurança",
 n:{act:[15,164,130,52,"user","Alguém","usuário ou role"],api:[180,164,155,52,"note","Chamada de API",""],res:[370,164,125,52,"compute","Recurso","EC2, S3, SG…"],
    ct:[180,40,155,52,"mon","CloudTrail","quem fez e quando"],cfg:[330,290,150,52,"mon","Config","o que mudou"],cw:[500,40,130,52,"mon","CloudWatch","métricas e logs"],
    gd:[15,290,150,52,"sec","GuardDuty","ameaças"],ins:[500,290,130,52,"sec","Inspector","vulnerabilidades"]},
 sc:[
  {t:"Uma mudança, vários registros",c:"Alguém altera um security group. Cada serviço enxerga esse mesmo fato de um jeito diferente.",s:"act api res",f:[["act","api","ok"],["api","res","ok"]]},
  {t:"CloudTrail: quem fez",c:"Registra cada chamada de API: quem, quando, de onde e o quê. Responde à pergunta “quem apagou isso?”.",s:"act api res ct",hl:"ct",f:[["act","api","ok"],["api","res","ok"],["api","ct","ok","registra"]]},
  {t:"Config: o que mudou e se está na regra",c:"Guarda a configuração de cada recurso ao longo do tempo e avalia regras, como “todo bucket criptografado” ou “toda instância com tag”.",s:"act api res ct cfg",hl:"cfg",f:[["act","api","ok"],["api","res","ok"],["res","cfg","ok","histórico"]]},
  {t:"CloudWatch: desempenho",c:"Métricas, logs e alarmes, como CPU acima de 80%. É monitoramento, não auditoria.",s:"act api res ct cfg cw",hl:"cw",f:[["act","api","ok"],["api","res","ok"],["res","cw","ok","métricas"]]},
  {t:"Os detectores",c:"GuardDuty acha ameaças nos logs, Inspector acha vulnerabilidades em EC2, containers e Lambda, e Macie acha dados pessoais no S3.",s:"*",hl:"gd ins",f:[["ct","gd","alt","analisa"],["ins","res","alt","escaneia"]]}],
 regras:[["Quem fez a chamada de API","CloudTrail"],["Histórico de configuração e conformidade","AWS Config"],["CPU alta, alarme, logs da aplicação","CloudWatch"],["Atividade suspeita na conta","GuardDuty"],["Vulnerabilidades em EC2 e containers","Inspector"],["Dados pessoais (PII) no S3","Macie"]],
 q:{q:"A empresa quer detectar automaticamente recursos sem as tags obrigatórias. Qual serviço?",o:["CloudTrail","Regras do AWS Config","CloudWatch"],c:1,e:"Avaliar se a configuração de um recurso segue uma regra é trabalho do Config."}},

/* ───────────── REDE ───────────── */
{t:"Gateways de rede: qual porta é qual?", cat:"Rede",
 n:{vpc:[130,15,350,350,"zone","VPC"],pub:[140,88,155,108,"zone","Sub-rede pública"],prv:[140,214,155,140,"zone","Sub-rede privada"],
    net:[10,25,110,48,"user","Internet"],igw:[300,25,160,48,"net","Internet gateway","porta da VPC"],
    nat:[150,122,135,52,"net","NAT gateway","só saída"],ec2:[150,262,115,52,"compute","EC2",""],
    gwe:[300,122,160,52,"net","Gateway endpoint","rota grátis"],vgw:[300,262,160,52,"net","Virtual private gw","ponta da VPN"],
    s3:[490,122,148,52,"storage","S3 e DynamoDB"],tgw:[490,212,148,52,"net","Transit Gateway","hub central"],onp:[490,300,148,52,"onprem","On-premises","seu data center"],
    v2:[300,25,160,48,"svc","Outras VPCs","outras contas"]},
 sc:[
  {t:"Sub-rede privada não fala com ninguém",c:"Uma EC2 em sub-rede privada não alcança nada fora da VPC. Cada gateway abre um caminho diferente.",s:"vpc prv ec2 net",f:[["ec2","net","no"]]},
  {t:"Internet gateway: entra e sai",c:"É a porta da VPC para a internet, nos dois sentidos. Uma sub-rede é pública porque a rota 0.0.0.0/0 dela aponta para o IGW.",s:"vpc pub prv igw net ec2",hl:"igw",f:[["net","igw","ok","entra e sai"],["igw","pub","ok"]]},
  {t:"NAT gateway: só sai",c:"Fica na sub-rede pública e usa o IGW. A instância privada acessa a internet, mas ninguém de fora inicia conexão com ela.",s:"vpc pub prv igw net nat ec2",hl:"nat",f:[["ec2","nat","ok"],["nat","igw","ok"],["igw","net","ok"]]},
  {t:"Gateway endpoint: S3 sem internet",c:"O “VPC gateway” das questões. É uma rota grátis para S3 e DynamoDB que não passa pela internet nem pelo NAT.",s:"vpc pub prv igw net nat ec2 gwe s3",hl:"gwe",f:[["ec2","gwe","ok"],["gwe","s3","ok"]]},
  {t:"Virtual private gateway: seu data center",c:"É a ponta do lado da AWS numa VPN site-to-site ou no Direct Connect. Do lado de lá fica o customer gateway.",s:"vpc pub prv igw net nat ec2 gwe s3 vgw onp",hl:"vgw",f:[["ec2","vgw","ok"],["vgw","onp","ok"]]},
  {t:"Transit Gateway: o hub",c:"Liga dezenas de VPCs e o on-premises num ponto só. Substitui a malha de VPC peering, que não é transitiva.",s:"vpc pub prv ec2 tgw onp v2",hl:"tgw",f:[["ec2","tgw","ok","anexo"],["tgw","onp","ok"],["tgw","v2","ok"]]}],
 regras:[["Sub-rede pública","Rota para o internet gateway"],["Privada acessa a internet sem receber conexões","NAT gateway na sub-rede pública"],["S3 ou DynamoDB sem passar pela internet","Gateway endpoint"],["VPN com o data center","Virtual private gateway (ou Transit Gateway)"],["Muitas VPCs interligadas","Transit Gateway"]],
 q:{q:"Instâncias privadas precisam baixar atualizações da internet sem aceitar conexões de fora. O que usar?",o:["Internet gateway ligado à sub-rede privada","NAT gateway na sub-rede pública","Gateway endpoint"],c:1,e:"NAT é só saída. Ligar o IGW tornaria a sub-rede pública, e o gateway endpoint só chega ao S3 e ao DynamoDB."}},

{t:"Endpoints: serviço AWS sem internet", cat:"Rede",
 n:{vpc:[135,20,340,340,"zone","VPC"],pub:[145,58,150,122,"zone","Sub-rede pública"],prv:[145,222,150,122,"zone","Sub-rede privada"],
    net:[10,100,110,52,"user","Internet"],nat:[155,104,130,52,"net","NAT gateway"],ec2:[155,268,130,52,"compute","EC2"],
    gwe:[305,104,165,52,"net","Gateway endpoint","rota, grátis"],ife:[305,268,165,52,"net","Interface endpoint","placa de rede, pago"],
    s3:[485,104,150,52,"storage","S3 e DynamoDB"],oth:[485,268,150,52,"svc","Outros serviços","SQS, KMS…"]},
 sc:[
  {t:"O caminho caro: pelo NAT",c:"Sem endpoint, a instância privada chega ao S3 pelo NAT gateway. Funciona, mas sai pela internet e cada GB processado é cobrado.",s:"vpc pub prv ec2 nat net s3",f:[["ec2","nat","alt"],["nat","s3","alt","cobra por GB"]]},
  {t:"Gateway endpoint: rota grátis",c:"Uma entrada na tabela de rotas, sem custo, direto pela rede da AWS. Existe só para S3 e DynamoDB.",s:"vpc pub prv ec2 nat s3 gwe",hl:"gwe",f:[["ec2","gwe","ok"],["gwe","s3","ok"]]},
  {t:"Interface endpoint: todo o resto",c:"Para SQS, KMS, Secrets Manager, API Gateway privado e quase todo outro serviço: uma placa de rede com IP privado na sub-rede. É pago.",s:"vpc pub prv ec2 nat s3 gwe ife oth",hl:"ife",f:[["ec2","gwe","ok"],["gwe","s3","ok"],["ec2","ife","ok"],["ife","oth","ok"]]},
  {t:"Nome técnico: PrivateLink",c:"Interface endpoint é o PrivateLink. Ele também expõe um serviço seu para outras VPCs ou contas, sem peering.",hl:"ife oth",f:[["ec2","ife","ok"],["ife","oth","ok","PrivateLink"]]}],
 regras:[["S3 ou DynamoDB sem internet e sem custo","Gateway endpoint"],["Outro serviço AWS sem internet","Interface endpoint (PrivateLink)"],["Conta alta de NAT por tráfego ao S3","Gateway endpoint do S3"],["Expor serviço para outra VPC sem peering","PrivateLink"]],
 q:{q:"Instâncias privadas baixam muitos dados do S3 por um NAT gateway e a conta subiu. O que fazer?",o:["Criar um NAT gateway por AZ","Criar um gateway endpoint para o S3","Trocar o NAT gateway por uma instância NAT"],c:1,e:"O gateway endpoint não tem custo e tira o tráfego do S3 de dentro do NAT."}},

{t:"Load balancers: ALB, NLB ou GWLB?", cat:"Rede",
 n:{cli:[15,164,125,52,"user","Clientes"],
    alb:[190,40,185,52,"net","ALB","camada 7: HTTP"],nlb:[190,164,185,52,"net","NLB","camada 4: TCP e UDP"],gwlb:[190,288,185,52,"net","Gateway LB","camada 3: appliances"],
    t1:[440,20,190,46,"compute","Serviço A","/api"],t2:[440,76,190,46,"compute","Serviço B","/img"],
    n1:[440,164,190,52,"compute","Frota EC2","IP fixo por AZ"],fw:[440,288,190,52,"sec","Firewall","de terceiros"]},
 sc:[
  {t:"Três load balancers, três camadas",c:"Todos distribuem tráfego entre alvos saudáveis em várias AZs. A pergunta da prova é em que camada você precisa decidir.",s:"cli alb nlb gwlb"},
  {t:"ALB: decide pelo conteúdo HTTP",c:"Lê caminho, host e cabeçalhos: /api vai para um serviço e /img para outro. Integra com WAF, Cognito e Lambda.",s:"cli alb nlb gwlb t1 t2",hl:"alb",f:[["cli","alb","ok"],["alb","t1","ok","/api"],["alb","t2","ok","/img"]]},
  {t:"NLB: TCP, UDP e IP fixo",c:"Trabalha na camada 4, aguenta milhões de requisições por segundo com latência mínima, tem IP estático por AZ e aceita UDP.",s:"cli alb nlb gwlb t1 t2 n1",hl:"nlb",f:[["cli","nlb","ok"],["nlb","n1","ok"]]},
  {t:"GWLB: firewall de terceiros",c:"Passa o tráfego por firewalls e IDS do Marketplace antes de chegar à aplicação. Se o enunciado fala em appliance, é ele.",s:"*",hl:"gwlb",f:[["cli","gwlb","ok"],["gwlb","fw","ok","inspeção"]]},
  {t:"Health check e sessão",c:"Alvo que falha no health check sai do rodízio. Sticky session prende o usuário a uma instância; melhor guardar a sessão no ElastiCache ou DynamoDB.",s:"*",hl:"t1 t2",f:[["cli","alb","ok"],["alb","t1","ok"],["alb","t2","alt","saudável?"]]}],
 regras:[["Rotear por caminho ou host (/api, /img)","ALB"],["UDP, IP fixo ou latência ultrabaixa","NLB"],["Firewall ou IDS de terceiros","Gateway Load Balancer"],["Proteger HTTP contra SQL injection","WAF no ALB ou no CloudFront"]],
 q:{q:"Uma aplicação TCP precisa de IP estático por AZ e latência muito baixa. Qual load balancer?",o:["ALB","NLB","Gateway Load Balancer"],c:1,e:"IP fixo, TCP/UDP e latência mínima são características do NLB."}},

{t:"CloudFront ou Global Accelerator?", cat:"Rede",
 n:{u:[15,164,120,52,"user","Usuários","no mundo todo"],cf:[180,70,180,52,"net","CloudFront","cache, só HTTP/S"],ga:[180,258,180,52,"net","Global Accelerator","TCP e UDP, IP fixo"],
    s3:[440,24,180,52,"storage","S3","conteúdo estático"],alb:[440,112,180,52,"net","ALB","conteúdo dinâmico"],
    n1:[440,214,180,52,"net","NLB","região A"],n2:[440,302,180,52,"net","NLB","região B"]},
 sc:[
  {t:"Longe da região, tudo fica lento",c:"Usuários do outro lado do mundo sofrem com a latência até a região da aplicação.",s:"u s3 alb",f:[["u","alb","alt","longe e lento"]]},
  {t:"CloudFront: cache perto do usuário",c:"Guarda cópias nas localizações de borda. Uma distribuição aceita várias origens: S3 para o estático e ALB para o dinâmico.",s:"u cf s3 alb",hl:"cf",f:[["u","cf","ok"],["cf","s3","ok","/static"],["cf","alb","ok","/*"]]},
  {t:"O que vem junto com o CloudFront",c:"URLs assinadas para conteúdo restrito, WAF e Shield contra ataques, Lambda@Edge para mudar conteúdo e transferência do S3 para ele sem custo.",hl:"cf",f:[["u","cf","ok"],["cf","s3","ok"],["cf","alb","ok"]]},
  {t:"Global Accelerator: rota rápida, sem cache",c:"Dá dois IPs fixos e leva o tráfego pela rede da AWS até a região mais próxima. Aceita TCP e UDP: jogos, VoIP e IoT.",s:"u ga n1 n2",hl:"ga",f:[["u","ga","ok"],["ga","n1","ok"]]},
  {t:"Região caiu? Desvia em segundos",c:"O Global Accelerator troca de região sozinho. E lembre: com UDP, ALB e CloudFront estão fora, então o endpoint é um NLB.",hl:"n2",x:"n1",f:[["u","ga","ok"],["ga","n2","ok","failover"]]}],
 regras:[["Cache de conteúdo estático ou vídeo","CloudFront"],["Conteúdo restrito a usuários pagantes","CloudFront com URLs ou cookies assinados"],["UDP, jogos, VoIP ou IoT","Global Accelerator com NLB"],["IPs fixos globais e failover entre regiões","Global Accelerator"],["Origem fora da AWS (servidor próprio)","CloudFront com origem personalizada"]],
 q:{q:"Um serviço de VoIP com UDP em várias regiões precisa de menor latência e failover automático. Qual combinação?",o:["CloudFront com ALB","Global Accelerator com NLB","Route 53 ponderado com ALB"],c:1,e:"UDP pede NLB, e o Global Accelerator escolhe a região mais próxima e faz o failover."}},

{t:"Route 53: políticas de roteamento", cat:"Rede",
 n:{usr:[20,164,130,52,"user","Usuário","consulta o DNS"],r53:[205,164,160,52,"net","Route 53","DNS"],
    us:[430,40,200,52,"compute","us-east-1","primária"],eu:[430,164,200,52,"compute","eu-west-1","secundária"],sa:[430,288,200,52,"compute","sa-east-1","São Paulo"]},
 sc:[
  {t:"O DNS escolhe o destino",c:"O Route 53 é o DNS da AWS. A política de roteamento decide qual endereço ele devolve para cada consulta.",s:"usr r53 us",f:[["usr","r53","ok","consulta"],["r53","us","ok"]]},
  {t:"Simple e Weighted",c:"Simple devolve um destino. Weighted divide por pesos, como 90% e 10%, para testar uma versão nova aos poucos.",s:"usr r53 us eu",hl:"r53",f:[["usr","r53","ok"],["r53","us","ok","90%"],["r53","eu","alt","10%"]]},
  {t:"Latency e Geolocation",c:"Latency manda para a região mais rápida para aquele usuário. Geolocation decide pelo país ou continente de origem, útil para idioma ou lei local.",s:"*",hl:"sa",f:[["usr","r53","ok"],["r53","sa","ok","menor latência"]]},
  {t:"Failover com health check",c:"Health checks vigiam a primária. Se ela falha, o Route 53 passa a responder com a secundária: ativo-passivo.",hl:"eu",x:"us",f:[["r53","us","no","falhou"],["r53","eu","ok","assume"]]},
  {t:"Alias para recursos da AWS",c:"O registro Alias aponta para ALB, CloudFront ou S3, funciona no domínio raiz (exemplo.com) e não cobra a consulta. CNAME não funciona na raiz.",hl:"r53",f:[["r53","us","ok","Alias"]]}],
 regras:[["Testar versão nova com parte do tráfego","Weighted"],["Melhor desempenho para usuários no mundo todo","Latency"],["Conteúdo por país ou idioma","Geolocation"],["Ativo-passivo entre regiões","Failover com health check"],["Domínio raiz apontando para ALB","Registro Alias"]],
 q:{q:"Usuários da Europa devem ser atendidos por eu-west-1 por causa de leis locais. Qual política?",o:["Latency","Geolocation","Weighted"],c:1,e:"Quando a origem do usuário decide o destino, a política é Geolocation. Latency poderia mandá-lo para outra região mais rápida."}},

{t:"Gateways que não são de rede", cat:"Rede",
 n:{cli:[8,40,145,52,"user","Cliente","app ou celular"],apg:[178,40,160,52,"net","API Gateway","porta das APIs"],lam:[360,40,125,52,"compute","Lambda"],ddb:[505,40,125,52,"db","DynamoDB"],
    srv:[8,164,145,52,"onprem","Servidor local","NFS, SMB, iSCSI"],sgw:[178,164,160,52,"storage","Storage Gateway","disco local → AWS"],s3:[360,164,125,52,"storage","S3"],
    trf:[8,288,145,52,"user","Tráfego","de entrada"],glb:[178,288,160,52,"net","Gateway LB","balanceia appliances"],fw:[360,288,125,52,"sec","Firewall","de terceiros"],app:[505,288,125,52,"compute","App"]},
 sc:[
  {t:"Três “gateways” sem rota de VPC",c:"Esses três têm gateway no nome mas não mexem nas rotas da VPC. Pense em cada um pelo que entra e pelo que sai.",s:"cli apg srv sgw trf glb"},
  {t:"API Gateway: porta das APIs",c:"Recebe chamadas HTTP, REST ou WebSocket, autentica, limita a taxa e chama a Lambda. HTTPS serverless é API Gateway.",s:"cli apg lam ddb srv sgw trf glb",hl:"apg",f:[["cli","apg","ok","HTTPS"],["apg","lam","ok"],["lam","ddb","ok"]]},
  {t:"Storage Gateway: disco local na AWS",c:"Servidor no seu data center que fala NFS, SMB ou iSCSI e guarda na AWS. File grava no S3, Volume guarda blocos e Tape substitui fitas.",s:"cli apg lam ddb srv sgw s3 trf glb",hl:"sgw",f:[["srv","sgw","ok"],["sgw","s3","ok"]]},
  {t:"Gateway Load Balancer: appliances",c:"Distribui o tráfego entre firewalls e IDS de terceiros. Tudo passa pelo appliance antes de chegar à aplicação.",s:"*",hl:"glb",f:[["trf","glb","ok"],["glb","fw","ok","inspeção"],["fw","app","ok"]]}],
 regras:[["Endpoint HTTPS serverless que chama Lambda","API Gateway"],["Servidores locais usando arquivos guardados na AWS","Storage Gateway (File Gateway)"],["Substituir fitas de backup","Tape Gateway"],["Firewall de terceiros na VPC","Gateway Load Balancer"]],
 q:{q:"Um app móvel precisa de um endpoint HTTPS serverless que execute funções Lambda. Qual serviço?",o:["NAT gateway","API Gateway","Storage Gateway"],c:1,e:"O API Gateway recebe as chamadas HTTPS e invoca a Lambda."}},

/* ───────────── RESILIÊNCIA ───────────── */
{t:"RDS: Multi-AZ ou read replica?", cat:"Resiliência",
 n:{app:[25,92,145,56,"compute","App","grava transações"],rep:[25,250,145,56,"user","Relatórios","consultas pesadas"],
    za:[200,30,200,320,"zone","AZ a"],zb:[420,30,200,320,"zone","AZ b"],
    pri:[225,90,150,56,"db","Primário","lê e grava"],sb:[445,90,150,56,"db","Standby","não atende"],rr:[445,250,150,56,"db","Read replica","só leitura"]},
 sc:[
  {t:"Só o primário grava",c:"É a única instância que aceita escrita. Tudo o que o app grava passa por ela.",s:"app za pri",hl:"pri",f:[["app","pri","ok"]]},
  {t:"Multi-AZ: um reserva em outra AZ",c:"O standby recebe cada escrita ao mesmo tempo (replicação síncrona), mas não atende nenhuma consulta. Ele só espera.",s:"app za zb pri sb",hl:"sb",f:[["app","pri","ok"],["pri","sb","alt","síncrona"]]},
  {t:"Primário caiu? Failover automático",c:"O RDS promove o standby e o endereço do banco continua o mesmo. Multi-AZ é alta disponibilidade, não desempenho.",hl:"sb",x:"pri",f:[["app","sb","ok","failover"]]},
  {t:"Relatórios deixando tudo lento",c:"Consultas pesadas no primário disputam a máquina com as transações, e as escritas demoram.",s:"app rep za zb pri sb",hl:"pri",f:[["app","pri","ok"],["rep","pri","no","lento"],["pri","sb","alt"]]},
  {t:"Read replica: escala a leitura",c:"Cópia assíncrona que aceita consultas. Os relatórios vão para ela e o primário fica livre. Pode até ficar em outra região.",s:"*",hl:"rr",f:[["app","pri","ok"],["pri","sb","alt"],["pri","rr","alt","assíncrona"],["rep","rr","ok"]]}],
 regras:[["Alta disponibilidade e failover automático","Multi-AZ"],["Relatórios ou muita leitura deixando o banco lento","Read replica"],["Réplicas que também fazem failover","Aurora Replicas"],["Muitas conexões de Lambda estourando o banco","RDS Proxy"],["MySQL/PostgreSQL entre regiões com RPO de segundos","Aurora Global Database"]],
 q:{q:"O banco fica lento sempre que rodam os relatórios mensais. O que resolve?",o:["Ativar Multi-AZ","Criar uma read replica e apontar os relatórios para ela","Ativar o RDS Proxy"],c:1,e:"Relatório é leitura, então vai para a read replica. Multi-AZ só protege contra queda."}},

{t:"Estratégias de recuperação de desastre", cat:"Resiliência",
 n:{pri:[10,40,250,300,"zone","Região primária"],sec:[380,40,250,300,"zone","Região de DR"],
    app1:[30,90,210,56,"compute","Aplicação","frota completa"],db1:[30,240,210,56,"db","Banco",""],
    bk:[400,165,210,56,"storage","Backups e AMIs","só cópias"],sdb:[400,240,210,56,"db","Réplica do banco","sempre ligada"],
    off:[400,90,210,56,"compute","App desligado","AMI pronta"],min:[400,90,210,56,"compute","App reduzido","escala menor"],full:[400,90,210,56,"compute","App completo","atende tráfego"]},
 sc:[
  {t:"RPO e RTO",c:"RPO é quanto dado você aceita perder. RTO é quanto tempo pode ficar fora do ar. Quanto menores os dois, mais cara a estratégia.",s:"pri sec app1 db1"},
  {t:"Backup e restore: o mais barato",c:"Só backups e AMIs copiados para outra região. Na falha, tudo é recriado do zero: RTO e RPO de horas.",s:"pri sec app1 db1 bk",hl:"bk",f:[["db1","bk","alt","cópia periódica"]]},
  {t:"Pilot light: só o banco aceso",c:"O banco já replica para a região de DR, mas os servidores ficam desligados. Na falha, liga e escala: dezenas de minutos.",s:"pri sec app1 db1 sdb off",hl:"sdb",x:"off",f:[["db1","sdb","ok","replica"]]},
  {t:"Warm standby: tudo ligado, menor",c:"Uma cópia completa roda em escala reduzida e já recebe os dados. Na falha, só aumenta a escala: minutos.",s:"pri sec app1 db1 sdb min",hl:"min",f:[["db1","sdb","ok","replica"]]},
  {t:"Multi-site: as duas atendem",c:"As duas regiões recebem tráfego ao mesmo tempo, com Route 53 ou Global Accelerator dividindo. RTO quase zero, custo dobrado.",s:"pri sec app1 db1 sdb full",hl:"full app1",f:[["db1","sdb","ok","replica"]]}],
 regras:[["Menor custo, horas fora do ar aceitáveis","Backup e restore"],["Só o núcleo replicando, servidores desligados","Pilot light"],["Recuperar em minutos com custo moderado","Warm standby"],["Indisponibilidade quase zero","Multi-site (ativo-ativo)"],["Backup centralizado copiado para outra região","AWS Backup"]],
 q:{q:"A empresa aceita RTO de alguns minutos e tem orçamento moderado. Qual estratégia?",o:["Backup e restore","Warm standby","Multi-site ativo-ativo"],c:1,e:"Warm standby já está rodando em escala menor: recupera em minutos sem pagar o dobro."}},

{t:"Desacoplar com SQS e SNS", cat:"Resiliência",
 n:{prod:[20,164,120,52,"compute","Produtor"],sns:[180,164,120,52,"int","SNS","tópico"],
    q1:[340,60,125,52,"int","Fila SQS"],q2:[340,164,125,52,"int","Fila SQS"],q3:[340,268,125,52,"int","Fila SQS"],
    c1:[495,60,140,52,"compute","Consumidor A"],c2:[495,164,140,52,"compute","Consumidor B"],c3:[495,268,140,52,"compute","Consumidor C"]},
 sc:[
  {t:"Chamada direta é frágil",c:"O produtor depende de o consumidor estar no ar e dar conta do volume. Num pico ou numa falha, a mensagem se perde.",s:"prod c2",x:"c2",f:[["prod","c2","no","perdida"]]},
  {t:"SQS no meio: nada se perde",c:"A fila guarda a mensagem até alguém processar com sucesso. O consumidor puxa no próprio ritmo e escala pelo tamanho da fila.",s:"prod q2 c2",hl:"q2",f:[["prod","q2","ok"],["q2","c2","ok","puxa"]]},
  {t:"Visibility timeout",c:"Quem pega a mensagem a deixa invisível. Se não apagar antes do timeout, ela volta e é processada de novo. Processamento duplicado? Aumente o timeout.",hl:"q2",f:[["prod","q2","ok"],["q2","c2","alt","invisível"]]},
  {t:"Falhou várias vezes? DLQ",c:"Depois de N tentativas, a mensagem vai para a dead-letter queue para análise. Precisa de ordem e de não duplicar? Fila FIFO.",hl:"c2",f:[["prod","q2","ok"],["q2","c2","ok"]]},
  {t:"Fan-out: SNS para várias filas",c:"Vários sistemas precisam da mesma mensagem? O SNS entrega para várias filas SQS. Com filtro, cada fila recebe só o seu tipo.",s:"*",hl:"sns",f:[["prod","sns","ok"],["sns","q1","ok"],["sns","q2","ok"],["sns","q3","ok"],["q1","c1","ok"],["q2","c2","ok"],["q3","c3","ok"]]}],
 regras:[["Pico de pedidos sem perder nenhum","Fila SQS como buffer"],["Mensagem processada duas vezes","Aumentar o visibility timeout"],["Ordem garantida e sem duplicar","SQS FIFO"],["Mesma mensagem para vários sistemas","SNS + várias SQS (fan-out)"],["Mensagem maior que 256 KB","SQS Extended Client (guarda no S3)"]],
 q:{q:"Uma Lambda assinada direto num tópico SNS às vezes perde mensagens. O que fazer?",o:["Dar mais memória à Lambda","Colocar uma fila SQS entre o SNS e a Lambda","Implantar a Lambda em várias AZs"],c:1,e:"A fila guarda a mensagem e permite novas tentativas. A Lambda já roda em várias AZs."}},

{t:"Streaming: Kinesis, Firehose ou SQS?", cat:"Resiliência",
 n:{src:[20,164,135,52,"user","Eventos","cliques, IoT, logs"],
    kds:[205,90,190,52,"int","Kinesis Data Streams","tempo real"],fh:[205,250,190,52,"int","Data Firehose","entrega em lotes"],
    c1:[450,30,180,48,"compute","Consumidor A","fraude"],c2:[450,90,180,48,"compute","Consumidor B","painel"],c3:[450,150,180,48,"compute","Flink","SQL ao vivo"],
    s3:[450,250,180,52,"storage","S3 / Redshift","ou OpenSearch"]},
 sc:[
  {t:"Um fluxo que não para",c:"Cliques, logs e sensores chegam o tempo todo e precisam ser guardados e processados sem perder nada.",s:"src"},
  {t:"Data Streams: vários leitores",c:"Guarda os eventos em ordem por shard, por 24 horas até 365 dias. Vários consumidores leem o mesmo fluxo em paralelo e podem reler.",s:"src kds c1 c2",hl:"kds",f:[["src","kds","ok"],["kds","c1","ok"],["kds","c2","ok"]]},
  {t:"Analisar enquanto chega",c:"Para SQL ou janelas de tempo sobre o fluxo ao vivo, use o Managed Service for Apache Flink lendo do Data Streams.",s:"src kds c1 c2 c3",hl:"c3",f:[["src","kds","ok"],["kds","c1","ok"],["kds","c2","ok"],["kds","c3","ok"]]},
  {t:"Firehose: entrega sem código",c:"Junta os eventos em lotes de segundos a minutos, pode converter o formato e grava no S3, Redshift ou OpenSearch. Não tem consumidor para escrever.",s:"*",hl:"fh",f:[["src","fh","ok"],["fh","s3","ok","em lotes"]]},
  {t:"Fila ou fluxo?",c:"Uma tarefa por mensagem, um consumidor cada: SQS. Vários leitores do mesmo fluxo: Data Streams. Só levar a um destino: Firehose.",f:[["src","kds","ok"],["kds","c1","ok"],["kds","c2","ok"],["src","fh","ok"],["fh","s3","ok"]]}],
 regras:[["Vários consumidores do mesmo fluxo em tempo real","Kinesis Data Streams"],["Levar streaming ao S3 ou Redshift sem código","Data Firehose"],["Tarefas independentes, uma por consumidor","SQS"],["SQL sobre o fluxo ao vivo","Managed Service for Apache Flink"],["Consultar depois, em arquivos no S3","Athena"]],
 q:{q:"Dados de cliques devem chegar ao S3 a cada minuto, sem escrever consumidores. Qual serviço?",o:["Kinesis Data Streams","Data Firehose","SQS FIFO"],c:1,e:"O Firehose entrega em lotes direto no S3, sem código de consumidor."}},

{t:"Auto Scaling: quando e como escalar", cat:"Resiliência",
 n:{alb:[15,164,120,52,"net","ALB"],asg:[165,30,295,320,"zone","Auto Scaling group"],
    i1:[180,70,125,48,"compute","EC2"],i2:[320,70,125,48,"compute","EC2"],i3:[180,140,125,48,"compute","EC2"],i4:[320,140,125,48,"compute","EC2"],i5:[180,210,125,48,"compute","EC2"],i6:[320,210,125,48,"compute","EC2"],
    cw:[485,70,150,52,"mon","CloudWatch","CPU média 80%"],sch:[485,170,150,52,"note","Agenda","dia 1º, 0h"],sq:[485,270,150,52,"int","Fila SQS","mensagens"]},
 sc:[
  {t:"Mínimo, desejado e máximo",c:"O grupo mantém a quantidade desejada de instâncias em várias AZs, entre um mínimo e um máximo, e troca as que falham no health check.",s:"alb asg i1 i2",f:[["alb","i1","ok"],["alb","i2","ok"]]},
  {t:"Target tracking: o padrão",c:"Você escolhe uma meta, como CPU média em 50%, e o grupo adiciona ou remove instâncias para mantê-la. É a política mais simples.",s:"alb asg i1 i2 i3 i4 cw",hl:"i3 i4 cw",f:[["cw","asg","ok"]]},
  {t:"Scheduled e predictive",c:"Pico com hora marcada? Agende a capacidade antes. Padrão recorrente sem ninguém para analisar? Predictive aprende com o histórico.",s:"alb asg i1 i2 i3 i4 i5 i6 sch",hl:"sch i5 i6",f:[["sch","asg","alt"]]},
  {t:"Workers escalam pela fila",c:"Para instâncias que leem do SQS, escale pelo número de mensagens por instância: a frota acompanha o trabalho acumulado, não a CPU.",s:"alb asg i1 i2 i3 i4 sq",hl:"sq",f:[["sq","asg","ok","backlog"]]},
  {t:"Boot lento? Warm pool",c:"O cooldown evita escalar várias vezes seguidas. Warm pool deixa instâncias pré-inicializadas para quem demora a subir.",s:"alb asg i1 i2 i3 i4",hl:"asg"}],
 regras:[["Manter CPU ou requisições numa meta","Target tracking"],["Pico em horário conhecido","Scheduled scaling"],["Padrão recorrente, ninguém analisa","Predictive scaling"],["Workers lendo do SQS","Escalar pelo tamanho da fila"],["Instâncias com boot demorado","Warm pool (ou AMI pronta)"]],
 q:{q:"Uma aplicação tem pico todo dia às 9h e as instâncias demoram para iniciar. Qual opção?",o:["Target tracking por CPU","Scheduled scaling antes das 9h","Aumentar o cooldown"],c:1,e:"Horário conhecido + boot lento: suba a capacidade antes do pico com scheduled scaling."}},

/* ───────────── ARMAZENAMENTO, DADOS E CUSTO ───────────── */
{t:"EBS, EFS, FSx ou S3?", cat:"Armazenamento e custo",
 n:{zb:[15,15,195,345,"zone","Bloco"],za:[222,15,195,345,"zone","Arquivo"],zo:[430,15,200,345,"zone","Objeto"],
    ec2a:[25,50,175,52,"compute","EC2","uma AZ"],ebs:[25,160,175,52,"storage","EBS","disco de rede"],ist:[25,270,175,52,"storage","Instance store","some ao parar"],
    e2:[232,50,85,52,"compute","EC2"],e3:[322,50,85,52,"compute","EC2"],efs:[232,160,175,52,"storage","EFS","NFS, Linux"],fsx:[232,270,175,52,"storage","FSx","Windows ou Lustre"],
    app:[440,50,180,52,"compute","App","via API HTTP"],s3:[440,160,180,52,"storage","S3","objetos"]},
 sc:[
  {t:"Bloco: EBS, o disco da instância",c:"Disco de rede preso a uma instância e a uma AZ. Serve para sistema operacional e banco. Muda de AZ só por snapshot.",s:"zb ec2a ebs",hl:"ebs",f:[["ec2a","ebs","ok"]]},
  {t:"Tipos de EBS",c:"gp3 é o padrão, com IOPS ajustável. io2 para banco com IOPS alto e constante. st1 e sc1 são HDD baratos para leitura sequencial grande.",hl:"ebs",f:[["ec2a","ebs","ok"]]},
  {t:"Instance store: rápido e temporário",c:"Disco físico do host, com I/O altíssimo, mas os dados somem quando a instância para. Só para cache e dados temporários.",s:"zb ec2a ebs ist",hl:"ist",f:[["ec2a","ebs","ok"],["ec2a","ist","alt","temporário"]]},
  {t:"Arquivo compartilhado: EFS e FSx",c:"Várias instâncias montam o mesmo sistema de arquivos ao mesmo tempo, em várias AZs. EFS para Linux (NFS); FSx for Windows para SMB e AD; FSx for Lustre para HPC.",s:"zb ec2a ebs ist za e2 e3 efs fsx",hl:"efs fsx",f:[["e2","efs","ok"],["e3","efs","ok"]]},
  {t:"Objeto: S3",c:"Nada de montar disco: a aplicação grava e lê por API. Escala sem limite, é o mais barato por GB e serve arquivos pela web.",s:"*",hl:"s3",f:[["app","s3","ok","PUT / GET"]]}],
 regras:[["Disco de banco de dados em EC2","EBS (io2 se IOPS alto)"],["Arquivos compartilhados entre EC2 Linux","EFS"],["Compartilhamento Windows/SMB com AD","FSx for Windows"],["HPC com sistema de arquivos muito rápido","FSx for Lustre"],["Muitos dados, acesso por API, menor custo","S3"],["Cache temporário com I/O máximo","Instance store"]],
 q:{q:"Instâncias Linux em várias AZs precisam ler e gravar os mesmos arquivos. Qual serviço?",o:["EBS Multi-Attach","EFS","Instance store"],c:1,e:"O EFS é compartilhado entre várias AZs. EBS Multi-Attach funciona só numa AZ e com io1/io2."}},

{t:"As classes do S3", cat:"Armazenamento e custo",
 n:{std:[20,30,250,52,"storage","Standard","acesso frequente"],it:[20,120,250,52,"storage","Intelligent-Tiering","acesso imprevisível"],
    sia:[20,210,250,52,"storage","Standard-IA","raro, mas imediato"],oz:[20,300,250,52,"storage","One Zone-IA","raro, uma AZ só"],
    gir:[375,30,250,52,"storage","Glacier Instant Retrieval","arquivo, em milissegundos"],gfr:[375,140,250,52,"storage","Glacier Flexible Retrieval","minutos a horas"],
    gda:[375,250,250,52,"storage","Glacier Deep Archive","até 12 h, o mais barato"]},
 sc:[
  {t:"Standard: o ponto de partida",c:"Acesso frequente, dados em três AZs ou mais. É a classe mais cara para guardar e não cobra por leitura.",s:"std",hl:"std"},
  {t:"IA: guardar é barato, ler é cobrado",c:"Standard-IA para dado raro que precisa abrir na hora. One Zone-IA é igual em uma AZ só: use apenas para dado que dá para recriar.",s:"std sia oz",hl:"sia oz",f:[["std","sia","alt"]]},
  {t:"Não sabe o padrão? Intelligent-Tiering",c:"Move cada objeto sozinho entre camadas conforme o uso, sem taxa de leitura. É a resposta para acesso imprevisível.",s:"std it sia oz",hl:"it"},
  {t:"Glacier: arquivamento",c:"Instant Retrieval abre em milissegundos, Flexible leva de minutos a horas e Deep Archive até 12 horas, sendo o mais barato de todos.",s:"*",hl:"gir gfr gda"},
  {t:"Lifecycle e proteção",s:"std sia gfr gda",c:"Uma regra de lifecycle move objetos com o tempo e apaga uploads multipart incompletos. Contra exclusão: versionamento e MFA delete. Imutável: Object Lock.",f:[["std","sia","ok","30 dias"],["sia","gfr","ok","90 dias"],["gfr","gda","ok","1 ano"]]}],
 regras:[["Acesso imprevisível ou desconhecido","Intelligent-Tiering"],["Raro, mas precisa abrir na hora","Standard-IA (ou Glacier Instant)"],["Arquivo por anos, espera aceitável","Glacier Deep Archive"],["Proteger contra exclusão acidental","Versionamento + MFA delete"],["Ninguém pode alterar nem apagar","Object Lock (modo compliance)"],["Descobrir buckets pouco usados","S3 Storage Lens"]],
 q:{q:"Backups são acessados por um mês e depois nunca mais, mas precisam ficar guardados. Qual destino é mais barato?",o:["Standard-IA","Intelligent-Tiering","Glacier Deep Archive"],c:2,e:"Se ninguém vai acessar e a espera é aceitável, Deep Archive é o mais barato."}},

{t:"Opções de compra do EC2", cat:"Armazenamento e custo",
 n:{w1:[20,30,210,52,"note","Produção 24×7","previsível por anos"],w2:[20,120,210,52,"note","Família pode mudar","EC2, Fargate, Lambda"],
    w3:[20,210,210,52,"note","Dev/teste ou curto","liga e desliga"],w4:[20,300,210,52,"note","Tolera interrupção","batch, render, CI"],
    ri:[390,30,240,52,"compute","Reserved Instances","1 ou 3 anos"],csp:[390,120,240,52,"compute","Compute Savings Plan","US$/hora, flexível"],
    od:[390,210,240,52,"compute","On-Demand","sem compromisso"],sp:[390,300,240,52,"compute","Spot","até 90% mais barato"]},
 sc:[
  {t:"Uso contínuo e previsível",c:"Produção ligada o ano todo: Reserved Instances ou Savings Plans de 1 ou 3 anos. Maior compromisso, maior desconto.",s:"w1 ri",hl:"ri",f:[["w1","ri","ok"]]},
  {t:"Desconto com flexibilidade",c:"O Compute Savings Plan compromete um valor por hora, não um tipo de instância: dá para trocar família e região e até usar Fargate e Lambda.",s:"w1 ri w2 csp",hl:"csp",f:[["w1","ri","ok"],["w2","csp","ok"]]},
  {t:"Curto ou imprevisível: On-Demand",c:"Dev e teste que ligam e desligam, ou picos que ninguém prevê. Reserva cobra mesmo com a instância desligada.",s:"w1 ri w2 csp w3 od",hl:"od",f:[["w1","ri","ok"],["w2","csp","ok"],["w3","od","ok"]]},
  {t:"Pode parar? Spot",c:"Batch, render, CI e workers sem estado usam Spot. A AWS pode retomar a instância com 2 minutos de aviso.",s:"*",hl:"sp",f:[["w1","ri","ok"],["w2","csp","ok"],["w3","od","ok"],["w4","sp","ok"]]},
  {t:"Casos especiais",c:"Capacity Reservation garante capacidade numa AZ sem prazo mínimo. Dedicated Host atende licença por soquete ou núcleo.",f:[["w1","ri","ok"],["w2","csp","ok"],["w3","od","ok"],["w4","sp","ok"]]}],
 regras:[["Produção estável por anos","Reserved Instances ou Savings Plan"],["Trocar família ou usar Fargate/Lambda","Compute Savings Plan"],["Carga curta ou imprevisível","On-Demand"],["Tolera interrupção, menor custo","Spot"],["Garantir capacidade numa AZ por pouco tempo","On-Demand Capacity Reservation"],["Licença por soquete ou núcleo","Dedicated Host"]],
 q:{q:"Jobs de processamento de imagens podem ser reiniciados sem problema. Qual opção é a mais barata?",o:["On-Demand","Spot","Reserved Instances"],c:1,e:"Carga que tolera interrupção é o caso clássico de Spot."}},

{t:"Migração: DataSync, Snowball, DMS…", cat:"Armazenamento e custo",
 n:{dc:[10,30,190,330,"zone","Data center"],nas:[22,70,166,52,"onprem","NAS","NFS ou SMB"],db0:[22,180,166,52,"onprem","Banco local","Oracle, MySQL"],sftp:[22,290,166,52,"onprem","Parceiro","envia por SFTP"],
    ds:[240,40,165,52,"int","DataSync","online, agendado"],sb:[240,120,165,52,"storage","Snowball","dispositivo físico"],dms:[240,200,165,52,"db","DMS","migra o banco"],tf:[240,290,165,52,"int","Transfer Family","SFTP gerenciado"],
    s3:[450,80,180,52,"storage","S3, EFS, FSx"],rds:[450,200,180,52,"db","RDS ou Aurora"],s3b:[450,290,180,52,"storage","S3"]},
 sc:[
  {t:"Arquivos pela rede: DataSync",c:"Um agente lê NFS, SMB ou HDFS e copia para S3, EFS ou FSx, com agendamento, verificação de integridade e limite de banda.",s:"dc nas ds s3",hl:"ds",f:[["nas","ds","ok"],["ds","s3","ok"]]},
  {t:"Muitos TB, pouca banda: Snowball",c:"Conta rápida: 1 Gbps leva cerca de um dia para 10 TB. Se a rede não cabe no prazo, a AWS manda um Snowball para carregar e devolver.",s:"dc nas ds s3 sb",hl:"sb",f:[["nas","sb","alt"],["sb","s3","ok"]]},
  {t:"Banco de dados: DMS",c:"Migra com a origem ainda no ar, replicando as mudanças. Trocou de motor, como Oracle para PostgreSQL? Use antes o Schema Conversion Tool.",s:"dc nas ds s3 sb db0 dms rds",hl:"dms",f:[["db0","dms","ok"],["dms","rds","ok"]]},
  {t:"Parceiros com SFTP: Transfer Family",c:"Os parceiros continuam usando SFTP, FTPS ou FTP, e os arquivos caem direto no S3 ou EFS. O login pode vir do Active Directory.",s:"*",hl:"tf",f:[["sftp","tf","ok"],["tf","s3b","ok"]]},
  {t:"Uso contínuo? Storage Gateway",c:"Se os servidores locais vão continuar usando os arquivos, o Storage Gateway expõe NFS, SMB ou iSCSI no local e guarda na AWS. Para migrar uma vez, DataSync.",hl:"nas",f:[["nas","ds","ok"],["ds","s3","ok"]]}],
 regras:[["Copiar arquivos NFS/SMB para S3, EFS ou FSx","DataSync"],["Dezenas de TB com pouca banda ou prazo curto","Snowball"],["Migrar banco com pouco downtime","DMS (+ SCT se mudar de motor)"],["SFTP gerenciado gravando no S3","Transfer Family"],["Link dedicado, estável e privado","Direct Connect"]],
 q:{q:"É preciso migrar 70 TB de vídeos para o S3 em uma semana, com um link de 100 Mbps já ocupado. Qual opção?",o:["DataSync pela internet","Snowball Edge","S3 Transfer Acceleration"],c:1,e:"100 Mbps não leva 70 TB em uma semana. Com pouca banda e muito volume, a resposta é Snowball."}}
];
