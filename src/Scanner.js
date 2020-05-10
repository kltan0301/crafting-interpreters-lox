const TokenType = require('./TokenType')
const Token = require('./Token')
const Lox = require('./Lox')

const reservedWords = {
  and: TokenType.AND,
  class: TokenType.CLASS,
  else: TokenType.ELSE,
  false: TokenType.FALSE,
  for: TokenType.FOR,
  fun: TokenType.FUN,
  if: TokenType.IF,
  nil: TokenType.NIL,
  or: TokenType.OR,
  print: TokenType.PRINT,
  return: TokenType.RETURN,
  super: TokenType.SUPER,
  this: TokenType.THIS,
  true: TokenType.TRUE,
  var: TokenType.VAR,
  while: TokenType.WHILE
}

class Scanner {
  constructor(source, Lox) {
    this.Lox = Lox;

    this.source = source;
    this.tokens = [];

    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  scanTokens() {
    while(!this._isAtEnd()) {
      this.start = this.current;
      this._scanToken()
    }
    this.tokens.push(new Token(TokenType.EOF, '', null, this.line))
    return this.tokens;
  }

  _advance() {
    const char = this.source[this.current];
    this.current += 1;
    return char;
  }

  _addToken(type, literal = null) {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push(new Token(type, text, literal, this.line))
  }


  _peek() {
    if (this._isAtEnd()) { return '\0'; }

    return this.source[this.current]
  }

  _isAtEnd() {
    return this.current >= this.source.length;
  }

  _match(expectedChar) {
    if (this._isAtEnd()) { return false; }
    if (this.source[this.current] !== expectedChar) { return false; }
    this.current += 1;
    return true;
  }

  _scanString() {
    var nextChar;
    nextChar = this._peek();
    while (this._peek() !== '"' && !this._isAtEnd()) {
      if (this._peek() === '\n') { this.line++; }

      this._advance();
    }

    // Unterminated string.
    if (this._isAtEnd()) {
      this.Lox.error(this.line, 'Unterminated string.')
      return
    }

    // The closing ".
    this._advance()

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1)
    this._addToken(TokenType.STRING, value)
  }

  _isDigit(char) {
    return char >= '0' && char <= '9'
  }

  _peekNext() {
    if (this.current + 1 >= this.source.length) { return '\0'; }
    return this.source[this.current + 1];
  }

  _scanNumber() {
    while (this._isDigit(this._peek())) {
      this._advance()
    }

    // Look for a fractional part.
    if (this._peek() === '.' && this._isDigit(this._peekNext())) {
      // Consume the "."
      this._advance()

      while (this._isDigit(this._peek())) {
        this._advance()
      }
    }

    this._addToken(TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)));
  }

  _isAlpha(char) {
    return char >= 'a' && char <= 'z' ||
      (char >= 'A' && char <= 'Z') ||
      char === '_';
  }

  _isAlphaNumeric(char) {
    return this._isAlpha(char) || this._isDigit(char);
  }

  _scanIdentifier(char) {
    while (this._isAlphaNumeric(this._peek())) { this._advance(); }
    const text = this.source.substring(this.start, this.current);


    const type = text in reservedWords ? reservedWords[text] : TokenType.IDENTIFIER;
    this._addToken(type);
  }

  _scanToken() {
    const char = this._advance();
    switch (char) {
      case '(':
        this._addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this._addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this._addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        this._addToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        this._addToken(TokenType.COMMA);
        break;
      case '.':
        this._addToken(TokenType.DOT);
        break;
      case '-':
        this._addToken(TokenType.MINUS);
        break;
      case '+':
        this._addToken(TokenType.PLUS);
        break;
      case ';':
        this._addToken(TokenType.SEMICOLON);
        break;
      case '*':
        this._addToken(TokenType.STAR);
        break;
      case '!':
        this._addToken(this._match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this._addToken(this._match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this._addToken(this._match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this._addToken(this._match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      case '/':
        if (this._match('/')) {
          // A comment goes until the end of the line.
          while (this._peek() !== '\n' && !this._isAtEnd()) {
            this._advance()
          }
        } else {
          this._addToken(TokenType.SLASH)
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;
      case '\n':
        this.line += 1;
        break;
      case '"':
        this._scanString();
        break;
      default:
        if (this._isDigit(char)) {
          this._scanNumber();
        } else if(this._isAlpha(char)) {
          this._scanIdentifier();
        } else {
          this.Lox.error(this.line, 'Unexpected character.');
        }
        break;
    }
  }
}

module.exports = Scanner;