/* eslint-disable no-undef */
// from Chevrotain playground
(function jsonGrammarOnlyExample() {
  // ----------------- Lexer -----------------
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;

  const StringLiteral = createToken({
    name: 'StringLiteral',
    pattern: /[a-zA-Z]\w*/,
  });

  const Actions = createToken({ name: 'Actions', pattern: Lexer.NA });
  const Items = createToken({ name: 'Items', pattern: Lexer.NA });

  const attack = createToken({
    name: 'Attack',
    pattern: /attack/,
    longer_alt: StringLiteral,
    categories: [Actions],
  });
  const kiss = createToken({
    name: 'Kiss',
    pattern: /kiss/,
    longer_alt: StringLiteral,
    categories: [Actions],
  });
  const troll = createToken({
    name: 'Troll',
    pattern: /troll/,
    longer_alt: StringLiteral,
    categories: [Items],
  });
  const elf = createToken({
    name: 'Elf',
    pattern: /elf/,
    longer_alt: StringLiteral,
    categories: [Items],
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

  const allTokens = [
    WhiteSpace,
    attack,
    kiss,
    troll,
    elf,
    Actions,
    Items,
    The,
    StringLiteral,
  ];

  const magicLexer = new Lexer(allTokens);

  // ----------------- parser -----------------
  const CstParser = chevrotain.CstParser;

  class magicParser extends CstParser {
    constructor() {
      super(allTokens);

      const $ = this;

      $.RULE('magic', () => {
        $.SUBRULE($.verb);
        $.SUBRULE($.noun);
      });

      $.RULE('verb', () => {
        $.CONSUME(Actions);
      });

      $.RULE('noun', () => {
        $.CONSUME(Items);
      });

      // very important to call this after all the rules have been setup.
      // otherwise the parser may not work correctly as it will lack information
      // derived from the self analysis.
      this.performSelfAnalysis();
    }
  }

  // for the playground to work the returned object must contain these fields
  return {
    lexer: magicLexer,
    parser: magicParser,
    defaultRule: 'magic',
  };
})();
