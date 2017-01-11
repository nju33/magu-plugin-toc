import fs from 'fs';
import test from 'ava';
import marked from 'marked';
import cheerio from 'cheerio';
import toc, {
  defaultOpts,
  buildStructure,
  getClosestParent,
  getLevel,
  buildTOC
} from '../dist/magu-plugin-toc';

const md = fs.readFileSync(`${__dirname}/fixtures.md`, 'utf-8');

test('getLevel', t => {
  t.is(1, getLevel('h1'));
});

test('buildStructure', t => {
  const $ = cheerio.load(marked(md));
  const result = buildStructure($);

  t.is(result.length, 1);
  t.is(result[0].level, 1);
  t.is(result[0].text, 'a');
  t.is(result[0].children.length, 1);
  t.is(result[0].children[0].text, 'i');
  t.is(result[0].children[0].children.length, 1);
  t.is(result[0].children[0].children[0].text, 'u');
  t.is(result[0].children[0].children[0].children.length, 0);
});

test('getClosestParent', t => {
  const mock = new Map();
  mock.set(1, {
    level: 1,
    text: 'a'
  });
  mock.set(2, {
    level: 2,
    text: 'i'
  });
  mock.set(3, {
    level: 3,
    text: 'u'
  });

  const result = getClosestParent(3, mock);
  t.is(result.level, 2);
  t.is(result.text, 'i');
});

test('buildTOC', t => {
  const $ = cheerio.load(marked(md));
  const structure = buildStructure($);
  const result = buildTOC(defaultOpts, $, cheerio, structure);

  const $result = cheerio.load(result);
  t.is(1, $result('ul.toc--level-1').length);
  t.is(1, $result('ul.toc--level-2').length);
  t.is(1, $result('ul.toc--level-3').length);
  t.is(0, $result('ul.toc--level-4').length);
});

test('toc', t => {
  const $ = cheerio.load(marked(md));
  const result = toc()($, cheerio);

  const $result = cheerio.load(result.html);
  t.is(1, $result('ul.toc--level-1').length);
  t.is(1, $result('ul.toc--level-2').length);
  t.is(1, $result('ul.toc--level-3').length);
  t.is(0, $result('ul.toc--level-4').length);
});
