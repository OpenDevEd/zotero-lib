export default function printJSON(obj: any, indent = 2): string {
  return JSON.stringify(obj, null, indent);
}
