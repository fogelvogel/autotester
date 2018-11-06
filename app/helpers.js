export default function checkField(value: string) {
  let isValid = true;
  if (value === '') {
    isValid = false;
  }
  return isValid;
}
