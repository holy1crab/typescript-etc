// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html#the---erasablesyntaxonly-option

const TicketStatusValue = {
  Created: 0,
  InProgress: 1,
} as const;

type TicketStatus = typeof TicketStatusValue[keyof typeof TicketStatusValue];

let a: TicketStatus = TicketStatusValue.Created;
let b: TicketStatus = TicketStatusValue.InProgress;
let c: TicketStatus = 1;
// let d: TicketStatus = 2; --> error