export const sleep = async (sec:number) => {
    return new Promise((res) => {
        setTimeout(() => res(null),sec*1000)
    })
}