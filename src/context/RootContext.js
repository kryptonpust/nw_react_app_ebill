import React from 'react';


export default React.createContext({
    settings:{},
    status:false,
    openday: ()=>{},
    closeday: ()=>{},
    updateSetting: (key,val) =>{}
})