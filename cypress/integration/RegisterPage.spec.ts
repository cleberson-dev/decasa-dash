describe('Registro do Lojista', () => {
  it('Deve carregar de forma sucedida', () => {
    cy.visit('/registrar');
    cy.contains('Registrar-se');
  });

  it('Deve ter o CNPJ formatado', () => {
    cy.get('label').contains('CNPJ').parent().find('input')
      .type('29111286000164')
      .should('have.value', '29.111.286/0001-64');
  });

  it('Deve ter o CPF formatado', () => {
    cy.get('label').contains('CPF').parent().find('input')
      .type('06903097082')
      .should('have.value', '069.030.970-82');
  });

  it('Deve preencher endereços automaticamente quando desfocar do CEP', () => {
    cy.get('label').contains('CEP').parent().find('input')
      .type('08226021')
      .blur();

    cy.get('label').contains('Logradouro').parent().find('input').should('have.value', 'Rua 18 de Abril');
    cy.get('label').contains('Bairro').parent().find('input').should('have.value', 'Cidade Antônio Estevão de Carvalho');
    cy.get('label').contains('UF').parent().find('button').contains('SP');
  });
});