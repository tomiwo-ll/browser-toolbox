type RouteLocation = {
  hash: string;
  pathname: string;
};

export function currentToolRouteFromLocation(
  location: RouteLocation,
  baseUrl: string
): string {
  if (location.hash.startsWith("#/")) {
    return location.hash.slice(1);
  }

  const base = baseUrl.replace(/\/$/, "");
  return location.pathname.replace(base, "") || "/";
}

export function toolHref(path: string, baseUrl: string): string {
  return `${baseUrl}#${path}`;
}
