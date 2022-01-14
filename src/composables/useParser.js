import { createToken, Lexer } from 'chevrotain';
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
  pattern: /attack/,
  longer_alt: StringLiteral,
  categories: [actions],
});
const kiss = createToken({
  name: 'Kiss',
  pattern: /kiss/,
  longer_alt: StringLiteral,
  categories: [actions],
});
const troll = createToken({
  name: 'Troll',
  pattern: /troll/,
  longer_alt: StringLiteral,
  categories: [objects],
});
const elf = createToken({
  name: 'Elf',
  pattern: /elf/,
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
const allTokens = [
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

// Loop over all our tokens to create a vocabulary
allTokens.forEach((tokenType) => {
  tokenVocabulary[tokenType.name] = tokenType;
});

// Create a new Lexer using our tokens
const MagicLexer = new Lexer(allTokens);

// Pass input to the Lexer, handle errors
// The Lexer should only fail if it finds something it doesn't recognize as a token
export const lex = (inputText) => {
  const lexingResult = MagicLexer.tokenize(inputText);

  if (lexingResult.errors.length > 0) {
    throw Error('Sad Sad Panda, lexing errors detected');
  }

  return lexingResult;
};
