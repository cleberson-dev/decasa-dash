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
  nike: { id: 1, descricao: 'Nike' },
  fender: { id: 2, descricao: 'Fender' },
  samsung: { id: 3, descricao: 'Samsung' },
  apple: { id: 4, descricao: 'Apple' },
  amanco: { id: 5, descricao: 'Amanco' },
}

export const modelos = {
  airMax: { id: 1, descricao: 'AirMax', marca: getRandom(marcas) },
  stratocaster: { id: 2, descricao: 'Stratocaster', marca: getRandom(marcas) },
  galaxy: { id: 3, descricao: 'Galaxy S21', marca: getRandom(marcas) },
  iPhone: { id: 4, descricao: 'iPhone X', marca: getRandom(marcas) },
  modelo5: { id: 5, descricao: 'Modelo #5', marca: getRandom(marcas) },
}

export const departamentos = {
  informatica: { id: 1, descricao: 'Informática' },
  moda: { id: 2, descricao: 'Moda' },
  musica: { id: 3, descricao: 'Música' },
  moveis: { id: 4, descricao: 'Móveis' },
  celulares: { id: 5, descricao: 'Celulares' },
}

export const categorias = {
  smartphones: { id: 1, descricao: 'Smartphones', departamento: getRandom(departamentos) },
  tablets: { id: 2, descricao: 'Tablets', departamento: getRandom(departamentos) },
  fixos: { id: 3, descricao: 'Telefones Fixos', departamento: getRandom(departamentos) },
  notebooks: { id: 4, descricao: 'Notebooks', departamento: getRandom(departamentos) },
  aio: { id: 5, descricao: 'Computadores All-in-One', departamento: getRandom(departamentos) },
  workstations: { id: 6, descricao: 'Workstations', departamento: getRandom(departamentos) },
  roupas: { id: 7, descricao: 'Roupas', departamento: getRandom(departamentos) },
  calcados: { id: 8, descricao: 'Calçados', departamento: getRandom(departamentos) },
  acessorios: { id: 9, descricao: 'Acessórios', departamento: getRandom(departamentos) },
  relogios: { id: 10, descricao: 'Relógios', departamento: getRandom(departamentos) },
  geladeiras: { id: 11, descricao: 'Geladeiras', departamento: getRandom(departamentos) },
  fogoes: { id: 12, descricao: 'Fogões', departamento: getRandom(departamentos) },
  sofas: { id: 13, descricao: 'Sofás', departamento: getRandom(departamentos) },
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
    id: 1,
    descricao: 'Produto 1',
    categoria: getRandom(categorias),
    modelo: getRandom(modelos),
  },
  {
    ...defaultProduct,
    id: 2,
    descricao: 'Produto 2',
    categoria: getRandom(categorias),
    modelo: getRandom(modelos),
  },
  {
    ...defaultProduct,
    id: 3,
    descricao: 'Produto 3',
    categoria: getRandom(categorias),
    modelo: getRandom(modelos),
  },
  {
    ...defaultProduct,
    id: 4,
    descricao: 'Produto 4',
    categoria: getRandom(categorias),
    modelo: getRandom(modelos),
  },
  {
    ...defaultProduct,
    id: 5,
    descricao: 'Produto 5',
    categoria: getRandom(categorias),
    modelo: getRandom(modelos),
  },
]