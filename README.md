# magu-plugin-toc

Magu plugin that generate table of contents

[![Build Status](https://travis-ci.org/nju33/magu-plugin-toc.svg?branch=master)](https://travis-ci.org/nju33/magu-plugin-toc) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

## Install

```bash
yarn add magu-plugin-toc
npm install magu-plugin-toc
```

## Usage

```js
magu({}, [toc({
  // Below is the default value
  listTemplate: '<ul class="toc__list toc--level-{level}"></ul>',
  itemTemplate: '<li class="toc__item toc--level-{level}">{text}</li>',
  selector: '.toc__box'
})])
  .process(`${__dirname}/path/to/file.md`)
  .then(result => console.log(result.html));
```

## Options

Please think that the template part is using [sindresorhus/pupa](https://github.com/sindresorhus/pupa) like this.

```js
pupa(template, {text, level});
```

- `listTemplate` (default:`'<ul class="toc__list toc--level-{level}"></ul>'`)
  <div>Template of element enclosing item</div>
  <div>arguments is</div>
    - level
- `itemTemplate` (default:`'<li class="toc__item toc--level-{level}">{text}</li>'`)
  <div>Template of item's element</div>
  <div>arguments is</div>
    - text
    - level
- `selector` (default:`.toc__box`)
  <div>Selector for finding elements to store<div>

## Example

```md
<div class="toc__box"></div>
# headline
## sub
## sub
### subsub
# headline
# headline
### subsub
```

result like this.

```html
<div class="toc__box"><ul class="toc__list toc--level-1"><li class="toc__item toc--level-1">headline</li><li class="toc__item toc--level

-1"><ul class="toc__list toc--level-2"><li class="toc__item toc--level-2">sub</li></ul></li><li class="toc__item toc--level-1"><ul class
="toc__list toc--level-2"><li class="toc__item toc--level-2">sub</li><li class="toc__item toc--level-2"><ul class="toc__list toc--level-
3"><li class="toc__item toc--level-3">subsub</li></ul></li><li class="toc__item toc--level-2"><ul class="toc__list toc--level-3"><li cla
ss="toc__item toc--level-3">subsub</li></ul></li></ul></li></ul><ul class="toc__list toc--level-1"><li class="toc__item toc--level-1">he
adline</li></ul><ul class="toc__list toc--level-1"><li class="toc__item toc--level-1">headline</li></ul></div>

<h1 id="headline">headline</h1>
<h2 id="sub">sub</h2>
<h2 id="sub">sub</h2>
<h3 id="subsub">subsub</h3>
<h1 id="headline">headline</h1>
<h1 id="headline">headline</h1>
<h3 id="subsub">subsub</h3>

```

## License

The MIT License (MIT)
Copyright (c) 2016 nju33 <nju33.ki@gmail.com>
