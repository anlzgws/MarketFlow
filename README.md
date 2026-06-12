# MarketFlow

## Visão Geral

O **MarketFlow** é um aplicativo mobile-first desenvolvido para auxiliar usuários durante suas compras em supermercados, permitindo o acompanhamento dos gastos em tempo real e evitando surpresas no momento do pagamento.

A proposta da aplicação é oferecer uma experiência simples, rápida e intuitiva, permitindo que o usuário registre produtos diretamente enquanto percorre os corredores do estabelecimento. A cada item adicionado, o sistema atualiza automaticamente o valor total da compra, proporcionando maior controle financeiro e transparência durante todo o processo.

## Objetivo

Permitir que o usuário acompanhe o valor total de suas compras em tempo real, registrando produtos, preços e quantidades diretamente pelo smartphone, facilitando o planejamento financeiro e a organização das compras.

## Funcionalidades Principais

### Captura de Produtos por Foto

O usuário pode registrar produtos utilizando a câmera do dispositivo móvel. As imagens são automaticamente otimizadas antes do armazenamento, garantindo melhor desempenho e economia de recursos.

### Cálculo Automático em Tempo Real

O sistema realiza a soma automática dos produtos cadastrados, exibindo continuamente:

* Valor total da compra;
* Quantidade total de itens cadastrados.

Essas informações permanecem visíveis em um rodapé fixo durante toda a navegação.

### Gerenciamento de Itens

Os produtos adicionados podem ser editados a qualquer momento, permitindo alterações em:

* Nome do produto;
* Imagem;
* Preço;
* Quantidade.

### Controle de Quantidade

A aplicação disponibiliza botões de incremento e decremento para facilitar o ajuste rápido da quantidade de unidades de cada produto.

### Autenticação e Segurança

Cada usuário possui uma conta individual protegida por autenticação, garantindo que apenas o proprietário tenha acesso à sua lista de compras.

### Experiência Mobile-First

Toda a interface foi projetada prioritariamente para dispositivos móveis, permitindo utilização confortável com apenas uma mão durante as compras.

## Design e Experiência do Usuário

O MarketFlow adota uma identidade visual minimalista e moderna, inspirada em aplicações premium. Sua interface prioriza clareza e simplicidade, reduzindo distrações e mantendo o foco nas informações essenciais da compra.

### Características Visuais

* Fundo em tons off-white;
* Títulos utilizando a fonte Instrument Serif;
* Textos e elementos de interface utilizando a fonte Inter;
* Espaçamento amplo entre componentes;
* Navegação simplificada;
* Ausência de elementos visuais desnecessários.

Essa abordagem proporciona uma experiência elegante, organizada e intuitiva.

## Tecnologias Utilizadas

### Front-end

* React
* TanStack Start
* Tailwind CSS

### Back-end e Infraestrutura

* node.js

### Serviços Utilizados

* Banco de dados
* Sistema de autenticação
* Armazenamento de imagens

### Segurança

* Row Level Security (RLS) para isolamento e proteção dos dados de cada usuário

## Público-Alvo

O sistema é destinado a consumidores que desejam acompanhar seus gastos durante compras em supermercados, mercados de bairro, atacadistas e estabelecimentos similares, proporcionando maior controle financeiro e previsibilidade dos custos.

