import { createToken, Lexer } from 'chevrotain';
import { gameVerbs } from './useGameVerb';
import { verbs } from '../useVerb';
import { items } from '../useItem';

/**
 * Create Vocabulary Tokens
 *
 * `createToken` is used to create a TokenType.
 * The Lexer's output will contain an array of tokens created by metadata.
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
const GameVerb = createToken({ name: 'GameVerb', pattern: Lexer.NA });
const Verb = createToken({ name: 'Verb', pattern: Lexer.NA });
const Noun = createToken({ name: 'Noun', pattern: Lexer.NA });

// Generate Tokens for Each Game Verb
let gameVerbTokens = [];
Object.entries(gameVerbs).forEach(([name, item]) => {
  const i = item.value;
  gameVerbTokens.push(
    createToken({
      name: name,
      pattern: new RegExp(`${i.synonym.join('|')}`, 'i'),
      longer_alt: StringLiteral,
      categories: [GameVerb],
    })
  );
});

// Generate Tokens for Each Verb
let verbTokens = [];
Object.entries(verbs).forEach(([name, item]) => {
  const i = item.value;
  verbTokens.push(
    createToken({
      name: name,
      pattern: new RegExp(`${i.synonym.join('|')}`, 'i'),
      longer_alt: StringLiteral,
      categories: [Verb],
    })
  );
});

// Generate Tokens for Each Item
let itemTokens = [];
Object.entries(items).forEach(([name, item]) => {
  const i = item.value;
  itemTokens.push(
    createToken({
      name: name,
      pattern: new RegExp(
        `((${i.adjective?.join('|')}) )?(${i.synonym.join('|')})`,
        'i'
      ),
      longer_alt: StringLiteral,
      categories: [Noun],
    })
  );
});

// Others
const Integer = createToken({ name: 'Integer', pattern: /0|[1-9]\d*/ });
const Buzzword = createToken({
  name: 'Buzzword',
  pattern: /an|at|a|the|is|of/i,
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
  // WhiteSpace comes first as it is very common thus it will speed up the lexer.
  WhiteSpace,
  // "keywords" appear before the StringLiteral
  ...gameVerbTokens,
  ...verbTokens,
  ...itemTokens,
  GameVerb,
  Verb,
  Noun,
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
