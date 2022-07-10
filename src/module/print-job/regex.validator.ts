import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateRegex {
  async validatePageRange(pageRange: string) {
    const pageRanges = pageRange.split(',');
    for (const pageRange of pageRanges) {
      if (/^[0-9]+-[0-9]+$/.test(pageRange)) {
        const pages = pageRange.split('-');
        if (pages[0] > pages[1]) {
          return false;
        }
        continue;
      } else if (/^[0-9]+$/.test(pageRange)) {
        continue;
      } else {
        return false;
      }
    }
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
