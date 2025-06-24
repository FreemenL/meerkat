const config = {
    url:'http://127.0.0.1:8080/api',
    projectName:'eyesdk',
    appId:'123456',
    userId:'123123123',
    batchSize:20
};

export function setConfig(options){
    for(let key in options){
        if(config[key]){
            config[key]=options[key];
        }
    }
}

export default config;