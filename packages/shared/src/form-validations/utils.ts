export function fieldReqdMsg(fieldName: string): string {
  return `Please enter ${fieldName}`;
}

export function fieldSelectMsg(fieldName: string): string {
  return `Please select ${fieldName}`;
}

export function minCharMsg(fieldName: string, numChars: number): string {
  return `${fieldName} should be atleast ${numChars} characters`;
}

export function printFormValidationErrors(errs: string[]): string {
  const errorMsgArray = errs.map((err, idx) => `${idx + 1}. ${err}`);
  return `Please fix the following errors..
		  ${errorMsgArray.join('\n')}
		  `;
}
