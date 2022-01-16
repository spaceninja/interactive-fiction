import { createToken, Lexer } from 'chevrotain';
import { items } from './useItem';

/**
 * Create Vocabulary Tokens
 *
 * `createToken` is used to create a TokenType.
 * The Lexer's output will contain an array of token Item created by metadata.
 *
 * We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
 * @see: https://github.com/chevrotain/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
 */

// This will catch any unrecognized words
const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /[a-zA-Z]\w*/,
});

// These are categories for the tokens.
const Action = createToken({ name: 'Action', pattern: Lexer.NA });
const Item = createToken({ name: 'Item', pattern: Lexer.NA });

// Example Actions

const Attack = createToken({
  name: 'Attack',
  pattern: /attack|stab/,
  longer_alt: StringLiteral,
  categories: [Action],
});
const Kiss = createToken({
  name: 'Kiss',
  pattern: /kiss|smooch/,
  longer_alt: StringLiteral,
  categories: [Action],
});

// Example Items

const Troll = createToken({
  name: 'Troll',
  pattern: /troll|ogre/,
  longer_alt: StringLiteral,
  categories: [Item],
});
const Elf = createToken({
  name: 'Elf',
  pattern: /elf|drow/,
  longer_alt: StringLiteral,
  categories: [Item],
});

// Generate Tokens for Each Item

let itemTokens = [];
Object.entries(items).forEach(([name, item]) => {
  itemTokens.push(
    createToken({
      name: name,
      pattern: new RegExp(
        `(${item.value.adjective.join('|')}) (${item.value.synonym.join('|')})`
      ),
      longer_alt: StringLiteral,
      categories: [Item],
    })
  );
});

// Others

const Integer = createToken({ name: 'Integer', pattern: /0|[1-9]\d*/ });
const Buzzword = createToken({
  name: 'Buzzword',
  pattern: /an|a|the|is|of/,
  longer_alt: StringLiteral,
  group: Lexer.SKIPPED,
});
const Punctuation = createToken({
  name: 'Punctuation',
  pattern: /\?/,
  group: Lexer.SKIPPED,
});
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

// The order of tokens is important
export const allTokens = [
  WhiteSpace,
  // "keywords" appear before the StringLiteral
  Attack,
  Kiss,
  Troll,
  Elf,
  ...itemTokens,
  Action,
  Item,
  Integer,
  Buzzword,
  Punctuation,
  // The StringLiteral must appear after the keywords because all keywords are valid identifiers.
  StringLiteral,
];

// the vocabulary will be exported and used in the Parser definition.
export const tokenVocabulary = {};
allTokens.forEach((tokenType) => {
  tokenVocabulary[tokenType.name] = tokenType;
});
