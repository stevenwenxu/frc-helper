export class NameHelper {
  static nameToParts(name: string): string[] {
    const parts = name.split(" ");
    return [
      parts.length > 0 ? parts[0] : "",
      parts.length > 2 ? parts.slice(1, parts.length - 1).join(" ") : "",
      parts.length > 1 ? parts[parts.length - 1] : "",
    ].map(s => NameHelper.toTitleCase(s));
  }

  static fullNameFromParts(firstName: string, middleName: string, lastName: string) {
    return [firstName, middleName, lastName].filter(s => s.trim().length > 0).join(" ");
  }

  static toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
      }
    );
  }
}
