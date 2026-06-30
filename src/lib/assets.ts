const base = import.meta.env.BASE_URL;

export function publicAsset(path: string): string {
  const normalized = path.replace(/^\//, '');
  return `${base}${normalized}`;
}

export function publicAssetSrcSet(path1x: string, path2x: string): string {
  return `${publicAsset(path1x)} 1x, ${publicAsset(path2x)} 2x`;
}
