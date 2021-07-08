it('Deve somente carregar de forma sucedida', () => {
  cy.visit('/');
  cy.contains('Minha Loja');
});
