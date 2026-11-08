export enum slotEnum {
  MORNING = "MORNING",
  AFTER_BREAKFAST = "AFTER_BREAKFAST",
  AFTER_LUNCH = "AFTER_LUNCH",
  AFTER_DINNER = "AFTER_DINNER",
}

export interface createReadingDTO {
  userId: string;
  readingDate: string;
  slot: slotEnum;
  value: number;
}

export interface updateReadingDTO {
  readingDate?: string;
  slot?: slotEnum;
  value?: number;
}


