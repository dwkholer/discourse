import { postRNWebviewMessage } from "discourse/lib/utilities";

export async function getSiteThemeColor() {
  const siteThemeColor = document.querySelector('meta[name="theme-color"]');
  return siteThemeColor?.content || null;
}

export async function setSiteThemeColor(color = "000000") {
  const _color = `#${color}`;

  const siteThemeColor = document.querySelector('meta[name="theme-color"]');

  if (siteThemeColor) {
    siteThemeColor.content = _color;
  }

  postRNWebviewMessage?.("headerBg", _color);
}
