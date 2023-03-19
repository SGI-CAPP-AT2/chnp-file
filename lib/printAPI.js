/**
 * @param {chnpFile.getPrintList} listOfPrints 
 * accepts the chnpFile printList & prints it in blob web page
 */
function printCHNP(object)
{
    var url, list = object;
    let i = 0;
    url=URL.createObjectURL(new Blob([`
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Printed with github:SGI-CAPP-AT2/code-highlight-n-print</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/ss/style.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/ss/hljs.highlight.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/ss/fonts/fonts.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/themes/css/default.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/themes/css/mixture.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/themes/css/black Output.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/themes/css/Notebook.css">
            </head>
            <body class="print">
                <style>
                .outputBlock,.list{
                width: calc(100vw - 30px);
                }
                </style>
                <div class="list" style="margin: auto;">
                <h3>
                    <img src="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/ss/fonts/imgs/wm.svg" alt="Site WaterMark"/><br><img src="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/ss/fonts/imgs/time.svg" alt="Date WaterMark"/><br> Loading...
                </h3></div>
                <script>
                    document.body.classList.add(localStorage.setFont);
                    document.body.classList.add(sessionStorage.themeCode||localStorage.themeCode);
                </script>
                <script src="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/ss/highlight.min.js"></script>
                <script src="https://cdn.jsdelivr.net/gh/SGI-CAPP-AT2/code-highlight-n-print/tool/ss/printer.js"></script>
            </body>
        </html>
    `], { type: "text/html" }));
    if(list.length!=0){
        list.forEach(el=>{
            sessionStorage["l-"+i++]=JSON.stringify(el);
        })
        sessionStorage.list=i;
        sessionStorage.swm=true;
        sessionStorage.printedByAPI=true;
        window.location.assign(
            url
        )
    }
}