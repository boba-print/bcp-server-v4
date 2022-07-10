import { Injectable } from '@nestjs/common';

@Injectable()
export class RegexValidator {
  async validatePageRange(pageRange: string) {
    // 1,2-3 or 1-2,3로 [1, 2-3], [1-2, 3] 변환
    const pageRanges = pageRange.split(',');
    for (const pageRange of pageRanges) {
      // 1-2의 형식 포멧 검사 true이면 continue
      if (/^[0-9]+-[0-9]+$/.test(pageRange)) {
        const pages = pageRange.split('-');
        // 2-1, 3-2등 앞의 수가 뒤의 수보다 클 경우 false
        if (pages[0] > pages[1]) {
          return false;
        }
        continue;
      } else if (/^[0-9]+$/.test(pageRange)) {
        // 1이나 23 등 단일 숫자 형식의 포멧 검사
        continue;
      } else {
        // 이 모든 것에도 속하지 않으면 false
        return false;
      }
    }
    // 2-3,1 이나 3,1-2 같은 상황을 걸러내기 위한 로직
    let num: string[] = [];
    for (const pageRange of pageRanges) {
      const page = pageRange.split('-');
      if (page.length === 1) {
        num.push(page[0]);
      } else {
        num.push(page[0]);
        num.push(page[1]);
      }
    }
    // 페이지 인덱스가 0보다는 클리가 없기에
    let base = '0';
    for (const n of num) {
      if (base > n) {
        return false;
      }
      base = n;
    }

    return true;
  }
}
