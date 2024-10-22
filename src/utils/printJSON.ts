/**
 * It returns the JSON string representation of the object with the specified indentation.
 */
export default function printJSON(obj: any, indent = 2): string {
  return JSON.stringify(obj, null, indent);
}
