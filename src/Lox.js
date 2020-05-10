const fs = require('fs')
const Scanner = require('./Scanner')

var hadError = false;
var hadRuntimeError = false;

class Lox {
  static runFile(filename) {
    const source = fs.readFileSync(filename).toString()
    this._run(source)

    if (hadError) process.exit(65)
    if (hadRuntimeError) process.exit(70)
  }

  static error(line, message) {
    this._report(line, '', message)
  }

  static _report(line, where, message) {
    console.error(`[line ${line}] Error${where}: ${message}`)
    hadError = true
  }

  static _run(source) {
    const scanner = new Scanner(source, Lox)
    const tokens = scanner.scanTokens()

    // For now, just print the tokens.
    tokens.forEach(token => {
      console.log(token)
    })
    // const parser = new Parser(tokens, Lox)
    // const statements = parser.parse()
    // interpreter.interpret(statements, Lox)
  }
}

module.exports = Lox