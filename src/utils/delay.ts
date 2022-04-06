export async function delay(timeout: number) {
  await new Promise((res) => setTimeout(() => res(null), timeout));
}
