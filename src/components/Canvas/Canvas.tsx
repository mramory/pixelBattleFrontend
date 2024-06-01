"use client"
import {WheelEvent, useEffect, useRef, useState} from "react"
import { Socket, io } from "socket.io-client";
import s from "./Canvas.module.scss"

type BodyType = {
    color: string
    x: number
    y: number
}

export const Canvas = () => {
    let socket: Socket
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [scale, setScale] = useState<number>(1)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        if(context){
            context.strokeStyle = "#A9A9A9"
            for(let i = 0; i<=1200; i+=10){
                context.moveTo(i, 0)
                context.lineTo(i, 800)
                context.stroke()
            }
            for(let i = 0; i<=800; i+=10){
                context.moveTo(0, i)
                context.lineTo(1200, i)
                context.stroke()
            }
        }    
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        socket = io("http://localhost:8080/");
        socket.on("connect", () => {
            console.log("connect")
        })
        socket.on("newMessage", (body: BodyType) => {
            if(context){
                context.fillStyle = body.color
                context.fillRect(body.x, body.y, 10, 10)
            }
        })
    }, [scale])

    const clickHandler = (event: any) => {
        const canvas = canvasRef.current
        const leftOffset = canvas?.getBoundingClientRect().left
        const topOffset = canvas?.getBoundingClientRect().top
        const x = Math.floor((+event.clientX-leftOffset!)/10/scale)*10
        const y = Math.floor((+event.clientY-topOffset!)/10/scale)*10
        socket.emit("newMessage", {color: localStorage.getItem("color"), x, y})
    }
    function getCoords(elem: HTMLCanvasElement | null) {
        var box = elem!.getBoundingClientRect();
        return {
          top: box.top + scrollY,
          left: box.left + scrollX
        };
      }
      function moveAt(e: any, target: HTMLCanvasElement | null, shiftX: number, shiftY: number) {
        console.log(shiftX, shiftY, e.pageX, e.pageY)
        target!.style.left = e.pageX - shiftX + (scale-1)*600 + 'px';
        target!.style.top = e.pageY - shiftY + (scale-1)*400 + 'px';
      }
    const mouseDown = (e: any) => {
        if(e.nativeEvent.button === 2){
            const canvas = canvasRef.current
            const container = containerRef.current
            container!.appendChild(canvas as Node);
            canvas!.style.zIndex = "100"
            var coords = getCoords(canvas);
            var shiftX = e.pageX - coords.left;
            var shiftY = e.pageY - coords.top;
            moveAt(e, canvas, shiftX, shiftY);
            
            document.onmousemove = function(e) {
                moveAt(e, canvas, shiftX, shiftY);
            }
            canvas!.ondragstart = function() {
                return false;
            };
        }
        
        
    }
    const mouseUp = () => {
        document.onmousemove = null
    }

    const onWheel = (e: WheelEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const scroll = e.deltaY
        if(scroll < 0){
            setScale(prev => prev-0.1)
        }
        if(scroll > 0){
            setScale(prev => prev+0.1)
        }
    }
    return(
        <div onMouseDown={mouseDown} onMouseUp={mouseUp} onWheel={onWheel} ref={containerRef} className={s.canvas_container}>
            <canvas style={{transform: `scale(${scale})`}} onContextMenu={(e) => e.preventDefault()} className={s.canvas} onClick={clickHandler} ref={canvasRef} width="1200px" height="800px"></canvas>
        </div>
    )
}