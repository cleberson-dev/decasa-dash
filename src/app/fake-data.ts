import { Produto } from "./types";

type Entity = {
  [key: string]: any
}

export function getRandom(collection: Entity) {
  const entries = Object.entries(collection);
  const randomIdx = Math.floor(Math.random() * entries.length);
  const [_, randomValue] = entries[randomIdx];
  
  return randomValue;
}

export const marcas = {
  nike: { id: 1, nome: 'Nike' },
  fender: { id: 2, nome: 'Fender' },
  samsung: { id: 3, nome: 'Samsung' },
  apple: { id: 4, nome: 'Apple' },
  amanco: { id: 5, nome: 'Amanco' },
}

export const modelos = {
  airMax: { id: 1, nome: 'AirMax' },
  stratocaster: { id: 2, nome: 'Stratocaster' },
  galaxy: { id: 3, nome: 'Galaxy S21' },
  iPhone: { id: 4, nome: 'iPhone X' },
  modelo5: { id: 5, nome: 'Modelo #5' },
}

export const categorias = {
  smartphones: { id: 1, nome: 'Smartphones' },
  tablets: { id: 2, nome: 'Tablets' },
  fixos: { id: 3, nome: 'Telefones Fixos' },
  notebooks: { id: 4, nome: 'Notebooks' },
  aio: { id: 5, nome: 'Computadores All-in-One' },
  workstations: { id: 6, nome: 'Workstations' },
  roupas: { id: 7, nome: 'Roupas' },
  calcados: { id: 8, nome: 'Calçados' },
  acessorios: { id: 9, nome: 'Acessórios' },
  relogios: { id: 10, nome: 'Relógios' },
  geladeiras: { id: 11, nome: 'Geladeiras' },
  fogoes: { id: 12, nome: 'Fogões' },
  sofas: { id: 13, nome: 'Sofás' },
}

export const departamentos = {
  informatica: { id: 1, nome: 'Informática' },
  moda: { id: 2, nome: 'Moda' },
  musica: { id: 3, nome: 'Música' },
  moveis: { id: 4, nome: 'Móveis' },
  celulares: { id: 5, nome: 'Celulares' },
}

const defaultProduct = {
  cnp: '',
  detalhe: '',
  foto: '',
  manualInstrucao: '',
  videoDemonstrativo: '',
  quantidadeApresentacao: 1
};

export const produtos: Produto[] = [
  {
    ...defaultProduct,
    id: "1",
    nome: 'Produto 1',
    categoria: getRandom(categorias),
    departamento: getRandom(departamentos),
    marca: getRandom(marcas),
    modelo: getRandom(modelos),
  },
  {
    ...defaultProduct,
    id: "2",
    nome: 'Produto 2',
    categoria: getRandom(categorias),
    departamento: getRandom(departamentos),
    marca: getRandom(marcas),
    modelo: getRandom(modelos),
  },
  {
    ...defaultProduct,
    id: "3",
    nome: 'Produto 3',
    categoria: getRandom(categorias),
    departamento: getRandom(departamentos),
    marca: getRandom(marcas),
    modelo: getRandom(modelos),
  },
  {
    ...defaultProduct,
    id: "4",
    nome: 'Produto 4',
    categoria: getRandom(categorias),
    departamento: getRandom(departamentos),
    marca: getRandom(marcas),
    modelo: getRandom(modelos),
  },
  {
    ...defaultProduct,
    id: "5",
    nome: 'Produto 5',
    categoria: getRandom(categorias),
    departamento: getRandom(departamentos),
    marca: getRandom(marcas),
    modelo: getRandom(modelos),
  },
]