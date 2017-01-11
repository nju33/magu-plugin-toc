import pupa from 'pupa';

const defaultOpts = {
  listTemplate: '<ul class="toc__list toc--level-{level}"></ul>',
  itemTemplate: '<li class="toc__item toc--level-{level}">{text}</li>',
  selector: '.toc__box'
};
export {defaultOpts};

export default function toc(opts = {}) {
  opts = Object.assign({}, defaultOpts, opts);
  return ($, cheerio) => {
    const structure = buildStructure($);
    const result = {html: buildTOC(opts, $, cheerio, structure)};
    return result;
  };
}

function buildStructure($) {
  const headlines = $('h1,h2,h3,h4,h5,h6');
  const latestMap = new Map();
  const structure = [];

  headlines.each((idx, elem) => {
    const level = getLevel(elem.name);
    const parent = getClosestParent(level, latestMap);
    const item = {
      level,
      parent,
      text: $(elem).text(),
      children: []
    };

    if (parent) {
      parent.children.push(item);
    } else {
      structure.push(item);
    }
    latestMap.set(level, item);
  });

  return structure;
}

export {buildStructure};

function getClosestParent(level, map) {
  let next = level - 1;
  while (!map.get(next) && next > 0) {
    next -= next;
  }

  if (next === 0) {
    return null;
  }
  return map.get(next);
}
export {getClosestParent};

function getLevel(name) {
  const matches = name.match(/\d+/);
  if (matches) {
    return Number(matches[0]);
  }
}
export {getLevel};

function buildTOC(opts, $, cheerio, structure) {
  const htmls = proc({
    children: structure,
    root: true
  });

  htmls.slice(1).reduce(($prev, next) => {
    return $(next).insertAfter($prev);
  }, $(htmls[0]).prependTo($(opts.selector)));

  return $.html();

  function proc({children, $box = null, root = false}) {
    const htmls = children.map(item => {
      const $ = cheerio.load('', {decodeEntities: false});

      if (root) {
        const _list = pupa(opts.listTemplate, item);
        const _item = pupa(opts.itemTemplate, item);
        const $list = $(_list).appendTo($.root());
        $(_item).appendTo($list);
        if (item.children.length > 0) {
          $list.append(proc({
            children: item.children,
            $box: $list
          }));
        }
      } else {
        const _wrapper = pupa(opts.itemTemplate, {level: item.parent.level});
        const _rootList = pupa(opts.listTemplate, item);
        const _item = pupa(opts.itemTemplate, item);

        const $wrapper = $(_wrapper).appendTo($box);
        const $list = $(_rootList).appendTo($wrapper);
        $(_item).appendTo($list);
        if (item.children.length > 0) {
          $list.append(proc({
            children: item.children,
            $box: $list
          }));
        }
      }
      return $.html();
    });
    return htmls;
  }
}
export {buildTOC};
