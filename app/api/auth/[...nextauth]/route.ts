import nextAuth from "next-auth"
import github from "next-auth/providers/github"
import google from "next-auth/providers/google"

const handler = nextAuth({
    providers:[
        Github({
            clientId:
            ClientSecret:
        }),
        Google({
            clientId:
            ClientSecret:
        })
    ]
})

export {handler as GET, handler as POST}