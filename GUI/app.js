var $select = q => document.querySelector(q),
$multiple = q => document.querySelectorAll(q),
importFile = () =>{
    let uploader = Emmet("input");
    uploader.type="file";
    uploader.accept=".chnp-session-json";
    uploader.click();
    uploader.onchange=handleFileChange;
},
handleFileChange = ev =>{
    $select("div.upload").innerHTML=`
    <div center middle class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    `;
    console.log(ev)
    let reader = new FileReader();
    reader.onload=readFile;
    reader.readAsText(ev.target.files[0]);
},
chnpObject,
current=0,
readFile = ev =>{
    try{
        let fileJson = JSON.parse(ev.target.result);
        chnpObject = new chnpFile(fileJson);
        console.log(chnpObject)
        $select(".upload").style.display="none";
        importFile=()=>{};
        setUpPage(chnpObject.getListAt(current));
        let name = chnpObject.getDetails().name;
        $select("nav#title").innerText=name;
    }catch(e){
        $select("div.upload").innerHTML=`<g-icon middle center>upload</g-icon>`;
        $select(".upload g-icon").innerText="warning";
        $select(".upload g-icon").classList.remove("hover");
        $select(".upload g-icon").classList.add("invalid");
    }
},
handleDragOver=ev=>{
    ev.preventDefault();
    $select(".upload g-icon").innerText="description";
    $select(".upload g-icon").classList.add("hover");
},
handleDragLeave=ev=>{
    ev.preventDefault();
    $select(".upload g-icon").innerText="upload";
    $select(".upload g-icon").classList.remove("hover");
},
handleDrop=ev=>{
    ev.preventDefault();
    if(ev.dataTransfer.items&&[...ev.dataTransfer.items][0].getAsFile()!=null){
        let name = [...ev.dataTransfer.items][0].getAsFile().name, ext = name.split(".")[name.split(".").length-1];
        if(ext=="chnp-session-json"){
            handleFileChange({target:{files:[[...ev.dataTransfer.items][0].getAsFile()]}})
        }else{
            $select(".upload g-icon").innerText="warning";
            $select(".upload g-icon").classList.remove("hover");
            $select(".upload g-icon").classList.add("invalid");
        }
    }
},
setUpPage=json=>{
        let cq = json;
        if(cq.rtfBool=="true"){rtfDisplay="inline"}else{rtfDisplay="none"}
        html=`<div id="pageOutput" style="margin:0 20px;">
        <b>
        ${sanitize(cq.title)}
        </b>
        <div class="outputBlock" style="margin-top:10px">
        <p class="filenames"><span class="filename">${cq.filename}</span></p>
        <p class="input">${sanitize(cq.code)}</p>
        <p class="output">${sanitize(cq.output)}</p>
        <p align="center" class="img">
            <span style="display: ${rtfDisplay};" class="imageOutput">
            ${cq.rtf}
            </span>
        </p>
        <p class="wm" align="right">
            <span>
            ${cq.watermark}
            </span>
        </p>
        </div></div>
        <div class="mrg-20"></div>
        `;
        $select("#index").innerText=(current+1)+"/"+chnpObject.getPrintList().length;
        $select(".view").innerHTML=html;
},state,
sanitize=str=>str.replaceAll("<","&lt;"),
next=()=>{
    if(state!="edit"){
        current=(current+1)%chnpObject.getCount();
        setUpPage(chnpObject.getListAt(current));
    }
    return current;
},
previous=()=>{
    if(state!="edit"){
        current--;
        setUpPage(chnpObject.getListAt(current));
    }
    return current;
},
printOP=(index=false)=>{
    if(index==false)
    {
        printCHNP(chnpObject.getPrintList())
    }
    else
    {
        printCHNP([chnpObject.getListAt(index)])
    }
},
chnageAllWatermarks=()=>{
    let watermarkObject = new DynamicInput("Enter New Watermark ...");
    watermarkObject.onDone=(val)=>{
        watermarkObject.destroy();
        chnpObject.setWM(val) 
        setUpPage(chnpObject.getListAt(current));
    }
},
deletePage=()=>{
    chnpObject.deleteListAt(current);
    console.log(chnpObject)
    if(current>=0&&current<chnpObject.getPrintList().length-1){
        setUpPage(chnpObject.getListAt(current));
    }else{
        try{
            current=0;
            setUpPage((chnpObject.getListAt(0)))
        }catch(e){
            $select(".view").innerHTML=Emmet("div.centerContaint>span{No Pages Found in file}",true);
        }
    }
},
// pageOutput id 
outputBlockObjects=()=>{
    return [
        {
            key:"title",
            obj:$select("#pageOutput b")
        },
        {
            key:"filename",
            obj:$select("#pageOutput span.filename")
        },
        {
            key:"code",
            obj:$select("#pageOutput p.input")
        },
        {
            key:"output",
            obj:$select("#pageOutput p.output")
        },
        {
            key:"watermark",
            obj:$select("#pageOutput .wm span")
        }
    ]
},
editCurrentPage=(button)=>{
    if(state!="edit"){
        for(let item of outputBlockObjects()){
            item.obj.contentEditable=true;
        }
        state="edit";
        button.innerHTML=`
            <g-icon center="" middle="">
                done
            </g-icon>
        `;
    }else{
        let change={};
        for(let item of outputBlockObjects()){;
            item.obj.contentEditable=false;
            change[item.key]=item.obj.innerText;
        }
        chnpObject.changePrintListAt(current,change);
        state="";
        button.innerHTML=`
            <g-icon center="" middle="">
                edit
            </g-icon>
        `;
    }
},
renameSession=()=>{
    let newNameObj = new DynamicInput("Enter New Session Name");
    newNameObj.onDone=(val)=>{
        chnpObject.renameSession(val);
        newNameObj.destroy();
        let name = chnpObject.getDetails().name;
        $select("nav#title").innerText=name;
    }
},
showDetails=()=>{
    let text = "", details=chnpObject.getDetails();
    text+="<strong>Name: </strong>"+details.name+"<br>";
    text+="<strong>Prints: </strong>"+details.lengthPrint+"<br>";
    text+="<strong>Date: </strong>"+details.date+"<br>";
    text+="<small>Click Anywhere to close</small>"
    new DynamicWindow(text);
},
saveAtThisState=()=>{
    let url = getObjectString(chnpObject.getState());
    let a = document.createElement("a");
    a.href=url;
    a.download=chnpObject.getName()+".chnp-session-json"
    a.href=url;
    a.click();
},
getObjectString = string =>{
    return window.URL.createObjectURL(new Blob([string],{type:'text/json'}))
},
promptPageSetup = () =>
{
    let InputList = document.createElement("select");
    InputList.multiple=true;
    InputList.innerHTML=`
    <option selected="${getPBprop()}" value="pb">Page Breaks</option>
    <option selected="${getWDprop()}" value="wd">Date Mark</option>
    `;
    InputList.style.bottom=5+"px";
    InputList.style.left=5+"px";
    InputList.style.position="fixed";
    InputList.click();
    InputList.onblur=(e)=>
    {
        setPrintProps(e);
    }
    window.addEventListener("keyup",ev=>
    {
        if(ev.key.toLowerCase=="enter")
        {
            setPrintProps(InputList);
        }
    })
    document.body.append(InputList);
},
setPrintProps=e=>
{
    for(var option of e.target.options)
    {
        if(option.selected)
        {
            sessionStorage[option.value]=true;
        }
        else
        {
            sessionStorage[option.value]=false;
        }
    }
    e.target.remove();
},
getPBprop=()=>sessionStorage.pb,
getWDprop=()=>sessionStorage.wd;
;
class DynamicInput
{
    constructor(param){
        if(!$select("div.dynamicInput")){
            let inputBar = Emmet("div.screenBlock+div.dynamicInput>input.form-control+button.btn.btn-success{done}");
            console.log(inputBar)
            document.body.append(...inputBar);
            this.onDone=val=>{};
            $select("div.dynamicInput input").placeholder=param;
            $select("div.dynamicInput input").focus();
            $select("div.dynamicInput button").onclick=()=>{
                this.onDone($select("div.dynamicInput input").value);
            }
        }
    }
    destroy=()=>{
        [$select("div.screenBlock"),$select("div.dynamicInput")].forEach(e=>{
            e.remove();
        })
    }
};
class DynamicWindow
{
    constructor(text){
        this.win = Emmet("div.screenBlock > div.window{"+text+"}");
        document.body.append(this.win);
        this.win.onclick=this.destroy;
    }
    destroy(){
       $select("div.screenBlock").remove();
    }
}
var keyMap={
    ArrowRight:next,
    ArrowLeft:previous
}
window.addEventListener("keyup",ev=>{
    ev.preventDefault();
    if(keyMap[ev.key]) keyMap[ev.key]();
})
$select("div.main").style.height="calc(100vh - "+($select("nav").offsetHeight)+"px)";
