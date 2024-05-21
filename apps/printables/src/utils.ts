export function extractTextRecursively(content: any): string {
  let text = "";
  content.forEach((contentBlock: any) => {
    switch (contentBlock.type) {
      case "paragraph": {
        if (contentBlock.content) {
          text += extractTextRecursively(contentBlock.content);
        } else {
          text += "\n \n";
        }
        break;
      }
      case "text": {
        text += contentBlock.text + "\n";
        break;
      }
      case "hardBreak": {
        text += "\n";
        break;
      }
      case "bulletList":
      case "orderedList": {
        text += extractTextRecursively(contentBlock.content);
        break;
      }
      case "listItem": {
        text += extractTextRecursively(contentBlock.content);
        break;
      }
      default:
        break;
    }
  });
  return text;
}
