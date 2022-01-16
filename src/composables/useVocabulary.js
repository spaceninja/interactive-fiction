import { createToken, Lexer } from 'chevrotain';

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
