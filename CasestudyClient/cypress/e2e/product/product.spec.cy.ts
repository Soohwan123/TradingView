describe('employee page test', () => {
  it('Visits the employee project page', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'expenses').click();
    cy.contains('Expenses loaded!!');
  });
});
