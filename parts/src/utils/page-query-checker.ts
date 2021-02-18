export function pageQueryChecker(page: string): number {
  let checkedPage = 1

  if (page) {
    if (parseInt(page as string) !== NaN && parseInt(page as string) >= 1) {
      checkedPage = parseInt(page as string)
    }
  }

  return checkedPage
}
