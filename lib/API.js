class chnpFile
{
    constructor(json){
        this.json=json;
    }
    forInPrintList(fun){
        let newPrintList = [];
        for(let item of this.json.printList){
            newPrintList.push(fun(item));
        }
        this.json.printList=newPrintList;
    }
    setWm(newWM){
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
        let dateObj = new Date();
        return dateObj.toLocaleString(this.json.time);
    }
    getName(){
        return this.json.name;
    }
    getDetails(){
        return {
            name:this.getName,
            date:this.getTimeString(),
            lengthPrint:this.json.printList.length,
            statsOfLangs:this.getStatsOfLangs()
        }
    }
    isListAt(index){
        if(this.json.printList[index]!=undefined){return true};
        return false;
    }
};