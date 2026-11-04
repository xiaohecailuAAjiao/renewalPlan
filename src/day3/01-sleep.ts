import { resolve } from "node:dns"

function sleep(timer:number):Promise<void>{
    return new Promise((resolve)=>{
        setTimeout(resolve,timer)
    })
}


async function main(){
    console.log('A');
    await sleep(1000);
    console.log('B')
}

main()
