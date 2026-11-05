// A project opens with its own spread. Pair selected sheets from the same discipline.
export function buildBook(projects) {
  const works = projects.filter(project => !project.demo);
  const pages = [{kind: 'cover', title: 'Portada'}, {kind: 'index', title: 'Contenido'}];
  works.forEach((project, i) => {
    const chapter = String(i + 1).padStart(2, '0');
    pages.push({kind: 'project', title: project.title, project, chapter});
    const gallery = project.gallery || [];
    const selected = Array.isArray(project.bookSheets)
      ? project.bookSheets.map(code => gallery.find(image => image.sheet === code)).filter(Boolean)
      : gallery.filter((image, j) => gallery.findIndex(other => other.group === image.group) === j).slice(0, 4);
    const groups = new Map();
    for (const image of selected) {
      const group = image.group || 'Documentación';
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(image);
    }
    for (const [group, images] of groups) {
      for (let j = 0; j < images.length; j += 2) {
        pages.push({kind: 'sheets', title: group, chapter, project, images: images.slice(j, j + 2)});
      }
    }
  });
  if (works.length < 4) pages.push({kind: 'reserve', title: 'Próximo proyecto', chapter: String(works.length + 1).padStart(2, '0')});
  pages.push({kind: 'end', title: 'Cierre'});
  return pages;
}
