
export type BlockType = 'TEXT' | 'LINK' | 'IMAGE';

export interface Block {
  id: string;
  type: BlockType;
  content?: string;
  text?: string;
  url?: string; // Image URL or Link URL
  linkUrl?: string; // Image Click URL
  buttonStyle?: 'button' | 'text'; // LINK용 버튼 스타일
}

export function generateHtmlFromBlocks(blocks: Block[]): string {
  if (!blocks || blocks.length === 0) return "";

  return blocks.map(block => {
    switch (block.type) {
      case 'TEXT':
        // 줄바꿈 처리 및 스타일링
        return `<div style="margin-bottom: 12px; font-size: 14px; line-height: 1.6; color: #333; white-space: pre-wrap;">${block.content || ''}</div>`;
      
      case 'LINK':
        const isTextStyle = block.buttonStyle === 'text';
        if (isTextStyle) {
          // 텍스트 링크 스타일
          return `
            <div style="margin-bottom: 12px;">
              <a href="${block.url}" style="color: #000; text-decoration: underline; font-size: 14px;">
                ${block.text || '바로가기'}
              </a>
            </div>
          `;
        } else {
          // 일반 버튼 스타일 (기본값)
          return `
            <div style="margin-bottom: 12px;">
              <a href="${block.url}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">
                ${block.text || '바로가기'}
              </a>
            </div>
          `;
        }
      
      case 'IMAGE':
        const imgTag = `<img src="${block.url}" alt="Image" style="max-width: 100%; height: auto; display: block; border-radius: 4px;" />`;
        if (block.linkUrl) {
          return `<div style="margin-bottom: 12px;"><a href="${block.linkUrl}">${imgTag}</a></div>`;
        }
        return `<div style="margin-bottom: 12px;">${imgTag}</div>`;
        
      default:
        return "";
    }
  }).join("");
}

export function wrapEmailHtml(
  body: string, 
  headerHtml: string = "",  // 상단 템플릿 HTML
  footerHtml: string = ""   // 하단 템플릿 HTML
): string {
    const bodyHtml = `<div style="font-size: 15px; line-height: 1.6; color: #000; white-space: pre-wrap;">${body}</div>`;
    const footerSeparator = footerHtml ? `<br/><hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" /><br/>` : "";
    
    // 상단 + 본문 + 하단 조립
    let content = "";
    
    if (headerHtml) {
      content += `${headerHtml}<br/>`;
    }
    
    content += bodyHtml;
    
    if (footerHtml) {
      content += `${footerSeparator}${footerHtml}`;
    }

    return `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          ${content}
        </body>
      </html>
    `;
}


