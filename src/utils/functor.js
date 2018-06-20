export default function(e) {
  if (e === null || e === undefined) return e => e;
  if (typeof e === 'function') return e;
  return _ => e;
}
