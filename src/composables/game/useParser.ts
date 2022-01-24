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

    // TODO: is there a way to move these to a separate file?

    this.RULE('magic', () => {
      this.OR([
        // @ts-ignore
        { ALT: () => this.SUBRULE(this.score) },
        // @ts-ignore
        { ALT: () => this.SUBRULE(this.look) },
        // @ts-ignore
        { ALT: () => this.SUBRULE(this.test) },
        // @ts-ignore
        { ALT: () => this.SUBRULE(this.walk) },
        // @ts-ignore
        { ALT: () => this.SUBRULE(this.verbNoun) },
      ]);
    });

    this.RULE('score', () => {
      // @ts-ignore
      this.CONSUME(tokenVocabulary.Score);
    });

    this.RULE('look', () => {
      // @ts-ignore
      this.CONSUME(tokenVocabulary.Look);
    });

    this.RULE('test', () => {
      // @ts-ignore
      this.CONSUME(tokenVocabulary.Test);
      this.OR([
        // @ts-ignore
        { ALT: () => this.CONSUME(tokenVocabulary.GameVerb) },
        // @ts-ignore
        { ALT: () => this.CONSUME(tokenVocabulary.Verb) },
        // @ts-ignore
        { ALT: () => this.CONSUME(tokenVocabulary.Noun) },
      ]);
    });

    this.RULE('walk', () => {
      this.OPTION(() => {
        // @ts-ignore
        this.CONSUME(tokenVocabulary.Walk);
      });
      // @ts-ignore
      this.CONSUME(tokenVocabulary.Direction);
    });

    // our fallback is a simple two-three word parser
    this.RULE('verbNoun', () => {
      // @ts-ignore
      this.CONSUME(tokenVocabulary.Verb);
      this.AT_LEAST_ONE(() => {
        // @ts-ignore
        this.CONSUME(tokenVocabulary.Noun);
      });
    });

    this.performSelfAnalysis(); // 1
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

  // @ts-ignore
  magic(ctx) {
    const scoreAst = this.visit(ctx.score);
    const lookAst = this.visit(ctx.look);
    const testAst = this.visit(ctx.test);
    const walkAst = this.visit(ctx.walk);
    const verbNounAst = this.visit(ctx.verbNoun);

    return {
      ...scoreAst,
      ...lookAst,
      ...testAst,
      ...walkAst,
      ...verbNounAst,
    };
  }

  // NOTE: All these methods MUST return an object containing a `verb`,
  // and an optional `noun` and `indirect`. All of these should be objects
  // containing an `input` key with the text the player typed, and a
  // `name` key with the system name of that verb or item.

  // TODO: is there a way to move these to a separate file?

  // @ts-ignore
  score(ctx) {
    return {
      verb: {
        input: ctx.Score[0].image,
        name: ctx.Score[0].tokenType.name,
      },
    };
  }

  // @ts-ignore
  look(ctx) {
    return {
      verb: {
        input: ctx.Look[0].image,
        name: ctx.Look[0].tokenType.name,
      },
    };
  }

  // @ts-ignore
  test(ctx) {
    let noun = {};

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

  // @ts-ignore
  walk(ctx) {
    return {
      verb: {
        name: 'Walk',
      },
      noun: {
        input: ctx.Direction[0].image,
        name: ctx.Direction[0].tokenType.name,
      },
    };
  }

  // @ts-ignore
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
      indirect: {
        input: ctx.Noun[1]?.image,
        name: ctx.Noun[1]?.tokenType.name,
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
// @ts-ignore
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
  // @ts-ignore
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
