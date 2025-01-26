/**
 * Sleep for a given amount of time.
 */
export default function sleep(delayInMilliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
}
