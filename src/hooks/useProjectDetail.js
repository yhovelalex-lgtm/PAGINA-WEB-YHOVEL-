import { useEffect, useState } from 'react';

function currentId() {
  return new URL(window.location.href).searchParams.get('proyecto');
}

export default function useProjectDetail(projects) {
  const [id, setId] = useState(currentId);
  useEffect(() => {
    const sync = () => setId(currentId());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  function open(project) {
    const url = new URL(window.location.href);
    url.searchParams.set('proyecto', project.id);
    history.pushState({folioDetail: true}, '', url);
    setId(project.id);
  }

  function close() {
    if (history.state?.folioDetail) {
      history.back();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('proyecto');
      url.hash = 'work';
      history.replaceState(null, '', url);
      setId(null);
      document.getElementById('work')?.scrollIntoView();
    }
  }

  return { project: projects.find(project => project.id === id), open, close };
}
