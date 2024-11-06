# Invisio

Invisio é uma aplicação web interativa que permite a codificação e decodificação de mensagens secretas em imagens de avatares. Com técnicas de esteganografia, Invisio embute a mensagem em pixels específicos da imagem, tornando-a invisível ao olho humano, mas recuperável para quem possui a imagem e a ferramenta.

## Funcionalidades

- **Codificação de Mensagem**: Transforma uma mensagem digitada pelo usuário em código binário e a embute nos pixels da imagem.
- **Decodificação de Mensagem**: Extrai e decodifica a mensagem oculta de uma imagem que o usuário faz upload, revelando o texto embutido.
- **Interface Interativa e Responsiva**: Interface em 3D, criada com Three.js, que gera um avatar visualmente dinâmico e responsivo, adaptado a diferentes dispositivos.

## Tecnologias Utilizadas

- **JavaScript**: Lógica principal de codificação e decodificação de mensagens.
- **HTML5 Canvas**: Manipulação de pixels para embutir e extrair mensagens.
- **Three.js**: Renderização de gráficos 3D para o avatar.
- **CSS Responsivo**: Layout adaptado para dispositivos móveis e desktops.

## Como Funciona

1. **Codificação**: A mensagem digitada pelo usuário é transformada em binário. Usando a técnica de esteganografia, cada bit da mensagem é embutido nos bits menos significativos dos pixels da imagem, tornando-se invisível.
2. **Decodificação**: O usuário faz o upload da imagem gerada para o Invisio, que então lê os pixels e extrai a mensagem embutida.

## Exemplo de Uso

1. Digite uma mensagem secreta no campo de texto e clique em "Gerar Avatar Codificado".
2. Baixe a imagem resultante e envie para outra pessoa.
3. Para decodificar, a pessoa deve fazer o upload da imagem no Invisio e clicar em "Ver Mensagem Decodificada" para ler a mensagem oculta.

---

### Observações Técnicas

Invisio utiliza:
- **Cálculo Binário** para converter a mensagem em uma sequência de bits.
- **Esteganografia** para embutir os bits nos pixels da imagem.
- **HTML5 Canvas** para manipular a imagem e embutir a mensagem sem alterar o visual do avatar.
