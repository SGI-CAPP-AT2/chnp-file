# chnp-file
HANDLE `.CHNP-SESSION-JSON` file using [`API script`](https://github.com/SGI-CAPP-AT2/chnp-file/blob/main/lib/API.js) 
# APIS
## `CREATE OBJECT`
```js
const chnpObject = new chnpFile(fileJson);
```
## `CHNPFILEOBJECT.forInPrintList`
`type:void`
There is array of print pages in chnp file which lets you access final printing pages 
### ARRAY PREV
```json
{
  "printList": [
    {
      "title": "",
      "code": "",
      "output": "",
      "filename": "",
      "rtf": "\n Paste Your Image Here",
      "watermark": "github:sgi-capp-at2/code-highlight-n-print",
      "rtfBool": "false"
    },
  ]
}
```
### use of `forInPrintList`
You can use it as you use `for in/of` loop
#### example
```js
CHNPFILEOBJECT.forInPrintList((i,item)=>{
  /*
  @param i access index 
  @param item access JSON of page contents which are given above in #ARRAY-PREV
  */
  console.log(i,item); // READ
  item.title="MY NEW TITLE"; // WRITE
});
```
## `CHNPFILEOBJECT.setCurrentTime`
`type:void`
There is time saved in chnp file that shows when the file created
#### TIME PREV
```json
{
   "time":1669259632885
}
```
It lets you override the time saved in the chnp file with current time
### use of `CHNPFILEOBJECT.setCurrentTime`
```js
CHNPFILEOBJECT.setCurrentTime(); // no parameters
```
# DOC IS NOT COMPLETED YET
<p align="right">ShGI</p>
