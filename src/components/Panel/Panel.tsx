'use client'

import { FC } from "react"
import s from "./Panel.module.scss"

export const Panel: FC = () => {

    const changeColor = (color: string) => {
        localStorage.setItem("color", color)
    }

    return(
        <div className={s.container}>
            <div onClick={() => changeColor("#ff0000")} className={s.red}></div>
            <div onClick={() => changeColor("#00ff00")} className={s.green}></div>
            <div onClick={() => changeColor("#0000ff")} className={s.blue}></div>
            <div onClick={() => changeColor("#ffffff")} className={s.white}></div>
            <div onClick={() => changeColor("#000000")} className={s.black}></div>
        </div>
    )
}