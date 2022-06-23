import { createContext, useContext, useEffect, useRef, useState } from "react"
import styles from "./styles.module.scss"

export const PopupContext = createContext();
export const PopupProvider = ({children}) => {
    const [didOpen, setOpen] = useState(false)
    const [popupData, setPopupData] = useState(null)
    const togglePopup = () => {
        setOpen(!didOpen)
    }
    return (
        <PopupContext.Provider value={{
            togglePopup,
            didOpen, setOpen, 
            popupData, setPopupData

        }}>
            {children}
            <Popup/>
        </PopupContext.Provider>
    )
}

const Popup = () => {
    const {didOpen, togglePopup, popupData} = usePopup()
    const {title, description, withConfirmation, onConfirm} = popupData || {}
    const popupRef = useRef()

    // useEffect(() => {
    //     console.log(didOpen)
    // }, [didOpen])

    const handleConfirmation = () => {
        onConfirm?.()
        closePopup()
    } 

    const closePopup = () => {
        togglePopup()
    }

    useEffect(() => {
        if (didOpen) {
            function handleClickOutside(event) {
                if (popupRef.current && !popupRef.current.contains(event.target)) {
                    togglePopup()
                }
            }
    
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [popupRef, didOpen]);

    return (
        <>
            <div 
                ref={popupRef}
                className={`
                    ${styles["popup"]}
                    ${withConfirmation && styles["popup--confirm"]}
                    ${didOpen && styles["open"]}
                `}
            >
                <div className={styles["popup__header"]}>{title}</div>
                <p className={styles["popup__description"]}>{description}</p>
                <div className={styles["popup__footer"]}>
                    <div className={styles["popup__btn-group"]}>
                        {!withConfirmation ? (
                            <button className={`
                                ${styles["popup__btn"]}
                                ${styles["popup__btn--primary"]}
                            `}
                            onClick={closePopup}>Ok</button>
                        ) : (
                            <>
                                <button className={`
                                    ${styles["popup__btn"]}
                                    ${styles["popup__btn--primary"]}
                                `}
                                onClick={handleConfirmation}
                                >Ok</button>
                                <button className={`
                                    ${styles["popup__btn"]}
                                    ${styles["popup__btn--secondary"]}
                                `}
                                onClick={closePopup}
                                >Cancel</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export const usePopup = () => useContext(PopupContext)