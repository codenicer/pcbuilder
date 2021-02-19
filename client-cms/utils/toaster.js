import { toast } from 'react-toastify'

function typeFilter(type) {
  switch (type) {
    case 'error':
      return {
        style: {
          borderColor: '#ff00009d',
        },
        progressClassName: 'toast-progbar-error',
      }

    case 'success':
      return {
        style: {
          borderColor: '#008000d3',
        },
        progressClassName: 'toast-progbar-success',
      }

    default:
      return {
        style: {
          borderColor: color,
        },
      }
  }
}

const toaster = (msg, type) => {
  const style = typeFilter(type)

  return toast.info(msg, {
    ...style,
  })
}

export { toaster }
