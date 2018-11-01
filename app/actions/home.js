export const SAVE_TESTING_URL = 'SAVE_TESTING_URL';

export function saveTestingURl(url: string) {
  return {
    type: SAVE_TESTING_URL,
    url
  };
}
