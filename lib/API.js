class chnpFile
{
    constructor(json){
        this.json=json;
    }
    forEach(fun){
        let newPrintList = [];
        for(let i in this.json.printList){
            let item = this.json.printList[i],
            newItem = fun(i,item);
            if(newItem!=undefined)
                newPrintList.push(newItem)
            else
                newPrintList.push(item)
        }
        this.json.printList=newPrintList;
    }
    setCurrentTime(){
        this.json.time=Date.now();
    }
    setWM(newWM){
        this.json.inputValues.watermark=newWM;
        let newPrintList = [];
        for(let item of this.json.printList){
            item.watermark=newWM;
            newPrintList.push(item);
        }
        this.json.printList=newPrintList;
    }
    setWMof({
        index,
        newWM
    }){
        
        this.json.printList[index].watermark=newWM;
    }
    changePrintListAt(index,json){
        let newJson = {}
        Object.keys(this.getListAt(index)).forEach(key=>{
            if(json[key]){
                newJson[key]=json[key];
            }else{
                newJson[key]=this.getListAt(index)[key];
            }
        })
        this.json.printList[index]=newJson;
        this.setCurrentTime();
    }
    renameSession(newName){
        this.json.name=newName;
    }
    getStatsOfLangs(){
        let total=this.json.printList.length,types=[],filetype,included;
        for(let item of this.json.printList){
            filetype=item.filename.split(".")[item.filename.split(".").length-1]
            for(let type of types){
                included=type.lang==filetype
            }
            if(included!=true){
                types.push({
                    lang:filetype,
                    occurance:1,
                    ratio:1/total
                });
            }else{
                for(let i in types){
                    if(types[i].lang==filetype){
                        types[i].occurance++;
                        types[i].ratio=types[i].occurance/total;
                    }
                }
            }
        }
        return types;
    }
    getState(){
        return JSON.stringify(this.json)
    }
    getListAt(index){
        return this.json.printList[index];
    }
    getPrintList(){
        return this.json.printList;
    }
    getInputs(){
        return this.json.inputValues;
    }
    getTimeString(){
        let dateObj = new Date(this.json.time);
        return dateObj.toLocaleString();
    }
    getName(){
        return this.json.name;
    }
    getDetails(){
        return {
            name:this.getName(),
            date:this.getTimeString(),
            lengthPrint:this.json.printList.length,
            statsOfLangs:this.getStatsOfLangs()
        }
    }
    isListAt(index){
        if(this.json.printList[index]!=undefined){return true};
        return false;
    }
    deleteListAt(index){
        this.json.printList.splice(index,1);
    }
};