import type { DirectiveBinding } from 'vue'

type FormFieldElement = HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement

function toMilliseconds(arg: string | undefined): number {
  if (!arg) {
    return 0;
  }
  const milliseconds = parseInt(arg);
  if (isNaN(milliseconds)) {
    throw new Error('Invalid argument. Expected a number.');
  }
  return milliseconds;
}


function debounce(func: () => void, delay: number) {
  let timeoutId: number
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(func, delay)
  }
}

const vDebounce = {
  beforeMount: (el: FormFieldElement, binding: DirectiveBinding) => {
    const { value, arg } = binding

    el.addEventListener(
      'input',
      debounce(() => {
        value(el.value)
      }, toMilliseconds(arg)),
    )
  },
}





export const useDirectives = () => ({
  vDebounce
})




