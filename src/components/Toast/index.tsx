import {Slide, toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ToastType = {
    message: string
}

export const toastSuccess = ({message}: ToastType) =>
    toast.success(message, {
        icon: (
            <img src="/assets/svg/icon_toast_success.svg" alt={'Success Toast'} width={'43px'} height={'43px'}/>
        ),
    })
export const toastError = ({message}: ToastType) =>
    toast.error(message, {
        icon: <img src="/assets/svg/icon_toast_error.svg" alt={'Error Toast'} width={'43px'} height={'43px'}/>,
    })
export const toastWarn = ({message}: ToastType) =>
    toast.warn(message, {
        icon: (
            <img src="/assets/svg/icon_toast_warning.svg" alt={'Warning Toast'} width={'43px'} height={'43px'}/>
        ),
    })

const Toast = () => {
    return (
        <>
            <ToastContainer
                position="top-right"
                className={'z-999 top-auto w-full min-w-[200px] max-w-[420px]'}
                limit={2}
                transition={Slide}
                closeButton={false}
                newestOnTop
                hideProgressBar
                toastStyle={{
                    background: '#151f2c',
                    padding: '15px',
                    marginTop: '15px',
                    color: '#fff',
                    borderRadius: 0,
                    boxShadow: '5px 5px 0px #00000029',
                }}
            />
        </>
    )
}

export default Toast
