describe('expenee add test', () => {
  it('visits the employee page and adds an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'products').click();
    cy.contains('control_point').click();
    cy.get('.mat-expansion-indicator').eq(0).click();
    cy.get('input[formcontrolname=id')
      .click({ force: true })
      .type('7X45');
    cy.get('mat-select[formcontrolname="vendorid"]').click();
    cy.get('mat-option').contains('Big Bills Depot').click();
    cy.get('input[formcontrolname=name')
      .click({ force: true })
      .type('Test Item');
    cy.get('input[formcontrolname=msrp]').clear();
    cy.get('input[formcontrolname=msrp]').type('129.99');
    cy.get('input[formcontrolname=costprice]').clear();
    cy.get('input[formcontrolname=costprice]').type('109.99');
    cy.get('.mat-expansion-indicator').eq(0).click();
    cy.get('.mat-expansion-indicator').eq(1).click();
    cy.get('input[formcontrolname=rop]').clear();
    cy.get('input[formcontrolname=rop]').type('10');
    cy.get('input[formcontrolname=eoq]').clear();
    cy.get('input[formcontrolname=eoq]').type('6');
    cy.get('input[formcontrolname=qoh]').clear();
    cy.get('input[formcontrolname=qoh]').type('6');
    cy.get('input[formcontrolname=qoo]').clear();
    cy.get('input[formcontrolname=qoo]').type('2');
    cy.get('button').contains('Save').click();
    cy.contains('added');
  });
});
