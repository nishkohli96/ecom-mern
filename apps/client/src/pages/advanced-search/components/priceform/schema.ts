import { object, string, ObjectSchema } from 'yup';

export interface PriceFormSchema {
  min: string;
  max: string;
}

function checkNumberValidation(numVal?: string): boolean {
  if (!Boolean(numVal)) {
    return true;
  }
  if (isNaN(Number(numVal))) {
    return false;
  }
  return Number(numVal) >= 0 ? true : false;
}

function compareMinMax(min?: string, max?: string): boolean {
  if (!min || !max) {
    return true;
  }
  const numMin = Number(min);
  const numMax = Number(max);
  return numMin <= numMax;
}

export const LoginFormSchema: ObjectSchema<PriceFormSchema> = object()
  .shape({
    min: string()
      .test('valid', 'Value must be a number', (val) =>
        checkNumberValidation(val)
      )
      .default(''),
    max: string()
      .test('valid', 'Value must be a number', (val) =>
        checkNumberValidation(val)
      )
      .test('valid', 'Value should be greater than min', (value, context) =>
        compareMinMax(context.parent.min, value)
      )
      .default('')
  })
  .required();
