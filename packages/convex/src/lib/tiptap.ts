export function extractTipTapTextRecursively(content: any): string {
  let text = "";
  content.forEach((contentBlock: any) => {
    switch (contentBlock.type) {
      case "paragraph": {
        if (contentBlock.content) {
          text += extractTipTapTextRecursively(contentBlock.content);
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
        text += extractTipTapTextRecursively(contentBlock.content);
        break;
      }
      case "listItem": {
        text += extractTipTapTextRecursively(contentBlock.content);
        break;
      }
      default:
        break;
    }
  });
  return text;
}
