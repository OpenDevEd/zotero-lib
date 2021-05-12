export default function printJSON(obj, indent = 2) {
  return JSON.stringify(obj, null, 2);
}
