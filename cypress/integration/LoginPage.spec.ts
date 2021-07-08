describe('Login do Lojista', () => {
  it('Deve somente carregar de forma sucedida', () => {
    cy.visit('/login');
    cy.contains('Entre no Marketplace');
  });

  it('Deve habilitar o botão de confirmação para dados válidos', () => {
    cy.get('input[type="email"]').first()
      .type('meuemail@meuemail.com');

    cy.get('input[type="password"]').first()
      .type('minhasenha123');
  });

  it('Deve desabilitar o botão de confirmação para dados inválidos', () => {
    cy.get('input[type="email"]').first()
      .clear()
      .type('emailinvalido');

    cy.get('input[type="password"]').first()
      .clear();

    cy.get('button[type="submit"]').first()
      .should('be.disabled');
  });
});

