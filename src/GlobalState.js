import { createContext, useContext, useState } from "react"

const initialState = {
    player: -1,
    players: [],
    pDict: {},
}

const GlobalContext = createContext(null)

export function GlobalState(props){
    const [globalState, setGlobalState] = useState(initialState)

    function updateGlobalState(key,newValue){
        setGlobalState(oldState => {
            if(oldState[key] !== newValue){
                const newState = {...oldState}
                newState[key] = newValue
                return newState
            }
            return oldState
        })
    }
    return(
        <GlobalContext.Provider value={[globalState, updateGlobalState]}>{props.children}</GlobalContext.Provider>
    )

}

export const useGlobalState = () => useContext(GlobalContext)
