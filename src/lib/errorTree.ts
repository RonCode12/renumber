interface Issue {
  path: PropertyKey[];
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildErrorTree(issues: Issue[]): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root: any = {};
  for (const issue of issues) {
    if (issue.path.length === 0) continue;
    let node = root;
    for (let i = 0; i < issue.path.length - 1; i++) {
      const key = issue.path[i];
      const nextKey = issue.path[i + 1];
      const wantsArray = typeof nextKey === "number";
      if (node[key] === undefined) node[key] = wantsArray ? [] : {};
      node = node[key];
    }
    const lastKey = issue.path[issue.path.length - 1];
    if (node[lastKey] === undefined) node[lastKey] = issue.message;
  }
  return root;
}
