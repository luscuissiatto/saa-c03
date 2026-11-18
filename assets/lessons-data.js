/* Aulas animadas. n = caixas do diagrama [x,y,largura,altura,título,subtítulo,é_zona].
   sc = cenas: c legenda, s caixas visíveis, h destaque, x riscadas, f setas [de,para,tipo,rótulo].
   q = pergunta final. O diagrama usa um espaço de 640×380. */
window.LESSONS = [
 {
  "t": "RDS: Multi-AZ ou read replica?",
  "n": {
   "app": [
    30,
    92,
    120,
    56,
    "App",
    "grava transações"
   ],
   "rep": [
    30,
    250,
    120,
    56,
    "Relatórios",
    "consultas pesadas"
   ],
   "za": [
    200,
    30,
    200,
    320,
    "AZ a",
    0,
    1
   ],
   "zb": [
    420,
    30,
    200,
    320,
    "AZ b",
    0,
    1
   ],
   "pri": [
    230,
    90,
    140,
    56,
    "Primário",
    "leitura e escrita"
   ],
   "sb": [
    450,
    90,
    140,
    56,
    "Standby",
    "não atende consultas"
   ],
   "rr": [
    450,
    250,
    140,
    56,
    "Read replica",
    "só leitura"
   ]
  },
  "sc": [
   {
    "c": "Tudo começa no <b>primário</b>: é a única instância que aceita escrita.",
    "s": "app za pri",
    "h": "pri",
    "f": [
     [
      "app",
      "pri",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>Multi-AZ</b> cria um standby em outra AZ, com replicação síncrona. O standby não atende nenhuma consulta: ele só espera.",
    "s": "app za zb pri sb",
    "h": "sb",
    "f": [
     [
      "app",
      "pri",
      "ok"
     ],
     [
      "pri",
      "sb",
      "ok",
      "síncrona"
     ]
    ]
   },
   {
    "c": "Se o primário cair, o RDS faz failover automático para o standby e o endereço do banco continua o mesmo. <b>Multi-AZ = alta disponibilidade.</b>",
    "s": "app za zb pri sb",
    "h": "sb",
    "x": "pri",
    "f": [
     [
      "app",
      "sb",
      "ok",
      "failover"
     ]
    ]
   },
   {
    "c": "Outro problema: relatórios pesados rodando no primário disputam a máquina com as transações, e as escritas ficam lentas.",
    "s": "app rep za zb pri sb",
    "h": "pri",
    "f": [
     [
      "app",
      "pri",
      "ok"
     ],
     [
      "rep",
      "pri",
      "alt",
      "lento"
     ],
     [
      "pri",
      "sb",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>Read replica</b>: cópia assíncrona que aceita leitura. Os relatórios vão para ela e o primário fica livre. <b>Read replica = escalar leitura.</b>",
    "s": "app rep za zb pri sb rr",
    "h": "rr",
    "f": [
     [
      "app",
      "pri",
      "ok"
     ],
     [
      "pri",
      "sb",
      "ok"
     ],
     [
      "pri",
      "rr",
      "alt",
      "assíncrona"
     ],
     [
      "rep",
      "rr",
      "ok"
     ]
    ]
   }
  ],
  "q": {
   "q": "O banco fica lento sempre que rodam os relatórios mensais. O que resolve?",
   "o": [
    "Ativar Multi-AZ",
    "Criar uma read replica e apontar os relatórios para ela",
    "Ativar o RDS Proxy"
   ],
   "c": 1,
   "e": "Relatório é leitura, então vai para a read replica. Multi-AZ só protege contra queda, e o RDS Proxy só administra conexões."
  }
 },
 {
  "t": "Sub-rede privada: NAT ou endpoint?",
  "n": {
   "vpc": [
    150,
    20,
    310,
    340,
    "VPC",
    0,
    1
   ],
   "pub": [
    165,
    58,
    150,
    122,
    "Sub-rede pública",
    0,
    1
   ],
   "prv": [
    165,
    222,
    150,
    122,
    "Sub-rede privada",
    0,
    1
   ],
   "net": [
    10,
    100,
    120,
    52,
    "Internet"
   ],
   "nat": [
    180,
    104,
    120,
    52,
    "NAT gateway"
   ],
   "ec2": [
    180,
    268,
    120,
    52,
    "EC2"
   ],
   "gwe": [
    316,
    104,
    138,
    52,
    "Gateway endpoint",
    "rota, sem custo"
   ],
   "ife": [
    316,
    268,
    138,
    52,
    "Interface endpoint",
    "placa de rede, pago"
   ],
   "s3": [
    485,
    104,
    145,
    52,
    "S3 e DynamoDB"
   ],
   "oth": [
    485,
    268,
    145,
    52,
    "Demais serviços",
    "SQS, KMS, API GW…"
   ]
  },
  "sc": [
   {
    "c": "Uma EC2 em <b>sub-rede privada</b> não tem caminho para a internet. Ela não baixa atualizações nem chama serviços da AWS.",
    "s": "vpc prv ec2 net",
    "f": [
     [
      "ec2",
      "net",
      "no"
     ]
    ]
   },
   {
    "c": "<b>NAT gateway</b>, na sub-rede pública: a instância privada consegue sair, mas ninguém de fora inicia conexão com ela. É cobrado por hora e por GB.",
    "s": "vpc pub prv ec2 nat net",
    "h": "nat",
    "f": [
     [
      "ec2",
      "nat",
      "ok"
     ],
     [
      "nat",
      "net",
      "ok"
     ]
    ]
   },
   {
    "c": "Dá para chegar ao S3 pelo NAT, mas o tráfego passa por ele e você paga pelo processamento de cada GB.",
    "s": "vpc pub prv ec2 nat s3",
    "f": [
     [
      "ec2",
      "nat",
      "alt"
     ],
     [
      "nat",
      "s3",
      "alt",
      "caro"
     ]
    ]
   },
   {
    "c": "<b>Gateway endpoint</b>: uma rota na tabela de rotas, sem custo, direto pela rede da AWS. Existe só para <b>S3 e DynamoDB</b>.",
    "s": "vpc pub prv ec2 nat gwe s3",
    "h": "gwe",
    "f": [
     [
      "ec2",
      "gwe",
      "ok"
     ],
     [
      "gwe",
      "s3",
      "ok"
     ]
    ]
   },
   {
    "c": "Para os outros serviços: <b>interface endpoint</b> (PrivateLink), uma placa de rede com IP privado dentro da sub-rede. É pago.",
    "s": "vpc pub prv ec2 nat gwe s3 ife oth",
    "h": "ife",
    "f": [
     [
      "ec2",
      "gwe",
      "ok"
     ],
     [
      "gwe",
      "s3",
      "ok"
     ],
     [
      "ec2",
      "ife",
      "ok"
     ],
     [
      "ife",
      "oth",
      "ok"
     ]
    ]
   }
  ],
  "q": {
   "q": "Instâncias privadas baixam muitos dados do S3 por um NAT gateway e a conta de transferência subiu. O que fazer?",
   "o": [
    "Criar um NAT gateway por AZ",
    "Criar um gateway endpoint para o S3",
    "Trocar o NAT gateway por uma instância NAT"
   ],
   "c": 1,
   "e": "O gateway endpoint não tem custo e tira o tráfego do S3 de dentro do NAT."
  }
 },
 {
  "t": "Security group ou NACL?",
  "n": {
   "pu": [
    130,
    40,
    150,
    300,
    "Sub-rede pública",
    0,
    1
   ],
   "pr": [
    300,
    40,
    150,
    300,
    "Sub-rede privada",
    0,
    1
   ],
   "dz": [
    470,
    40,
    160,
    300,
    "Sub-rede de dados",
    0,
    1
   ],
   "usr": [
    10,
    90,
    100,
    52,
    "Usuário"
   ],
   "web": [
    145,
    90,
    120,
    52,
    "Web",
    "SG-web"
   ],
   "app": [
    315,
    230,
    120,
    52,
    "App",
    "SG-app"
   ],
   "db": [
    490,
    160,
    120,
    52,
    "RDS",
    "SG-db"
   ]
  },
  "sc": [
   {
    "c": "Aplicação em três camadas. Cada recurso tem um <b>security group</b>, que funciona como o firewall daquela instância.",
    "s": "pu pr dz usr web app db",
    "f": [
     [
      "usr",
      "web",
      "ok"
     ],
     [
      "web",
      "app",
      "ok"
     ],
     [
      "app",
      "db",
      "ok"
     ]
    ]
   },
   {
    "c": "A regra do SG-db usa <b>outro security group como origem</b>: permitir a porta 3306 vinda de SG-app. Só a camada de aplicação entra.",
    "s": "pu pr dz usr web app db",
    "h": "db app",
    "f": [
     [
      "app",
      "db",
      "ok",
      "permitido"
     ],
     [
      "web",
      "db",
      "no"
     ]
    ]
   },
   {
    "c": "Security group só tem regra de <b>permissão</b> e é <b>stateful</b>: a resposta volta sozinha. Não existe regra de negação.",
    "s": "pu pr dz usr web app db",
    "h": "web app db",
    "f": [
     [
      "usr",
      "web",
      "ok"
     ],
     [
      "web",
      "app",
      "ok"
     ],
     [
      "app",
      "db",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>NACL</b> é o firewall da sub-rede. Tem regras de permitir e de negar, numeradas, e é <b>stateless</b>: precisa liberar a ida e a volta.",
    "s": "pu pr dz usr web app db",
    "h": "pu pr dz",
    "f": [
     [
      "usr",
      "web",
      "ok"
     ]
    ]
   },
   {
    "c": "Precisa bloquear um IP específico? Só a NACL consegue, ou o WAF se for tráfego HTTP. Security group não nega nada.",
    "s": "pu pr dz usr web app db",
    "h": "pu",
    "f": [
     [
      "usr",
      "web",
      "no",
      "IP bloqueado"
     ]
    ]
   }
  ],
  "q": {
   "q": "Como garantir que só os servidores de aplicação acessem o RDS?",
   "o": [
    "NACL negando a sub-rede pública",
    "Security group do RDS com o security group do app como origem",
    "Tabela de rotas sem a rota para a sub-rede pública"
   ],
   "c": 1,
   "e": "Um security group pode referenciar outro. A tabela de rotas de uma VPC sempre tem a rota local, então não isola sub-redes."
  }
 },
 {
  "t": "Desacoplar com SQS e SNS",
  "n": {
   "prod": [
    20,
    164,
    110,
    52,
    "Produtor"
   ],
   "sns": [
    180,
    164,
    110,
    52,
    "SNS",
    "tópico"
   ],
   "q1": [
    340,
    60,
    110,
    52,
    "Fila SQS"
   ],
   "q2": [
    340,
    164,
    110,
    52,
    "Fila SQS"
   ],
   "q3": [
    340,
    268,
    110,
    52,
    "Fila SQS"
   ],
   "c1": [
    500,
    60,
    125,
    52,
    "Consumidor A"
   ],
   "c2": [
    500,
    164,
    125,
    52,
    "Consumidor B"
   ],
   "c3": [
    500,
    268,
    125,
    52,
    "Consumidor C"
   ]
  },
  "sc": [
   {
    "c": "Chamada direta: o produtor depende de o consumidor estar no ar e dar conta do volume.",
    "s": "prod c2",
    "f": [
     [
      "prod",
      "c2",
      "ok"
     ]
    ]
   },
   {
    "c": "Num pico de tráfego ou numa falha, as mensagens se perdem. Isso é <b>acoplamento</b>.",
    "s": "prod c2",
    "x": "c2",
    "f": [
     [
      "prod",
      "c2",
      "no",
      "perdida"
     ]
    ]
   },
   {
    "c": "<b>SQS no meio</b>: a fila guarda a mensagem até alguém processar com sucesso. O consumidor puxa no ritmo dele, e o Auto Scaling pode escalar pelo tamanho da fila.",
    "s": "prod q2 c2",
    "h": "q2",
    "f": [
     [
      "prod",
      "q2",
      "ok"
     ],
     [
      "q2",
      "c2",
      "ok"
     ]
    ]
   },
   {
    "c": "Vários sistemas precisam da mesma mensagem? <b>Fan-out</b>: um tópico SNS entrega para várias filas SQS. Com filtro, cada fila recebe só o seu tipo.",
    "s": "prod sns q1 q2 q3 c1 c2 c3",
    "h": "sns",
    "f": [
     [
      "prod",
      "sns",
      "ok"
     ],
     [
      "sns",
      "q1",
      "ok"
     ],
     [
      "sns",
      "q2",
      "ok"
     ],
     [
      "sns",
      "q3",
      "ok"
     ],
     [
      "q1",
      "c1",
      "ok"
     ],
     [
      "q2",
      "c2",
      "ok"
     ],
     [
      "q3",
      "c3",
      "ok"
     ]
    ]
   },
   {
    "c": "Três detalhes que caem: <b>FIFO</b> quando a ordem importa, <b>DLQ</b> para mensagens que falham várias vezes, e <b>Kinesis Data Streams</b> quando é streaming em tempo real.",
    "s": "prod sns q1 q2 q3 c1 c2 c3",
    "h": "q1 q2 q3",
    "f": [
     [
      "prod",
      "sns",
      "ok"
     ],
     [
      "sns",
      "q1",
      "ok"
     ],
     [
      "sns",
      "q2",
      "ok"
     ],
     [
      "sns",
      "q3",
      "ok"
     ],
     [
      "q1",
      "c1",
      "ok"
     ],
     [
      "q2",
      "c2",
      "ok"
     ],
     [
      "q3",
      "c3",
      "ok"
     ]
    ]
   }
  ],
  "q": {
   "q": "Uma Lambda assinada direto a um tópico SNS às vezes perde mensagens por falha de rede. O que fazer?",
   "o": [
    "Dar mais memória à Lambda",
    "Colocar uma fila SQS entre o SNS e a Lambda",
    "Implantar a Lambda em várias AZs"
   ],
   "c": 1,
   "e": "A fila guarda a mensagem e permite novas tentativas. A Lambda já roda em várias AZs por padrão."
  }
 },
 {
  "t": "As classes do S3",
  "n": {
   "std": [
    40,
    40,
    250,
    52,
    "Standard",
    "acesso frequente"
   ],
   "it": [
    40,
    120,
    250,
    52,
    "Intelligent-Tiering",
    "acesso imprevisível"
   ],
   "sia": [
    40,
    200,
    250,
    52,
    "Standard-IA",
    "raro, mas imediato"
   ],
   "oz": [
    40,
    280,
    250,
    52,
    "One Zone-IA",
    "raro, em uma AZ só"
   ],
   "gir": [
    350,
    40,
    250,
    52,
    "Glacier Instant Retrieval",
    "arquivo, em milissegundos"
   ],
   "gfr": [
    350,
    120,
    250,
    52,
    "Glacier Flexible Retrieval",
    "minutos a horas"
   ],
   "gda": [
    350,
    200,
    250,
    52,
    "Glacier Deep Archive",
    "até 12 horas, o mais barato"
   ]
  },
  "sc": [
   {
    "c": "<b>Standard</b>: acesso frequente, dados em três AZs ou mais. É a classe mais cara para guardar e não cobra por leitura.",
    "s": "std",
    "h": "std"
   },
   {
    "c": "<b>Standard-IA</b>: guardar custa menos, mas cada leitura é cobrada. Serve para dado raro que precisa abrir na hora. <b>One Zone-IA</b> é igual em uma AZ só: use apenas para dado que pode ser recriado.",
    "s": "std sia oz",
    "h": "sia oz",
    "f": [
     [
      "std",
      "sia",
      "alt"
     ]
    ]
   },
   {
    "c": "Padrão de acesso imprevisível ou desconhecido? <b>Intelligent-Tiering</b> move cada objeto sozinho, sem taxa de leitura.",
    "s": "std it sia oz",
    "h": "it"
   },
   {
    "c": "Para arquivo: <b>Glacier Instant</b> abre em milissegundos, <b>Flexible</b> leva de minutos a horas e <b>Deep Archive</b> até 12 horas, sendo o mais barato de todos.",
    "s": "std it sia oz gir gfr gda",
    "h": "gir gfr gda"
   },
   {
    "c": "Uma regra de <b>lifecycle</b> move os objetos com o tempo. Para proteger: versionamento e MFA delete contra exclusão acidental, e Object Lock em modo compliance quando ninguém pode apagar.",
    "s": "std it sia oz gir gfr gda",
    "f": [
     [
      "std",
      "sia",
      "ok",
      "30 dias"
     ],
     [
      "sia",
      "gfr",
      "ok",
      "90 dias"
     ],
     [
      "gfr",
      "gda",
      "ok",
      "1 ano"
     ]
    ]
   }
  ],
  "q": {
   "q": "Backups são acessados por um mês e depois nunca mais, mas precisam ficar guardados para sempre. Qual destino tem o menor custo?",
   "o": [
    "Standard-IA",
    "Intelligent-Tiering",
    "Glacier Deep Archive"
   ],
   "c": 2,
   "e": "Se ninguém vai acessar e a espera é aceitável, Deep Archive é o mais barato."
  }
 },
 {
  "t": "CloudFront ou Global Accelerator?",
  "n": {
   "u": [
    15,
    164,
    110,
    52,
    "Usuários",
    "no mundo todo"
   ],
   "cf": [
    190,
    70,
    150,
    52,
    "CloudFront",
    "cache, só HTTP/HTTPS"
   ],
   "ga": [
    190,
    258,
    150,
    52,
    "Global Accelerator",
    "TCP e UDP, IPs fixos"
   ],
   "s3": [
    440,
    24,
    160,
    52,
    "S3",
    "conteúdo estático"
   ],
   "alb": [
    440,
    112,
    160,
    52,
    "ALB",
    "conteúdo dinâmico"
   ],
   "n1": [
    440,
    214,
    160,
    52,
    "NLB",
    "região A"
   ],
   "n2": [
    440,
    302,
    160,
    52,
    "NLB",
    "região B"
   ]
  },
  "sc": [
   {
    "c": "Usuários longe da região da aplicação sofrem com a latência.",
    "s": "u s3 alb",
    "f": [
     [
      "u",
      "alb",
      "alt",
      "longe e lento"
     ]
    ]
   },
   {
    "c": "<b>CloudFront</b> guarda cópias em cache perto do usuário. Uma só distribuição aceita várias origens: S3 para o estático e ALB para o dinâmico.",
    "s": "u cf s3 alb",
    "h": "cf",
    "f": [
     [
      "u",
      "cf",
      "ok"
     ],
     [
      "cf",
      "s3",
      "ok"
     ],
     [
      "cf",
      "alb",
      "ok"
     ]
    ]
   },
   {
    "c": "Com o CloudFront vêm junto: URLs assinadas para conteúdo restrito, WAF contra SQL injection, Lambda@Edge para transformar conteúdo, e transferência do S3 para o CloudFront sem custo.",
    "s": "u cf s3 alb",
    "h": "cf",
    "f": [
     [
      "u",
      "cf",
      "ok"
     ],
     [
      "cf",
      "s3",
      "ok"
     ],
     [
      "cf",
      "alb",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>Global Accelerator</b> não faz cache. Ele dá dois IPs fixos e leva o tráfego pela rede da AWS até a região mais próxima. Aceita TCP e <b>UDP</b>: jogos, VoIP, IoT.",
    "s": "u ga n1 n2",
    "h": "ga",
    "f": [
     [
      "u",
      "ga",
      "ok"
     ],
     [
      "ga",
      "n1",
      "ok"
     ]
    ]
   },
   {
    "c": "Se uma região cai, ele desvia para outra em segundos. E lembre: UDP elimina o ALB e o CloudFront, então o endpoint é um <b>NLB</b>.",
    "s": "u ga n1 n2",
    "x": "n1",
    "h": "n2",
    "f": [
     [
      "u",
      "ga",
      "ok"
     ],
     [
      "ga",
      "n2",
      "ok",
      "failover"
     ]
    ]
   }
  ],
  "q": {
   "q": "Um serviço de VoIP usa UDP em várias regiões e precisa de menor latência com failover automático. Qual combinação?",
   "o": [
    "CloudFront com ALB",
    "Global Accelerator com NLB",
    "Route 53 ponderado com ALB"
   ],
   "c": 1,
   "e": "UDP pede NLB, e o Global Accelerator escolhe a região mais próxima e faz o failover."
  }
 },
 {
  "t": "Quem registra o quê?",
  "n": {
   "act": [
    15,
    164,
    120,
    52,
    "Alguém",
    "usuário ou role"
   ],
   "api": [
    180,
    164,
    130,
    52,
    "Chamada de API"
   ],
   "res": [
    355,
    164,
    120,
    52,
    "Recurso",
    "EC2, S3, SG…"
   ],
   "ct": [
    170,
    40,
    150,
    52,
    "CloudTrail",
    "quem fez, quando"
   ],
   "cfg": [
    340,
    290,
    150,
    52,
    "Config",
    "o que mudou"
   ],
   "cw": [
    500,
    40,
    130,
    52,
    "CloudWatch",
    "métricas e logs"
   ]
  },
  "sc": [
   {
    "c": "Alguém altera um security group. Três serviços enxergam esse mesmo fato de jeitos diferentes.",
    "s": "act api res",
    "f": [
     [
      "act",
      "api",
      "ok"
     ],
     [
      "api",
      "res",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>CloudTrail</b> registra a chamada de API: quem fez, quando e de onde. É a resposta para a pergunta <b>quem fez isso?</b>",
    "s": "act api res ct",
    "h": "ct",
    "f": [
     [
      "act",
      "api",
      "ok"
     ],
     [
      "api",
      "res",
      "ok"
     ],
     [
      "api",
      "ct",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>Config</b> registra a configuração do recurso ao longo do tempo e avalia regras de conformidade. Responde <b>o que mudou?</b> e <b>está dentro da regra?</b>",
    "s": "act api res ct cfg",
    "h": "cfg",
    "f": [
     [
      "act",
      "api",
      "ok"
     ],
     [
      "api",
      "res",
      "ok"
     ],
     [
      "res",
      "cfg",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>CloudWatch</b> cuida de métricas, logs e alarmes de desempenho, como CPU alta. Não é ferramenta de auditoria.",
    "s": "act api res ct cfg cw",
    "h": "cw",
    "f": [
     [
      "act",
      "api",
      "ok"
     ],
     [
      "api",
      "res",
      "ok"
     ],
     [
      "res",
      "cw",
      "ok"
     ]
    ]
   },
   {
    "c": "Parentes que confundem: <b>Inspector</b> acha vulnerabilidades, <b>GuardDuty</b> detecta ameaças, <b>Macie</b> acha dados pessoais no S3 e <b>Trusted Advisor</b> dá recomendações.",
    "s": "act api res ct cfg cw",
    "f": [
     [
      "act",
      "api",
      "ok"
     ],
     [
      "api",
      "res",
      "ok"
     ],
     [
      "api",
      "ct",
      "ok"
     ],
     [
      "res",
      "cfg",
      "ok"
     ],
     [
      "res",
      "cw",
      "ok"
     ]
    ]
   }
  ],
  "q": {
   "q": "A empresa quer detectar automaticamente recursos sem as tags obrigatórias. Qual serviço?",
   "o": [
    "CloudTrail",
    "Regras do AWS Config",
    "Cost Explorer"
   ],
   "c": 1,
   "e": "Verificar se a configuração de um recurso segue uma regra é trabalho do Config."
  }
 },
 {
  "t": "Gateways de rede: qual porta é qual?",
  "n": {
   "vpc": [
    150,
    15,
    330,
    350,
    "VPC",
    0,
    1
   ],
   "pub": [
    160,
    88,
    150,
    108,
    "Sub-rede pública",
    0,
    1
   ],
   "prv": [
    160,
    214,
    150,
    140,
    "Sub-rede privada",
    0,
    1
   ],
   "net": [
    10,
    30,
    120,
    48,
    "Internet"
   ],
   "igw": [
    320,
    30,
    145,
    48,
    "Internet gateway",
    "porta da VPC"
   ],
   "nat": [
    172,
    122,
    126,
    52,
    "NAT gateway",
    "só saída"
   ],
   "ec2": [
    172,
    262,
    126,
    52,
    "EC2"
   ],
   "gwe": [
    328,
    122,
    140,
    52,
    "Gateway endpoint",
    "rota grátis"
   ],
   "vgw": [
    328,
    262,
    140,
    52,
    "Virtual private gw",
    "ponta da VPN"
   ],
   "s3": [
    500,
    122,
    130,
    52,
    "S3 e DynamoDB"
   ],
   "onp": [
    500,
    212,
    130,
    52,
    "On-premises",
    "seu data center"
   ],
   "tgw": [
    500,
    300,
    130,
    52,
    "Transit Gateway",
    "hub central"
   ]
  },
  "sc": [
   {
    "c": "Uma EC2 em sub-rede privada não fala com nada fora da VPC. Cada <b>gateway de rede</b> abre um caminho diferente.",
    "s": "vpc prv ec2 net",
    "f": [
     [
      "ec2",
      "net",
      "no"
     ]
    ]
   },
   {
    "c": "<b>Internet gateway (IGW)</b>: a porta da VPC para a internet, nos dois sentidos. Uma sub-rede é <b>pública</b> porque a tabela de rotas dela manda 0.0.0.0/0 para o IGW.",
    "s": "vpc pub prv igw net ec2",
    "h": "igw",
    "f": [
     [
      "net",
      "igw",
      "ok",
      "entra e sai"
     ],
     [
      "igw",
      "pub",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>NAT gateway</b>: fica na sub-rede pública e sai pelo IGW. A instância privada acessa a internet, mas <b>ninguém de fora inicia conexão</b> com ela. Só saída.",
    "s": "vpc pub prv igw net nat ec2",
    "h": "nat",
    "f": [
     [
      "ec2",
      "nat",
      "ok"
     ],
     [
      "nat",
      "igw",
      "ok"
     ],
     [
      "igw",
      "net",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>Gateway endpoint</b> (o “VPC gateway” das questões): não é porta para a internet. É uma <b>rota grátis para S3 e DynamoDB</b> que evita o NAT. Os outros serviços usam interface endpoint.",
    "s": "vpc pub prv igw net nat ec2 gwe s3",
    "h": "gwe",
    "f": [
     [
      "ec2",
      "gwe",
      "ok"
     ],
     [
      "gwe",
      "s3",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>Virtual private gateway</b>: a ponta do lado da AWS numa <b>VPN site-to-site</b> ou no <b>Direct Connect</b>. Liga a VPC ao seu data center. (Do lado de lá fica o customer gateway.)",
    "s": "vpc pub prv igw net nat ec2 gwe s3 vgw onp",
    "h": "vgw",
    "f": [
     [
      "ec2",
      "vgw",
      "ok"
     ],
     [
      "vgw",
      "onp",
      "ok",
      "VPN"
     ]
    ]
   },
   {
    "c": "<b>Transit Gateway</b>: um <b>hub central</b> que liga dezenas de VPCs e o on-premises num só ponto. Substitui a malha de VPC peering, que não é transitiva.",
    "s": "vpc pub prv igw net nat ec2 gwe s3 vgw onp tgw",
    "h": "tgw",
    "f": [
     [
      "vpc",
      "tgw",
      "ok",
      "anexo"
     ],
     [
      "tgw",
      "onp",
      "ok"
     ]
    ]
   }
  ],
  "q": {
   "q": "Instâncias em sub-rede privada precisam baixar atualizações da internet, sem aceitar conexões vindas de fora. O que usar?",
   "o": [
    "Um internet gateway ligado à sub-rede privada",
    "Um NAT gateway na sub-rede pública",
    "Um gateway endpoint"
   ],
   "c": 1,
   "e": "NAT gateway = só saída. Ligar o IGW tornaria a sub-rede pública, e o gateway endpoint só chega ao S3 e ao DynamoDB."
  }
 },
 {
  "t": "Gateways que não são de rede",
  "n": {
   "cli": [
    10,
    40,
    110,
    52,
    "Cliente",
    "app ou celular"
   ],
   "apg": [
    165,
    40,
    145,
    52,
    "API Gateway",
    "porta das APIs"
   ],
   "lam": [
    355,
    40,
    115,
    52,
    "Lambda"
   ],
   "ddb": [
    510,
    40,
    120,
    52,
    "DynamoDB"
   ],
   "srv": [
    10,
    164,
    110,
    52,
    "Servidor local",
    "NFS, SMB, iSCSI"
   ],
   "sgw": [
    165,
    164,
    145,
    52,
    "Storage Gateway",
    "disco local → AWS"
   ],
   "s3": [
    355,
    164,
    115,
    52,
    "S3"
   ],
   "trf": [
    10,
    288,
    110,
    52,
    "Tráfego",
    "de entrada"
   ],
   "glb": [
    165,
    288,
    145,
    52,
    "Gateway LB",
    "balanceia appliances"
   ],
   "fw": [
    355,
    288,
    115,
    52,
    "Firewall",
    "de terceiros"
   ],
   "app": [
    510,
    288,
    120,
    52,
    "Sua aplicação"
   ]
  },
  "sc": [
   {
    "c": "Três serviços têm “gateway” no nome e <b>não têm nada a ver com rotas da VPC</b>. Pense em cada um pelo que entra e pelo que sai.",
    "s": "cli apg srv sgw trf glb"
   },
   {
    "c": "<b>API Gateway</b>: a porta de entrada de APIs HTTP, REST e WebSocket. Recebe a requisição, autentica, limita a taxa e chama a Lambda. <b>Endpoint HTTPS serverless = API Gateway.</b>",
    "s": "cli apg lam ddb srv sgw trf glb",
    "h": "apg",
    "f": [
     [
      "cli",
      "apg",
      "ok",
      "HTTPS"
     ],
     [
      "apg",
      "lam",
      "ok"
     ],
     [
      "lam",
      "ddb",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>Storage Gateway</b>: um servidor no seu data center que fala NFS, SMB ou iSCSI e guarda os dados na AWS. <b>File</b> grava objetos no S3, <b>Volume</b> guarda blocos (em cache ou armazenado) e <b>Tape</b> substitui fitas.",
    "s": "cli apg lam ddb srv sgw s3 trf glb",
    "h": "sgw",
    "f": [
     [
      "srv",
      "sgw",
      "ok"
     ],
     [
      "sgw",
      "s3",
      "ok"
     ]
    ]
   },
   {
    "c": "<b>Gateway Load Balancer</b>: distribui o tráfego entre <b>appliances de terceiros</b>, como firewalls e IDS do Marketplace. O tráfego passa pelo appliance antes de chegar à aplicação.",
    "s": "cli apg lam ddb srv sgw s3 trf glb fw app",
    "h": "glb",
    "f": [
     [
      "trf",
      "glb",
      "ok"
     ],
     [
      "glb",
      "fw",
      "ok",
      "inspeção"
     ],
     [
      "fw",
      "app",
      "ok"
     ]
    ]
   },
   {
    "c": "Para decidir: <b>rota de rede</b> → IGW, NAT, endpoint, VGW ou Transit (aula anterior). <b>API</b> → API Gateway. <b>Arquivo ou disco local</b> → Storage Gateway. <b>Appliance de terceiros</b> → Gateway Load Balancer.",
    "s": "cli apg lam ddb srv sgw s3 trf glb fw app",
    "f": [
     [
      "cli",
      "apg",
      "ok"
     ],
     [
      "apg",
      "lam",
      "ok"
     ],
     [
      "srv",
      "sgw",
      "ok"
     ],
     [
      "sgw",
      "s3",
      "ok"
     ],
     [
      "trf",
      "glb",
      "ok"
     ],
     [
      "glb",
      "fw",
      "ok"
     ]
    ]
   }
  ],
  "q": {
   "q": "Um app móvel precisa de um endpoint HTTPS serverless que execute funções Lambda. Qual “gateway”?",
   "o": [
    "NAT gateway",
    "API Gateway",
    "Storage Gateway"
   ],
   "c": 1,
   "e": "API Gateway recebe as chamadas HTTPS e invoca a Lambda. NAT é saída de rede e Storage Gateway é armazenamento híbrido."
  }
 }
];
