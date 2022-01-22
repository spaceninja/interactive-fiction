import { CstParser, Lexer } from 'chevrotain';
import { allTokens, tokenVocabulary } from './useParserVocabulary';

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
        { ALT: () => $.SUBRULE($.look) },
        { ALT: () => $.SUBRULE($.test) },
        { ALT: () => $.SUBRULE($.verbNoun) },
      ]);
    });

    $.RULE('score', () => {
      $.CONSUME(tokenVocabulary.Score);
    });

    $.RULE('look', () => {
      $.CONSUME(tokenVocabulary.Look);
    });

    $.RULE('test', () => {
      $.CONSUME(tokenVocabulary.Test);
      $.OR([
        { ALT: () => $.CONSUME(tokenVocabulary.GameVerb) },
        { ALT: () => $.CONSUME(tokenVocabulary.Verb) },
        { ALT: () => $.CONSUME(tokenVocabulary.Noun) },
      ]);
    });

    // our fallback is a simple two word parser
    $.RULE('verbNoun', () => {
      $.CONSUME(tokenVocabulary.Verb);
      $.CONSUME(tokenVocabulary.Noun);
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
    const lookAst = this.visit(ctx.look);
    const testAst = this.visit(ctx.test);
    const verbNounAst = this.visit(ctx.verbNoun);

    return {
      ...scoreAst,
      ...lookAst,
      ...testAst,
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

  look(ctx) {
    return {
      verb: {
        input: ctx.Look[0].image,
        name: ctx.Look[0].tokenType.name,
      },
    };
  }

  test(ctx) {
    let noun = false;

    if (ctx.GameVerb) {
      noun = {
        input: ctx.GameVerb[0].image,
        name: ctx.GameVerb[0].tokenType.name,
      };
    }

    if (ctx.Verb) {
      noun = {
        input: ctx.Verb[0].image,
        name: ctx.Verb[0].tokenType.name,
      };
    }

    if (ctx.Noun) {
      noun = {
        input: ctx.Noun[0].image,
        name: ctx.Noun[0].tokenType.name,
      };
    }

    return {
      ctx,
      verb: {
        input: ctx.Test[0].image,
        name: ctx.Test[0].tokenType.name,
      },
      noun,
    };
  }

  verbNoun(ctx) {
    return {
      verb: {
        input: ctx.Verb[0].image,
        name: ctx.Verb[0].tokenType.name,
      },
      noun: {
        input: ctx.Noun[0].image,
        name: ctx.Noun[0].tokenType.name,
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
  console.log('INPUT', parserInstance.input);

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

  console.log('CST', cst);

  // Visit
  return visitorInstance.visit(cst);
};
