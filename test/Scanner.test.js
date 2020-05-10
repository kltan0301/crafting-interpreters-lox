/* global describe, it */
const fs = require('fs')
const assert = require('assert')
const Scanner = require('../src/Scanner')

describe('Scanner', () => {
  function generateTokens(fileName) {
    const source = fs.readFileSync(`./scripts/scanner/${fileName}`, 'utf-8');

    return new Scanner(source).scanTokens();
  }

  it('converts single tokens correctly', () => {
    const tokens = generateTokens('single-tokens.lox');

    assert.deepEqual(
      tokens.map(t => t.type),
        [
          'LEFT_PAREN',
          'RIGHT_PAREN',
          'SEMICOLON',
          'LEFT_BRACE',
          'RIGHT_BRACE',
          'SEMICOLON',
          'COMMA',
          'DOT',
          'MINUS',
          'PLUS',
          'SEMICOLON',
          'SLASH',
          'STAR',
          'EOF'
        ]
    )
  });

  it('converts single-double tokens correctly', () => {
    const tokens = generateTokens('single-double-tokens.lox');

    assert.deepEqual(
      tokens.map(t => t.type),
        [
          'BANG_EQUAL',
          'BANG',
          'LESS_EQUAL',
          'LESS',
          'GREATER_EQUAL',
          'GREATER',
          'EQUAL',
          'EQUAL_EQUAL',
          'EOF'
        ]
    );
  });

  it('converts literals tokens correctly', () => {
    const tokens = generateTokens('literals.lox');

    assert.deepEqual(
      tokens.map(t => t.type),
        [
          'IDENTIFIER',
          'STRING',
          'NUMBER',
          'EOF'
        ]
    );
  });

  it('converts keyword tokens correctly', () => {
    const tokens = generateTokens('keywords.lox');

    assert.deepEqual(
      tokens.map(t => t.type),
      [
        'AND',
        'CLASS',
        'ELSE',
        'FALSE',
        'FUN',
        'FOR',
        'IF',
        'NIL',
        'OR',
        'PRINT',
        'RETURN',
        'SUPER',
        'THIS',
        'TRUE',
        'VAR',
        'WHILE',
        'EOF'
      ]
    );
  });
})
