import { CstParser, Lexer } from 'chevrotain';
import { allTokens, tokenVocabulary } from './useVocabulary';

// Create a Player Input Lexer using our game's tokens.
const playerInputLexer = new Lexer(allTokens);

/**
 * Parser
 *
 * Create a new Parser using our vocabulary, returns a
 *
 * 1. Very important to call this after all the rules have been defined.
 *    Otherwise the parser may not work correctly as it will lack information
 *    derived during the self analysis phase.
 */
class playerInputParser extends CstParser {
  constructor() {
    super(tokenVocabulary);
    const $ = this;

    // TODO: is there a way to move these to a separate file?

    $.RULE('magic', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.score) },
        { ALT: () => $.SUBRULE($.verbNoun) },
      ]);
    });

    $.RULE('score', () => {
      $.CONSUME(tokenVocabulary.Score);
    });

    // our fallback is a simple two word parser
    $.RULE('verbNoun', () => {
      $.CONSUME(tokenVocabulary.Action);
      $.CONSUME(tokenVocabulary.Item);
    });

    $.performSelfAnalysis(); // 1
  }
}

// Create an instance of our Player Input Parser. We only ever need one,
// as the parser's internal state is reset for each new input.
const parserInstance = new playerInputParser();

/**
 * CST Visitor
 *
 * This "Visitor" goes over the Concrete Syntax Tree (CST) result returned
 * from the parser, and turns it into an Abstract Syntax Tree (AST),
 * a more useful return object.
 */
class PlayerInputVisitor extends parserInstance.getBaseCstVisitorConstructor() {
  constructor() {
    super();
    // This helper will detect any missing or redundant methods on this visitor
    this.validateVisitor();
  }

  magic(ctx) {
    const scoreAst = this.visit(ctx.score);
    const verbNounAst = this.visit(ctx.verbNoun);

    return {
      ...scoreAst,
      ...verbNounAst,
    };
  }

  // NOTE: All these methods MUST return an object containing a `verb`,
  // and an optional `noun` and `indirect`. All of these should be objects
  // containing an `input` key with the text the player typed, and a
  // `name` key with the system name of that verb or item.

  // TODO: is there a way to move these to a separate file?

  score(ctx) {
    return {
      verb: {
        input: ctx.Score[0].image,
        name: ctx.Score[0].tokenType.name,
      },
    };
  }

  verbNoun(ctx) {
    return {
      verb: {
        input: ctx.Action[0].image,
        name: ctx.Action[0].tokenType.name,
      },
      noun: {
        input: ctx.Item[0].image,
        name: ctx.Item[0].tokenType.name,
      },
    };
  }
}

// Create an instance of our Player Input Visitor. Our visitor has no
// state, so a single instance is sufficient.
const visitorInstance = new PlayerInputVisitor();

/**
 * Parse Player Input
 *
 * Takes player input, runs it through the lexer, parser, and visitor,
 * to generate an AST return object with the properties our app expects.
 *
 * 1. `.input` is a setter which will reset the parser's internal's state.
 *
 * @param {string} playerInput
 * @returns object
 */
export const parser = (playerInput) => {
  // Lex
  const lexResult = playerInputLexer.tokenize(playerInput);
  if (lexResult.errors.length > 0) {
    return {
      error: {
        message: lexResult.errors[0].message,
        token: playerInput.slice(
          lexResult.errors[0].offset,
          lexResult.errors[0].offset + lexResult.errors[0].length
        ),
        // TODO: remove once we don't need to reference the full error object
        errors: lexResult.errors,
      },
    };
  }
  parserInstance.input = lexResult.tokens; // 1

  // Parse
  const cst = parserInstance.magic();
  if (parserInstance.errors.length > 0) {
    return {
      error: {
        message: parserInstance.errors[0].message,
        token: parserInstance.errors[0].token.image,
        // TODO: remove once we don't need to reference the full error object
        input: parserInstance.input,
        errors: parserInstance.errors,
      },
    };
  }

  console.log('CST RESULTS', cst);

  // Visit
  return visitorInstance.visit(cst);
};
