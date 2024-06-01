import { Canvas } from '@/components/Canvas/Canvas'
import { Panel } from '@/components/Panel/Panel'
import s from "./page.module.scss"

export default function Home() {
  return (
    <div className={s.container}>
      <Canvas />
      <div className={s.settings}>
        <Panel />
      </div>
    </div>
  )
}
