import { Tree, logger, readJson } from '@nrwl/devkit';

const getFileContents = (host: Tree, filename: string) => {
  if (!host.exists(filename)) {
    logger.fatal(`Cannot find ${filename}`);
    return;
  }

  return readJson(host, filename);
};

const sortItems = (items: Record<string, unknown>) => {
  return Object.keys(items)
    .sort()
    .reduce((acc, curr) => ({ ...acc, [curr]: items[curr] }), {});
};

const sortPaths = (host: Tree, filename: string) => {
  const file = getFileContents(host, filename);

  const updated = {
    ...file,
    compilerOptions: {
      ...file.compilerOptions,
      paths: sortItems(file?.compilerOptions?.paths),
    },
  };

  host.write(filename, JSON.stringify(updated, null, 2));
};

const sortProjects = (host: Tree, filename: string) => {
  const file = getFileContents(host, filename);

  const updated = { ...file, projects: sortItems(file?.projects ?? {}) };

  host.write(filename, JSON.stringify(updated, null, 2));
};

export default async (host: Tree) => {
  sortPaths(host, 'tsconfig.base.json');
  sortProjects(host, 'nx.json');
  sortProjects(host, 'workspace.json');
};
