import magu from 'magu';
import toc from '../dist/magu-plugin-toc';

magu({
  heading(text, level) {
    return `
<h${level} class="md__h">${text}</h${level}>
    `;
  }
}, [toc()])
  .process(`${__dirname}/example.md`)
  .then(result => {
    console.log(result.html);
    // console.log(result);
  });
