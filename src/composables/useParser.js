import { createToken, CstParser, Lexer } from 'chevrotain';
import { theVerb, theObject } from '../composables/useGlobal';

const stripWords = [
  'a',
  'an',
  'the',
  'is',
  'and',
  'of',
  'then',
  'all', // I think we need this one?
  'one',
  'but',
  'except',
  'yes',
  'no',
  'y',
  'here',
];

const punctuationRegEx = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

export const parser = (input) => {
  // Convert to lowercase, strip punction and useless words, break into tokens
  const lowercase = input.toLowerCase();
  const punctiationless = lowercase.replace(punctuationRegEx, '');
  const tokens = punctiationless.split(' ');
  const filteredTokens = tokens.filter((t) => !stripWords.includes(t));

  console.log(filteredTokens);

  // Assign to globals
  theVerb.value = filteredTokens[0];
  theObject.value = filteredTokens[1];
};

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadata
const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /[a-zA-Z]\w*/,
});
const actions = createToken({ name: 'Actions', pattern: Lexer.NA });
const objects = createToken({ name: 'Objects', pattern: Lexer.NA });
// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/chevrotain/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
const attack = createToken({
  name: 'Attack',
  pattern: /attack|stab/,
  longer_alt: StringLiteral,
  categories: [actions],
});
const kiss = createToken({
  name: 'Kiss',
  pattern: /kiss|smooch/,
  longer_alt: StringLiteral,
  categories: [actions],
});
const troll = createToken({
  name: 'Troll',
  pattern: /troll|ogre/,
  longer_alt: StringLiteral,
  categories: [objects],
});
const elf = createToken({
  name: 'Elf',
  pattern: /elf|drow/,
  longer_alt: StringLiteral,
  categories: [objects],
});
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});
const The = createToken({
  name: 'The',
  pattern: /the/,
  group: Lexer.SKIPPED,
});

// The order of tokens is important
export const allTokens = [
  WhiteSpace,
  // "keywords" appear before the StringLiteral
  attack,
  kiss,
  troll,
  elf,
  actions,
  objects,
  The,
  // The StringLiteral must appear after the keywords because all keywords are valid identifiers.
  StringLiteral,
];

// the vocabulary will be exported and used in the Parser definition.
export const tokenVocabulary = {};
allTokens.forEach((tokenType) => {
  tokenVocabulary[tokenType.name] = tokenType;
});

// Create a new Lexer using our tokens
const magicLexer = new Lexer(allTokens);

// Pass input to the Lexer, handle errors
// The Lexer should only fail if it finds something it doesn't recognize as a token
export const lex = (inputText) => {
  const lexingResult = magicLexer.tokenize(inputText);

  if (lexingResult.errors.length > 0) {
    throw Error('Sad Sad Panda, lexing errors detected');
  }

  return lexingResult;
};

// Create a new Parser using our vocabulary
export class magicParser extends CstParser {
  constructor() {
    super(tokenVocabulary);

    // for conciseness
    const $ = this;

    $.RULE('magic', () => {
      $.SUBRULE($.verb);
      $.SUBRULE($.noun);
    });

    $.RULE('verb', () => {
      $.CONSUME(actions);
    });

    $.RULE('noun', () => {
      $.CONSUME(objects);
    });

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }
}

// A new parser instance with CST output (enabled by default).
// We only ever need one as the parser internal state is reset for each new input.
export const parserInstance = new magicParser();

export const parse = (inputText) => {
  const lexResult = lex(inputText);

  // ".input" is a setter which will reset the parser's internal's state.
  parserInstance.input = lexResult.tokens;

  // No semantic actions so this won't return anything yet.
  parserInstance.magic();

  if (parserInstance.errors.length > 0) {
    throw Error(
      'Sad sad panda, parsing errors detected!\n' +
        parserInstance.errors[0].message
    );
  }
};

// The base visitor class can be accessed via the a parser instance.
const BaseMagicVisitor = parserInstance.getBaseCstVisitorConstructor();

class MagicToAstVisitor extends BaseMagicVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  magic(ctx) {
    const verb = this.visit(ctx.verb);
    const noun = this.visit(ctx.noun);

    return {
      type: 'MAGIC',
      verb,
      noun,
    };
  }

  verb(ctx) {
    return {
      name: ctx.Actions[0].image,
      type: ctx.Actions[0].tokenType.name,
      ctx,
    };
  }

  noun(ctx) {
    return {
      name: ctx.Objects[0].image,
      type: ctx.Objects[0].tokenType.name,
      ctx,
    };
  }
}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new MagicToAstVisitor();

export const toAst = (inputText) => {
  // Lex
  const lexResult = lex(inputText);
  parserInstance.input = lexResult.tokens;

  // Automatic CST created when parsing
  const cst = parserInstance.magic();
  if (parserInstance.errors.length > 0) {
    return {
      type: 'ERROR',
      name: parserInstance.errors[0].name,
      message: parserInstance.errors[0].message,
      token: parserInstance.errors[0].token,
    };
  }

  // Visit
  const ast = toAstVisitorInstance.visit(cst);
  return ast;
};
