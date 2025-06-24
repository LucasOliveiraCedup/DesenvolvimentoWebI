// Front-End
// Deve ser executado usando o Live Server
// Necessário chamar as funções

// Função que lista todos os produtos da nossa tabela produtos
async function listarProdutos() {
  try {
    // Realixa uma rota GET em /listarProd
    const resposta = await fetch('http://localhost:3000/listarProd');
    // A resposta do servidor fica armazenada no vetor produtos
    // Esse vetor funciona de maneira semelhante ao ArrayList de java
    const produtos = await resposta.json();

    // Para cada produto no vetor produtos faça:
    produtos.forEach(produto => {
      console.log(`Nome: ${produto.nome_prod} | 
                   Quantidade: ${produto.quant_prod} | 
                   R$ ${produto.preco_prod}`);
      });
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);
  }
}

// Realiza a busca por um produto em específico e diz se ele tem estoque ou está em falta
async function VefificarDisponibilidade(nome) {
  try {
    // Utiliza uma rota POST porque a rota GET não pode enviar dados ao servidor
    const resposta = await fetch('http://localhost:3000/verificaDisp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Encaminha nome que veio como parametro no corpo do arquivo JSON
      body: JSON.stringify({
        nome_prod: nome
      })
    });

    // A variável dados recebe um objeto produto
    const dados = await resposta.json();

    if (resposta.ok) {
      // Se quantidade do produto for maior que zero
      if(dados.produto.quant_prod > 0){
        console.log('Produto a pronta entrega');
      } else {
        console.log('Produto em falta');
      }
    } else {
      switch (resposta.status) {
        case 400:
          console.warn('⚠️ Produto não encontrado. Verifique se o nome do produto está correto');
          break;
        case 401:
          console.warn('⚠️ Nenhum produto encontrado');
          break;
        case 500:
          console.warn('💥 Erro interno no servidor. Tente novamente mais tarde.');
          break;
        default:
          console.warn(`❗ Erro inesperado: ${resposta.status}`);
      }

      console.debug('Detalhes do erro:', dados.mensagem || dados);
    }
  } catch (erro) {
    console.error('🚫 Erro ao tentar buscar o produto:', erro.message);
  }
}

//Função para cadastrar um novo produto
async function cadastrarProduto(nome, quant, preco){
  try{
    //alterar o caminho 'hppt://localhost:3000/....'
    const resposta = await fetch('http://localhost:3000/cadProd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // Itens que serão enviados no corpo do arquivo JSON
      // Segue o seguinte padrão:
      // <nomeIgualAoBD>: <variavel>
      body: JSON.stringify({
        nome_prod: nome,
        quant_prod: quant,
        preco_prod: preco
      })
    });

    // A variável dados está recebendo a resposta que veio do servidor
    const dados = await resposta.json();

    if (resposta.ok) {
      //Se a resposta for o código 201(Deu tudo certo):
      console.log('✅ Produto registrado com sucesso!');
      console.log('Detalhes:', dados);
    } else {
      // Caso contrário mostra os possíveis erros
      switch (resposta.status) {
        case 400:
          console.warn('⚠️ Dados inválidos. Verifique se todos os campos foram preenchidos corretamente.');
          break;
        case 409:
          console.warn('❗ Esse produto já está cadastrado. Tente outro.');
          break;
        case 500:
          console.warn('💥 Erro interno no servidor. Tente novamente mais tarde.');
          break;
        default:
          console.warn(`❗ Erro inesperado: ${resposta.status}`);
      }

      console.debug('Detalhes do erro:', dados.mensagem || dados);
    }
  } catch (erro) {
    console.error('🚫 Erro ao tentar registrar o produto:', erro.message);
  }
}

//cadastrarProduto("Garfo", 50, 5.5);
VefificarDisponibilidade("faca");
//listarProdutos();