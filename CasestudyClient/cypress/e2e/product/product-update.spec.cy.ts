describe('employee update test', () => {
  it('visits the employee page and updates an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'products').click();
    cy.contains('6X45').click(); // replace Slick with your own name
    cy.get('.mat-expansion-indicator').eq(0).click();
    cy.get("[formControlName='costprice']").clear();
    cy.get("[formControlName='costprice']").type('113.23');
    cy.get('button').contains('Save').click();
    cy.contains('updated');
  });
});
