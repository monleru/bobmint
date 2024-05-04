import { createPublicClient, createWalletClient, http, parseGwei } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import chalk from "chalk"
import { BoB } from "./config"
import { mintABI } from "./utils/mintAbi"
import fs from 'fs'
import { sleep } from "./utils/sleep"

const log = console.log

const mintBoB = async (privateKey:`0x${string}`) => {
    const account = privateKeyToAccount(privateKey) 
    log(chalk.blue(account.address + ": ") + `Trying mint...`);
    const client = createWalletClient({
        account,
        chain: BoB,
        transport: http(),
      })

      let i = 0
      while(i < 3) {
        try{
            const hash = await client.writeContract({
                address:"0x8a6f282b15c595bf07aaCaC6Cba245cE427CCBb4",
                abi: mintABI,
                functionName: 'mint',
                gasPrice: parseGwei('0.0016'),
                gas: BigInt("160000")
              })
              log(chalk.blue(`${account.address}:`),hash);
              break
        } catch(e) {
            i++
        }
      }
    }

const getBlock = async () => {
    const keys = (await fs.promises.readFile('keys.txt', 'utf-8')).split('\n') as `0x${string}`[]
    const BobClint = createPublicClient({
        chain: BoB,
        transport: http(),
    })

    while(true) {
        const mintState = Number(await BobClint.readContract({
            abi: mintABI,
            address: "0x8a6f282b15c595bf07aaCaC6Cba245cE427CCBb4",
            args: [],
            functionName: 'mintState'
        }))

        log(chalk.blue(`Current state:`),mintState);
        if(mintState === 4) {
            for (const key of keys) {
                mintBoB(key).catch(e => console.log(e.message))
                await new Promise((res) => {
                    setTimeout(() => res(null), 50)
                })
            }
            break
        }
        await sleep(0.5)
    }

}

getBlock()