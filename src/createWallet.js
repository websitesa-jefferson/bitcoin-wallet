// Importa a biblioteca BIP-32 para geração de chaves determinísticas hierárquicas (HD Wallets)
const bip32 = require('bip32')
// Importa a biblioteca BIP-39 para criação e conversão de palavras-mnemônicas (seed phrases)
const bip39 = require('bip39')
// Importa a biblioteca bitcoinjs-lib para manipulação de transações, redes e endereços Bitcoin
const bitcoin = require('bitcoinjs-lib')

// Define a rede como Testnet (ambiente de testes da rede Bitcoin)
const network = bitcoin.networks.testnet

// Define a rede principal do Bitcoin
//const network = bitcoin.networks.mainnet

// Define o caminho de derivação HD padrão BIP-49 para Testnet (propósito 49', moeda 1' para Testnet, conta 0', cadeia externa 0)
const path = `m/49'/1'/0'/0`

// Gera uma sequência aleatória de 12 palavras mnemônicas (backup humano legível)
let mnemonic = bip39.generateMnemonic()

// Converte a frase mnemônica de forma síncrona em uma seed binária de 512 bits
const seed = bip39.mnemonicToSeedSync(mnemonic)

// Cria a chave mestra HD (nó raiz) a partir da seed binária para a rede selecionada
let root = bip32.fromSeed(seed, network)

// Deriva o nó pai até o nível da cadeia externa usando o caminho de derivação definido
let account = root.derivePath(path)

// Deriva o primeiro índice de endereço (índice 0) a partir da cadeia externa
let node = account.derive(0).derive(0)

// Gera a estrutura do endereço Legado (P2PKH) utilizando a chave pública derivada e a rede especificada
let btcAddress = bitcoin.payments.p2pkh({
    // Passa o buffer da chave pública do nó derivado
    pubkey: node.publicKey,
    // Define os parâmetros de prefixo e formato da rede Testnet
    network: network,
// Extrai a string formatada do endereço gerado
}).address

console.log("Carteira gerada")
console.log("Endereço:", btcAddress)
// Converte e imprime a chave privada no formato WIF (Wallet Import Format)
console.log("Chave privada", node.toWIF())
console.log("Seed:", mnemonic)

// Consultar blockchain testnet
// https://mempool.space/testnet/address/[seu_endereco]