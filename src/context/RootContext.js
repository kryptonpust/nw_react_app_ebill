import React from 'react';


export default React.createContext({
    settings:{},
    reload:false,
    reloadSettings: ()=>{},
    updateSetting: (key,val) =>{}
})