import { copyFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const dest = 'public/assets/icons';
await mkdir(dest, { recursive: true });

// [destination-name, simple-icons-slug]
const iconMap = [
  ['java',           'openjdk'],
  ['spring',         'springboot'],
  ['quarkus',        'quarkus'],
  ['kafka',          'apachekafka'],
  ['nodejs',         'nodedotjs'],
  ['postgresql',     'postgresql'],
  ['mongodb',        'mongodb'],
  ['angular',        'angular'],
  ['typescript',     'typescript'],
  ['javascript',     'javascript'],
  ['html',           'html5'],
  ['css',            'css'],
  ['docker',         'docker'],
  ['grafana',        'grafana'],
  ['kubernetes',     'kubernetes'],
  ['jenkins',        'jenkins'],
  ['github-actions', 'githubactions'],
];

let ok = 0, fail = 0;
for (const [name, slug] of iconMap) {
  const src = `node_modules/simple-icons/icons/${slug}.svg`;
  if (existsSync(src)) {
    await copyFile(src, `${dest}/${name}.svg`);
    console.log(`✓  ${name}.svg  ←  ${slug}.svg`);
    ok++;
  } else {
    console.log(`✗  NOT FOUND: ${slug}.svg`);
    fail++;
  }
}
console.log(`\n${ok} copiados, ${fail} não encontrados`);
