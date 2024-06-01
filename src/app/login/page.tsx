import { delay } from "@/utils/delay"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login"
}

export default async function LoginPage() {
    await delay(2000)
    return(
        <div>login</div>
    )
}