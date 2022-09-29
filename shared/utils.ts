import * as s from 'zapatos/schema';

function titleCase(s: string) {
  return s.toLowerCase()
    .replace(/\b\S/g, m => m.toUpperCase())
    .replace(/\bMc\S/g, m => m.slice(0, 2) + m.charAt(2).toUpperCase());
}

export function actorName(actor: s.actor.JSONSelectable) {
  return `${titleCase(actor.first_name)} ${titleCase(actor.last_name)}`;
}

export function filmTitle(film: s.film.JSONSelectable) {
  return `${titleCase(film.title)} (${film.release_year})`;
}
