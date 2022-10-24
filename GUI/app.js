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
    if(ev.dataTransfer.items){
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
        html=`<div style="margin:0 20px;">
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
        $select(".view").innerHTML=html;
},
sanitize=str=>str.replaceAll("<","&lt;"),
next=()=>{
    if(chnpObject.isListAt(current+1)==true){
        current++;
        setUpPage(chnpObject.getListAt(current));
    }
},
previous=()=>{
    if(chnpObject.isListAt(current-1)==true){
        current--;
        setUpPage(chnpObject.getListAt(current));
    }
},
printOP=()=>{
    let list = [...chnpObject.getPrintList()];
    let i = 0;
    if(list.length!=0){
    list.forEach(el=>{
        sessionStorage["l-"+i++]=JSON.stringify(el);
    })
    sessionStorage.list=i;
    window.location.assign(
        "https://sgi-capp-at2.github.io/code-highlight-n-print/tool/print.html?pb=true"
    )
    }
};
var keyMap={
    ArrowRight:next,
    ArrowLeft:previous
}
window.addEventListener("keyup",ev=>{
    ev.preventDefault();
    if(keyMap[ev.key]) keyMap[ev.key]();
})
$select("div.main").style.height="calc(100vw - "+($select("nav").offsetHeight+35)+"px)";