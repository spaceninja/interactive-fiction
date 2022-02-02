import { Ref } from 'vue';
import { createToken, Lexer, TokenType } from 'chevrotain';
import { sortByPriority } from '../../helpers/sortByPriority';
import ItemType from '../../classes/Item';
import VerbType from '../../classes/Verb';
import * as gameVerbs from './useGameVerb';
import * as verbs from '../useVerb';
import * as items from '../useItem';
console.log('VERBS', verbs);
console.log('ITEMS', items);

const sortedVerbs: { [key: string]: Ref<VerbType> } = Object.values(verbs)
  .sort(sortByPriority)
  .reduce((acc, cur) => ({ ...acc, [cur.value.name]: cur }), {});
console.log('SORTED VERBS', sortedVerbs);

const sortedItems: { [key: string]: Ref<ItemType> } = Object.values(items)
  .sort(sortByPriority)
  .reduce((acc, cur) => ({ ...acc, [cur.value.id]: cur }), {});
console.log('SORTED ITEMS', sortedItems);

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
const Direction = createToken({ name: 'Direction', pattern: Lexer.NA });

// Generate Tokens for Each Verb
const verbTokens: TokenType[] = [];
Object.entries(sortedVerbs).forEach(([name, item]) => {
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
console.log('VERB TOKENS', verbTokens);

// Generate Tokens for Each Game Verb
const gameVerbTokens: TokenType[] = [];
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

// Generate Tokens for Each Item
const itemTokens: TokenType[] = [];
Object.entries(sortedItems).forEach(([name, item]) => {
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

// Generate Tokens for Each Direction
const directionTokens: TokenType[] = [];
[
  ['northeast', 'ne'],
  ['southeast', 'se'],
  ['southwest', 'sw'],
  ['northwest', 'nw'],
  ['north', 'n'],
  ['east', 'e'],
  ['south', 's'],
  ['west', 'w'],
  ['up'],
  ['down'],
  ['in'],
  ['out'],
].forEach((direction) => {
  directionTokens.push(
    createToken({
      name: direction[0],
      pattern: new RegExp(`${direction.join('|')}`, 'i'),
      longer_alt: StringLiteral,
      categories: [Direction],
    })
  );
});

// Others
const Integer = createToken({ name: 'Integer', pattern: /0|[1-9]\d*/ });
const Buzzword = createToken({
  name: 'Buzzword',
  pattern: /an|at|a|the|is|of|to|with/i,
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
  ...itemTokens,
  ...verbTokens,
  ...gameVerbTokens,
  ...directionTokens,
  GameVerb,
  Verb,
  Noun,
  Direction,
  Integer,
  Buzzword,
  Punctuation,
  // The StringLiteral must appear after the keywords because all keywords are valid identifiers.
  StringLiteral,
];

// the vocabulary will be exported and used in the Parser definition.
export const tokenVocabulary: { [key: string]: TokenType } = {};
allTokens.forEach((tokenType) => {
  tokenVocabulary[tokenType.name] = tokenType;
});
