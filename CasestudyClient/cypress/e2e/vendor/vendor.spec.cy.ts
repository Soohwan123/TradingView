describe('vendor page test', () => {
  it('Visits the vendor case study page', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'vendors').click();
    cy.contains('vendors loaded!!');
  });
});
