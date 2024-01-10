import slugify from 'slugify';

export function slugifyGroceryName(productName: string): string {
  return slugify(productName, { lower: true, remove: /[*+~()/,!:@]/g });
}
