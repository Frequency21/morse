import { BACK_SPACE, CLEAR } from '../../src/app/app.constants';

describe('General layout', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('Playground');
    cy.contains('About');
    cy.contains('Start Typing!');
  });
});

describe('Click events', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Clicks a letter and loses focus', () => {
    cy.get('button[data-letter=a]').click();
    cy.get('button[data-letter=a]').should('not.have.focus');
  });

  it('Clicks letters and text appears', () => {
    cy.get('button[data-letter=a]').click();
    cy.get('button[data-letter=s]').click();
    cy.get('button[data-letter=d]').click();
    cy.get('app-sentence').contains('ASD');
  });

  it('Fixes typo with backspace', () => {
    cy.get('button[data-letter=a]').click();
    cy.get('button[data-letter=s]').click();
    cy.get('button[data-letter=f]').click();
    cy.get(`button[data-letter=${BACK_SPACE}]`).click();
    cy.get('button[data-letter=d]').click();
    cy.get('app-sentence').contains('ASD');
  });

  it('Clears letters', () => {
    cy.get('button[data-letter=a]').click();
    cy.get('button[data-letter=s]').click();
    cy.get('button[data-letter=d]').click();
    cy.get(`button[data-letter=${CLEAR}]`).click();
    cy.contains('Start Typing!');
  });
});

describe('Keyboard events', () => {
  // NOTE: Document/Window/body event listeners are not replayed by
  // Angular. So we must wait some time until hydration happens.
  beforeEach(() => {
    cy.visit('/');
    cy.wait(500);
  });

  it("Types 'bar' and plays them", () => {
    const bar = 'bar';
    cy.clock();
    cy.get('body').type(bar);
    cy.tick(5000);
    cy.get('.letter.read').should('have.lengthOf', bar.length);
  });

  it('Fixes typo with backspace', () => {
    cy.get('body').type('bars{backspace}');
    cy.get('app-sentence').contains('BAR');
  });

  it('Clears letters', () => {
    cy.get('body').type('barC');
    cy.contains('Start Typing!');
  });
});
