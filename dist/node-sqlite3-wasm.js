
var Module = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;
  if (typeof __filename != 'undefined') _scriptName ||= __filename;
  return (
function(moduleArg = {}) {
  var moduleRtn;

var Module=moduleArg;var readyPromiseResolve,readyPromiseReject;var readyPromise=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject});var ENVIRONMENT_IS_NODE=true;if(ENVIRONMENT_IS_NODE){}"use strict";const INT32_MIN=-2147483648;const INT32_MAX=2147483647;const NULL=0;const SQLITE_OK=0;const SQLITE_ROW=100;const SQLITE_DONE=101;const SQLITE_INTEGER=1;const SQLITE_FLOAT=2;const SQLITE_TEXT=3;const SQLITE_BLOB=4;const SQLITE_NULL=5;const SQLITE_UTF8=1;const SQLITE_TRANSIENT=-1;const SQLITE_DETERMINISTIC=2048;let temp;const sqlite3={};Module.onRuntimeInitialized=()=>{temp=stackAlloc(4);const v=null;const n="number";const s="string";const n1=[n];const n2=[n,...n1];const n3=[n,...n2];const n4=[n,...n3];const n5=[n,...n4];const signatures={open_v2:[n,[s,n,n,s]],exec:[n,n5],errmsg:[s,n1],prepare_v2:[n,n5],close_v2:[n,n1],finalize:[n,n1],reset:[n,n1],clear_bindings:[n,n1],bind_int:[n,n3],bind_int64:[n,n3],bind_double:[n,n3],bind_text:[n,n5],bind_blob:[n,n5],bind_blob64:[n,n5],bind_null:[n,n2],bind_parameter_index:[n,[n,s]],step:[n,n1],column_int64:[n,n2],column_double:[n,n2],column_text:[s,n2],column_blob:[n,n2],column_type:[n,n2],column_name:[s,n2],column_count:[n,n1],column_bytes:[n,n2],last_insert_rowid:[n,n1],changes:[n,n1],create_function_v2:[n,[n,s,n,n,n,n,n,n,n]],value_type:[n,n1],value_text:[s,n1],value_blob:[n,n1],value_int64:[n,n1],value_double:[n,n1],value_bytes:[n,n1],result_double:[v,n2],result_null:[v,n1],result_text:[v,n4],result_blob:[v,n4],result_blob64:[v,n4],result_int:[v,n2],result_int64:[v,n2],result_error:[v,n3],column_table_name:[s,n2],get_autocommit:[n,n1],sqlar_init:[n,n3]};for(const[name,sig]of Object.entries(signatures)){sqlite3[name]=cwrap(`sqlite3_${name}`,sig[0],sig[1])}};class SQLite3Error extends Error{constructor(message){super(message);this.name="SQLite3Error"}}function arrayToHeap(array){const ptr=_malloc(array.byteLength);HEAPU8.set(array,ptr);return ptr}function stringToHeap(str){const size=lengthBytesUTF8(str)+1;const ptr=_malloc(size);stringToUTF8(str,ptr,size);return ptr}function toNumberOrNot(bigInt){if(bigInt>=Number.MIN_SAFE_INTEGER&&bigInt<=Number.MAX_SAFE_INTEGER){return Number(bigInt)}return bigInt}function parseFunctionArguments(argc,argv){const args=[];for(let i=0;i<argc;i++){const ptr=getValue(argv+4*i,"i32");const type=sqlite3.value_type(ptr);let arg;switch(type){case SQLITE_INTEGER:arg=toNumberOrNot(sqlite3.value_int64(ptr));break;case SQLITE_FLOAT:arg=sqlite3.value_double(ptr);break;case SQLITE_TEXT:arg=sqlite3.value_text(ptr);break;case SQLITE_BLOB:const p=sqlite3.value_blob(ptr);if(p!=NULL){arg=HEAPU8.slice(p,p+sqlite3.value_bytes(ptr))}else{arg=new Uint8Array}break;case SQLITE_NULL:arg=null;break}args.push(arg)}return args}function setFunctionResult(cx,result){switch(typeof result){case"boolean":sqlite3.result_int(cx,result?1:0);break;case"number":if(Number.isSafeInteger(result)){if(result>=INT32_MIN&&result<=INT32_MAX){sqlite3.result_int(cx,result)}else{sqlite3.result_int64(cx,BigInt(result))}}else{sqlite3.result_double(cx,result)}break;case"bigint":sqlite3.result_int64(cx,result);break;case"string":const tempPtr=stringToHeap(result);sqlite3.result_text(cx,tempPtr,-1,SQLITE_TRANSIENT);_free(tempPtr);break;case"object":if(result===null){sqlite3.result_null(cx)}else if(result instanceof Uint8Array){const tempPtr=arrayToHeap(result);if(result.byteLength<=INT32_MAX){sqlite3.result_blob(cx,tempPtr,result.byteLength,SQLITE_TRANSIENT)}else{sqlite3.result_blob64(cx,tempPtr,BigInt(result.byteLength),SQLITE_TRANSIENT)}_free(tempPtr)}else{throw new SQLite3Error(`Unsupported type for function result: "${typeof result}"`)}break;default:throw new SQLite3Error(`Unsupported type for function result: "${typeof result}"`)}}class Database{constructor(filename,{fileMustExist:fileMustExist=false,readOnly:readOnly=false}={}){let flags;if(readOnly){flags=SQLITE_OPEN_READONLY}else{flags=SQLITE_OPEN_READWRITE;if(!fileMustExist)flags|=SQLITE_OPEN_CREATE}const rc=sqlite3.open_v2(filename,temp,flags,NULL);this._ptr=getValue(temp,"i32");if(rc!==SQLITE_OK){if(this._ptr!==NULL)sqlite3.close_v2(this._ptr);throw new SQLite3Error(`Could not open the database "${filename}"`)}this._functions=new Map;sqlite3.sqlar_init(this._ptr,0,0)}get isOpen(){return this._ptr!==null}get inTransaction(){this._assertOpen();return sqlite3.get_autocommit(this._ptr)===0}close(){this._assertOpen();for(const func of this._functions.values())removeFunction(func);this._functions.clear();this._handleError(sqlite3.close_v2(this._ptr));this._ptr=null}function(name,func,{deterministic:deterministic=false}={}){this._assertOpen();function wrappedFunc(cx,argc,argv){const args=parseFunctionArguments(argc,argv);let result;try{result=func.apply(null,args)}catch(err){const tempPtr=stringToHeap(err.toString());sqlite3.result_error(cx,tempPtr,-1);_free(tempPtr);return}setFunctionResult(cx,result)}if(this._functions.has(name)){removeFunction(this._functions.get(name));this._functions.delete(name)}const funcPtr=addFunction(wrappedFunc,"viii");this._functions.set(name,funcPtr);let eTextRep=SQLITE_UTF8;if(deterministic)eTextRep|=SQLITE_DETERMINISTIC;this._handleError(sqlite3.create_function_v2(this._ptr,name,func.length,eTextRep,NULL,funcPtr,NULL,NULL,NULL));return this}exec(sql){this._assertOpen();const tempPtr=stringToHeap(sql);try{this._handleError(sqlite3.exec(this._ptr,tempPtr,NULL,NULL,NULL))}finally{_free(tempPtr)}}prepare(sql){this._assertOpen();return new Statement(this,sql)}run(sql,values){const stmt=this.prepare(sql);try{return stmt.run(values)}finally{stmt.finalize()}}all(sql,values,{expand:expand=false}={}){return this._query(sql,values,false,expand)}get(sql,values,{expand:expand=false}={}){return this._query(sql,values,true,expand)}_query(sql,values,single,expand){const stmt=this.prepare(sql);try{if(single){return stmt.get(values,{expand:expand})}else{return stmt.all(values,{expand:expand})}}finally{stmt.finalize()}}_assertOpen(){if(!this.isOpen)throw new SQLite3Error("Database already closed")}_handleError(returnCode){if(returnCode!==SQLITE_OK)throw new SQLite3Error(sqlite3.errmsg(this._ptr))}}class Statement{constructor(db,sql){const tempPtr=stringToHeap(sql);try{db._handleError(sqlite3.prepare_v2(db._ptr,tempPtr,-1,temp,NULL))}finally{_free(tempPtr)}this._ptr=getValue(temp,"i32");if(this._ptr===NULL)throw new SQLite3Error("Nothing to prepare");this._db=db}get database(){return this._db}get isFinalized(){return this._ptr===null}run(values){this._assertReady();this._bind(values);this._step();return{changes:sqlite3.changes(this._db._ptr),lastInsertRowid:toNumberOrNot(sqlite3.last_insert_rowid(this._db._ptr))}}iterate(values,{expand:expand=false}={}){return this._queryRows(values,expand)}all(values,{expand:expand=false}={}){return Array.from(this.iterate(values,{expand:expand}))}get(values,{expand:expand=false}={}){const result=this._queryRows(values,expand).next();return result.done?null:result.value}finalize(){if(this.isFinalized)throw new SQLite3Error("Statement already finalized");try{this._db._handleError(sqlite3.finalize(this._ptr))}finally{this._ptr=null}}_reset(){return sqlite3.clear_bindings(this._ptr)===SQLITE_OK&&sqlite3.reset(this._ptr)===SQLITE_OK}*_queryRows(values,expand){this._assertReady();this._bind(values);const columns=this._getColumnNames();while(this._step())yield this._getRow(columns,expand)}_bind(values){if(!this._reset()){throw new SQLite3Error("Could not reset statement prior to binding new values")}if(Array.isArray(values)){this._bindArray(values)}else if(values!=null&&typeof values==="object"){this._bindObject(values)}else if(typeof values!=="undefined"){this._bindValue(values,1)}}_step(){const ret=sqlite3.step(this._ptr);switch(ret){case SQLITE_ROW:return true;case SQLITE_DONE:return false;default:this._db._handleError(ret)}}_getRow(columns,expand){const row={};for(let i=0;i<columns.length;i++){let v;const colType=sqlite3.column_type(this._ptr,i);switch(colType){case SQLITE_INTEGER:v=toNumberOrNot(sqlite3.column_int64(this._ptr,i));break;case SQLITE_FLOAT:v=sqlite3.column_double(this._ptr,i);break;case SQLITE_TEXT:v=sqlite3.column_text(this._ptr,i);break;case SQLITE_BLOB:const p=sqlite3.column_blob(this._ptr,i);if(p!=NULL){v=HEAPU8.slice(p,p+sqlite3.column_bytes(this._ptr,i))}else{v=new Uint8Array}break;case SQLITE_NULL:v=null;break}const column=columns[i];if(expand){let table=sqlite3.column_table_name(this._ptr,i);table=table===""?"$":table;if(Object.hasOwn(row,table)){row[table][column]=v}else{row[table]={[column]:v}}}else{row[column]=v}}return row}_getColumnNames(){const names=[];const columns=sqlite3.column_count(this._ptr);for(let i=0;i<columns;i++)names.push(sqlite3.column_name(this._ptr,i));return names}_bindArray(values){for(let i=0;i<values.length;i++)this._bindValue(values[i],i+1)}_bindObject(values){for(const[param,value]of Object.entries(values)){const i=sqlite3.bind_parameter_index(this._ptr,param);if(i===0)throw new SQLite3Error(`Unknown binding parameter: "${param}"`);this._bindValue(value,i)}}_bindValue(value,position){let ret;switch(typeof value){case"string":const tempPtr=stringToHeap(value);ret=sqlite3.bind_text(this._ptr,position,tempPtr,-1,SQLITE_TRANSIENT);_free(tempPtr);break;case"number":if(Number.isSafeInteger(value)){if(value>=INT32_MIN&&value<=INT32_MAX){ret=sqlite3.bind_int(this._ptr,position,value)}else{ret=sqlite3.bind_int64(this._ptr,position,BigInt(value))}}else{ret=sqlite3.bind_double(this._ptr,position,value)}break;case"bigint":ret=sqlite3.bind_int64(this._ptr,position,value);break;case"boolean":ret=sqlite3.bind_int(this._ptr,position,value?1:0);break;case"object":if(value===null){ret=sqlite3.bind_null(this._ptr,position)}else if(value instanceof Uint8Array){const tempPtr=arrayToHeap(value);if(value.byteLength<=INT32_MAX){ret=sqlite3.bind_blob(this._ptr,position,tempPtr,value.byteLength,SQLITE_TRANSIENT)}else{ret=sqlite3.bind_blob64(this._ptr,position,tempPtr,BigInt(value.byteLength),SQLITE_TRANSIENT)}_free(tempPtr)}else{throw new SQLite3Error(`Unsupported type for binding: "${typeof value}"`)}break;default:throw new SQLite3Error(`Unsupported type for binding: "${typeof value}"`)}if(ret!==SQLITE_OK)this._db._handleError(ret)}_assertReady(){if(this.isFinalized)throw new SQLite3Error("Statement already finalized");if(!this._db.isOpen)throw new SQLite3Error("Database is closed")}}Module.Database=Database;Module.SQLite3Error=SQLite3Error;"use strict";const path=require("node:path");const crypto=require("node:crypto");const SQLITE_CANTOPEN=14;const SQLITE_IOERR_READ=266;const SQLITE_IOERR_SHORT_READ=522;const SQLITE_IOERR_FSYNC=1034;const SQLITE_IOERR_WRITE=778;const SQLITE_IOERR_DELETE=2570;const SQLITE_IOERR_CLOSE=4106;const SQLITE_IOERR_TRUNCATE=1546;const SQLITE_IOERR_FSTAT=1802;const SQLITE_IOERR_LOCK=3850;const SQLITE_IOERR_UNLOCK=2058;const SQLITE_OPEN_READONLY=1;const SQLITE_OPEN_READWRITE=2;const SQLITE_OPEN_CREATE=4;const SQLITE_OPEN_EXCLUSIVE=16;const SQLITE_ACCESS_READWRITE=1;const SQLITE_ACCESS_READ=2;const SQLITE_LOCK_NONE=0;const SQLITE_BUSY=5;function _fd(fileInfo){return getValue(fileInfo+4,"i32")}function _isLocked(fileInfo){return getValue(fileInfo+8,"i32")!=0}function _setLocked(fileInfo,locked){setValue(fileInfo+8,locked?1:0,"i32")}function _path(fileInfo){return UTF8ToString(getValue(fileInfo+12,"i32"))}function _safeInt(bigInt){if(bigInt<Number.MIN_SAFE_INTEGER||bigInt>Number.MAX_SAFE_INTEGER)throw 0;return Number(bigInt)}var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readAsync,readBinary;if(ENVIRONMENT_IS_NODE){var fs=require("fs");var nodePath=require("path");scriptDirectory=__dirname+"/";readBinary=filename=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);var ret=fs.readFileSync(filename);return ret};readAsync=(filename,binary=true)=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);return new Promise((resolve,reject)=>{fs.readFile(filename,binary?undefined:"utf8",(err,data)=>{if(err)reject(err);else resolve(binary?data.buffer:data)})})};if(!Module["thisProgram"]&&process.argv.length>1){thisProgram=process.argv[1].replace(/\\/g,"/")}arguments_=process.argv.slice(2);quit_=(status,toThrow)=>{process.exitCode=status;throw toThrow}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.error.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var wasmMemory;var ABORT=false;var EXITSTATUS;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAP64,HEAPU64,HEAPF64;function updateMemoryViews(){var b=wasmMemory.buffer;Module["HEAP8"]=HEAP8=new Int8Array(b);Module["HEAP16"]=HEAP16=new Int16Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);Module["HEAPU16"]=HEAPU16=new Uint16Array(b);Module["HEAP32"]=HEAP32=new Int32Array(b);Module["HEAPU32"]=HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);Module["HEAPF64"]=HEAPF64=new Float64Array(b);Module["HEAP64"]=HEAP64=new BigInt64Array(b);Module["HEAPU64"]=HEAPU64=new BigUint64Array(b)}var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;Module["monitorRunDependencies"]?.(runDependencies)}function removeRunDependency(id){runDependencies--;Module["monitorRunDependencies"]?.(runDependencies);if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){Module["onAbort"]?.(what);what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";var isDataURI=filename=>filename.startsWith(dataURIPrefix);var isFileURI=filename=>filename.startsWith("file://");function findWasmBinary(){var f="node-sqlite3-wasm.wasm";if(!isDataURI(f)){return locateFile(f)}return f}var wasmBinaryFile;function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw'sync fetching of the wasm failed: you can preload it to Module["wasmBinary"] manually, or emcc.py will do that for you when generating HTML (but not JS)'}function instantiateSync(file,info){var module;var binary=getBinarySync(file);module=new WebAssembly.Module(binary);var instance=new WebAssembly.Instance(module,info);return[instance,module]}function getWasmImports(){return{a:wasmImports}}function createWasm(){var info=getWasmImports();function receiveInstance(instance,module){wasmExports=instance.exports;wasmMemory=wasmExports["x"];updateMemoryViews();wasmTable=wasmExports["sa"];addOnInit(wasmExports["y"]);removeRunDependency("wasm-instantiate");return wasmExports}addRunDependency("wasm-instantiate");if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err(`Module.instantiateWasm callback failed with error: ${e}`);readyPromiseReject(e)}}if(!wasmBinaryFile)wasmBinaryFile=findWasmBinary();var result=instantiateSync(wasmBinaryFile,info);return receiveInstance(result[0])}var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};function getValue(ptr,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":return HEAP8[ptr];case"i8":return HEAP8[ptr];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP64[ptr>>3];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];case"*":return HEAPU32[ptr>>2];default:abort(`invalid type for getValue: ${type}`)}}var noExitRuntime=Module["noExitRuntime"]||true;function setValue(ptr,value,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":HEAP8[ptr]=value;break;case"i8":HEAP8[ptr]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":HEAP64[ptr>>3]=BigInt(value);break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;case"*":HEAPU32[ptr>>2]=value;break;default:abort(`invalid type for setValue: ${type}`)}}var stackRestore=val=>__emscripten_stack_restore(val);var stackSave=()=>_emscripten_stack_get_current();var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder:undefined;var UTF8ArrayToString=(heapOrArray,idx,maxBytesToRead)=>{var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str};var UTF8ToString=(ptr,maxBytesToRead)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):"";var ___assert_fail=(condition,filename,line,func)=>{abort(`Assertion failed: ${UTF8ToString(condition)}, at: `+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"])};var isLeapYear=year=>year%4===0&&(year%100!==0||year%400===0);var MONTH_DAYS_LEAP_CUMULATIVE=[0,31,60,91,121,152,182,213,244,274,305,335];var MONTH_DAYS_REGULAR_CUMULATIVE=[0,31,59,90,120,151,181,212,243,273,304,334];var ydayFromDate=date=>{var leap=isLeapYear(date.getFullYear());var monthDaysCumulative=leap?MONTH_DAYS_LEAP_CUMULATIVE:MONTH_DAYS_REGULAR_CUMULATIVE;var yday=monthDaysCumulative[date.getMonth()]+date.getDate()-1;return yday};var INT53_MAX=9007199254740992;var INT53_MIN=-9007199254740992;var bigintToI53Checked=num=>num<INT53_MIN||num>INT53_MAX?NaN:Number(num);function __localtime_js(time,tmPtr){time=bigintToI53Checked(time);var date=new Date(time*1e3);HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getDay();var yday=ydayFromDate(date)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+36>>2]=-(date.getTimezoneOffset()*60);var start=new Date(date.getFullYear(),0,1);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>2]=dst}var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx};var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var __tzset_js=(timezone,daylight,std_name,dst_name)=>{var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAPU32[timezone>>2]=stdTimezoneOffset*60;HEAP32[daylight>>2]=Number(winterOffset!=summerOffset);var extractZone=timezoneOffset=>{var sign=timezoneOffset>=0?"-":"+";var absOffset=Math.abs(timezoneOffset);var hours=String(Math.floor(absOffset/60)).padStart(2,"0");var minutes=String(absOffset%60).padStart(2,"0");return`UTC${sign}${hours}${minutes}`};var winterName=extractZone(winterOffset);var summerName=extractZone(summerOffset);if(summerOffset<winterOffset){stringToUTF8(winterName,std_name,17);stringToUTF8(summerName,dst_name,17)}else{stringToUTF8(winterName,dst_name,17);stringToUTF8(summerName,std_name,17)}};var _emscripten_date_now=()=>Date.now();var _emscripten_get_now;_emscripten_get_now=()=>performance.now();var getHeapMax=()=>2147483648;var growMemory=size=>{var b=wasmMemory.buffer;var pages=(size-b.byteLength+65535)/65536;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){}};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}var alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}return false};var ENV={};var getExecutableName=()=>thisProgram||"./this.program";var getEnvStrings=()=>{if(!getEnvStrings.strings){var lang=(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8";var env={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:lang,_:getExecutableName()};for(var x in ENV){if(ENV[x]===undefined)delete env[x];else env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(`${x}=${env[x]}`)}getEnvStrings.strings=strings}return getEnvStrings.strings};var stringToAscii=(str,buffer)=>{for(var i=0;i<str.length;++i){HEAP8[buffer++]=str.charCodeAt(i)}HEAP8[buffer]=0};var _environ_get=(__environ,environ_buf)=>{var bufSize=0;getEnvStrings().forEach((string,i)=>{var ptr=environ_buf+bufSize;HEAPU32[__environ+i*4>>2]=ptr;stringToAscii(string,ptr);bufSize+=string.length+1});return 0};var _environ_sizes_get=(penviron_count,penviron_buf_size)=>{var strings=getEnvStrings();HEAPU32[penviron_count>>2]=strings.length;var bufSize=0;strings.forEach(string=>bufSize+=string.length+1);HEAPU32[penviron_buf_size>>2]=bufSize;return 0};function _nodejsAccess(vfs,filePath,flags,outResult){let aflags=fs.constants.F_OK;if(flags==SQLITE_ACCESS_READWRITE)aflags=fs.constants.R_OK|fs.constants.W_OK;if(flags==SQLITE_ACCESS_READ)aflags=fs.constants.R_OK;try{fs.accessSync(UTF8ToString(filePath),aflags);setValue(outResult,1,"i32")}catch{setValue(outResult,0,"i32")}return SQLITE_OK}function _nodejsCheckReservedLock(fi,outResult){try{fs.accessSync(`${_path(fi)}.lock`,fs.constants.F_OK);setValue(outResult,1,"i32")}catch{setValue(outResult,0,"i32")}return SQLITE_OK}function _nodejsClose(fi){_nodejsUnlock(fi,SQLITE_LOCK_NONE);try{fs.closeSync(_fd(fi))}catch{return SQLITE_IOERR_CLOSE}return SQLITE_OK}function _nodejsDelete(vfs,filePath,dirSync){const pathStr=UTF8ToString(filePath);try{fs.unlinkSync(pathStr)}catch(err){if(err.code!="ENOENT")return SQLITE_IOERR_DELETE}if(dirSync){let fd=-1;try{fd=fs.openSync(path.dirname(pathStr),"r");fs.fsyncSync(fd)}catch{return SQLITE_IOERR_FSYNC}finally{try{fs.closeSync(fd)}catch{return SQLITE_IOERR_FSYNC}}}return SQLITE_OK}function _nodejsFileSize(fi,outSize){try{setValue(outSize,fs.fstatSync(_fd(fi)).size,"i64")}catch{return SQLITE_IOERR_FSTAT}return SQLITE_OK}function _nodejsFullPathname(vfs,relPath,sizeFullPath,outFullPath){const full=path.resolve(UTF8ToString(relPath));stringToUTF8(full,outFullPath,sizeFullPath);return full.length<sizeFullPath?SQLITE_OK:SQLITE_CANTOPEN}function _nodejsLock(fi,level){if(!_isLocked(fi)){try{fs.mkdirSync(`${_path(fi)}.lock`)}catch(err){return err.code=="EEXIST"?SQLITE_BUSY:SQLITE_IOERR_LOCK}_setLocked(fi,true)}return SQLITE_OK}function _nodejsRandomness(vfs,bytes,outBuffer){const buf=HEAPU8.subarray(outBuffer,outBuffer+bytes);crypto.randomFillSync(buf);return bytes}function _nodejsRead(fi,outBuffer,bytes,offset){const buf=HEAPU8.subarray(outBuffer,outBuffer+bytes);let bytesRead;try{bytesRead=fs.readSync(_fd(fi),buf,0,bytes,offset)}catch{return SQLITE_IOERR_READ}if(bytesRead==bytes){return SQLITE_OK}else if(bytesRead>=0){if(bytesRead<bytes){try{buf.fill(0,bytesRead)}catch{return SQLITE_IOERR_READ}}return SQLITE_IOERR_SHORT_READ}return SQLITE_IOERR_READ}function _nodejsSync(fi,flags){try{fs.fsyncSync(_fd(fi))}catch{return SQLITE_IOERR_FSYNC}return SQLITE_OK}function _nodejsTruncate(fi,size){try{fs.ftruncateSync(_fd(fi),_safeInt(size))}catch{return SQLITE_IOERR_TRUNCATE}return SQLITE_OK}function _nodejsUnlock(fi,level){if(level==SQLITE_LOCK_NONE&&_isLocked(fi)){try{fs.rmdirSync(`${_path(fi)}.lock`)}catch(err){if(err.code!="ENOENT")return SQLITE_IOERR_UNLOCK}_setLocked(fi,false)}return SQLITE_OK}function _nodejsWrite(fi,buffer,bytes,offset){try{const bytesWritten=fs.writeSync(_fd(fi),HEAPU8.subarray(buffer,buffer+bytes),0,bytes,_safeInt(offset));return bytesWritten!=bytes?SQLITE_IOERR_WRITE:SQLITE_OK}catch{return SQLITE_IOERR_WRITE}}function _nodejs_max_path_length(){return process.platform=="win32"?260:4096}function _nodejs_open(filePath,flags,mode){let oflags=0;if(flags&SQLITE_OPEN_EXCLUSIVE)oflags|=fs.constants.O_EXCL;if(flags&SQLITE_OPEN_CREATE)oflags|=fs.constants.O_CREAT;if(flags&SQLITE_OPEN_READONLY)oflags|=fs.constants.O_RDONLY;if(flags&SQLITE_OPEN_READWRITE)oflags|=fs.constants.O_RDWR;try{return fs.openSync(UTF8ToString(filePath),oflags,mode)}catch{return-1}}var getCFunc=ident=>{var func=Module["_"+ident];return func};var writeArrayToMemory=(array,buffer)=>{HEAP8.set(array,buffer)};var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var stackAlloc=sz=>__emscripten_stack_alloc(sz);var stringToUTF8OnStack=str=>{var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8(str,ret,size);return ret};var ccall=(ident,returnType,argTypes,args,opts)=>{var toC={string:str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=stringToUTF8OnStack(str)}return ret},array:arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func(...cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret};var cwrap=(ident,returnType,argTypes,opts)=>{var numericArgs=!argTypes||argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return(...args)=>ccall(ident,returnType,argTypes,args,opts)};var uleb128Encode=(n,target)=>{if(n<128){target.push(n)}else{target.push(n%128|128,n>>7)}};var sigToWasmTypes=sig=>{var typeNames={i:"i32",j:"i64",f:"f32",d:"f64",e:"externref",p:"i32"};var type={parameters:[],results:sig[0]=="v"?[]:[typeNames[sig[0]]]};for(var i=1;i<sig.length;++i){type.parameters.push(typeNames[sig[i]])}return type};var generateFuncType=(sig,target)=>{var sigRet=sig.slice(0,1);var sigParam=sig.slice(1);var typeCodes={i:127,p:127,j:126,f:125,d:124,e:111};target.push(96);uleb128Encode(sigParam.length,target);for(var i=0;i<sigParam.length;++i){target.push(typeCodes[sigParam[i]])}if(sigRet=="v"){target.push(0)}else{target.push(1,typeCodes[sigRet])}};var convertJsFunctionToWasm=(func,sig)=>{if(typeof WebAssembly.Function=="function"){return new WebAssembly.Function(sigToWasmTypes(sig),func)}var typeSectionBody=[1];generateFuncType(sig,typeSectionBody);var bytes=[0,97,115,109,1,0,0,0,1];uleb128Encode(typeSectionBody.length,bytes);bytes.push(...typeSectionBody);bytes.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);var module=new WebAssembly.Module(new Uint8Array(bytes));var instance=new WebAssembly.Instance(module,{e:{f:func}});var wrappedFunc=instance.exports["f"];return wrappedFunc};var wasmTableMirror=[];var wasmTable;var getWasmTableEntry=funcPtr=>{var func=wasmTableMirror[funcPtr];if(!func){if(funcPtr>=wasmTableMirror.length)wasmTableMirror.length=funcPtr+1;wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}return func};var updateTableMap=(offset,count)=>{if(functionsInTableMap){for(var i=offset;i<offset+count;i++){var item=getWasmTableEntry(i);if(item){functionsInTableMap.set(item,i)}}}};var functionsInTableMap;var getFunctionAddress=func=>{if(!functionsInTableMap){functionsInTableMap=new WeakMap;updateTableMap(0,wasmTable.length)}return functionsInTableMap.get(func)||0};var freeTableIndexes=[];var getEmptyTableSlot=()=>{if(freeTableIndexes.length){return freeTableIndexes.pop()}try{wasmTable.grow(1)}catch(err){if(!(err instanceof RangeError)){throw err}throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."}return wasmTable.length-1};var setWasmTableEntry=(idx,func)=>{wasmTable.set(idx,func);wasmTableMirror[idx]=wasmTable.get(idx)};var addFunction=(func,sig)=>{var rtn=getFunctionAddress(func);if(rtn){return rtn}var ret=getEmptyTableSlot();try{setWasmTableEntry(ret,func)}catch(err){if(!(err instanceof TypeError)){throw err}var wrapped=convertJsFunctionToWasm(func,sig);setWasmTableEntry(ret,wrapped)}functionsInTableMap.set(func,ret);return ret};var removeFunction=index=>{functionsInTableMap.delete(getWasmTableEntry(index));setWasmTableEntry(index,null);freeTableIndexes.push(index)};var wasmImports={b:___assert_fail,k:__localtime_js,l:__tzset_js,p:_emscripten_date_now,a:_emscripten_get_now,j:_emscripten_resize_heap,n:_environ_get,o:_environ_sizes_get,m:_nodejsAccess,r:_nodejsCheckReservedLock,f:_nodejsClose,w:_nodejsDelete,u:_nodejsFileSize,i:_nodejsFullPathname,t:_nodejsLock,h:_nodejsRandomness,e:_nodejsRead,v:_nodejsSync,c:_nodejsTruncate,s:_nodejsUnlock,d:_nodejsWrite,g:_nodejs_max_path_length,q:_nodejs_open};var wasmExports=createWasm();var ___wasm_call_ctors=wasmExports["y"];var _sqlite3_finalize=Module["_sqlite3_finalize"]=wasmExports["z"];var _sqlite3_reset=Module["_sqlite3_reset"]=wasmExports["A"];var _sqlite3_clear_bindings=Module["_sqlite3_clear_bindings"]=wasmExports["B"];var _sqlite3_value_blob=Module["_sqlite3_value_blob"]=wasmExports["C"];var _sqlite3_value_text=Module["_sqlite3_value_text"]=wasmExports["D"];var _sqlite3_value_bytes=Module["_sqlite3_value_bytes"]=wasmExports["E"];var _sqlite3_value_double=Module["_sqlite3_value_double"]=wasmExports["F"];var _sqlite3_value_int64=Module["_sqlite3_value_int64"]=wasmExports["G"];var _sqlite3_value_type=Module["_sqlite3_value_type"]=wasmExports["H"];var _sqlite3_result_blob=Module["_sqlite3_result_blob"]=wasmExports["I"];var _sqlite3_result_blob64=Module["_sqlite3_result_blob64"]=wasmExports["J"];var _sqlite3_result_double=Module["_sqlite3_result_double"]=wasmExports["K"];var _sqlite3_result_error=Module["_sqlite3_result_error"]=wasmExports["L"];var _sqlite3_result_int=Module["_sqlite3_result_int"]=wasmExports["M"];var _sqlite3_result_int64=Module["_sqlite3_result_int64"]=wasmExports["N"];var _sqlite3_result_null=Module["_sqlite3_result_null"]=wasmExports["O"];var _sqlite3_result_text=Module["_sqlite3_result_text"]=wasmExports["P"];var _sqlite3_step=Module["_sqlite3_step"]=wasmExports["Q"];var _sqlite3_column_count=Module["_sqlite3_column_count"]=wasmExports["R"];var _sqlite3_column_blob=Module["_sqlite3_column_blob"]=wasmExports["S"];var _sqlite3_column_bytes=Module["_sqlite3_column_bytes"]=wasmExports["T"];var _sqlite3_column_double=Module["_sqlite3_column_double"]=wasmExports["U"];var _sqlite3_column_int64=Module["_sqlite3_column_int64"]=wasmExports["V"];var _sqlite3_column_text=Module["_sqlite3_column_text"]=wasmExports["W"];var _sqlite3_column_type=Module["_sqlite3_column_type"]=wasmExports["X"];var _sqlite3_column_name=Module["_sqlite3_column_name"]=wasmExports["Y"];var _sqlite3_column_table_name=Module["_sqlite3_column_table_name"]=wasmExports["Z"];var _sqlite3_bind_blob=Module["_sqlite3_bind_blob"]=wasmExports["_"];var _sqlite3_bind_blob64=Module["_sqlite3_bind_blob64"]=wasmExports["$"];var _sqlite3_bind_double=Module["_sqlite3_bind_double"]=wasmExports["aa"];var _sqlite3_bind_int=Module["_sqlite3_bind_int"]=wasmExports["ba"];var _sqlite3_bind_int64=Module["_sqlite3_bind_int64"]=wasmExports["ca"];var _sqlite3_bind_null=Module["_sqlite3_bind_null"]=wasmExports["da"];var _sqlite3_bind_text=Module["_sqlite3_bind_text"]=wasmExports["ea"];var _sqlite3_bind_parameter_index=Module["_sqlite3_bind_parameter_index"]=wasmExports["fa"];var _sqlite3_exec=Module["_sqlite3_exec"]=wasmExports["ga"];var _sqlite3_prepare_v2=Module["_sqlite3_prepare_v2"]=wasmExports["ha"];var _sqlite3_errmsg=Module["_sqlite3_errmsg"]=wasmExports["ia"];var _sqlite3_last_insert_rowid=Module["_sqlite3_last_insert_rowid"]=wasmExports["ja"];var _sqlite3_changes=Module["_sqlite3_changes"]=wasmExports["ka"];var _sqlite3_close_v2=Module["_sqlite3_close_v2"]=wasmExports["la"];var _sqlite3_create_function_v2=Module["_sqlite3_create_function_v2"]=wasmExports["ma"];var _sqlite3_open_v2=Module["_sqlite3_open_v2"]=wasmExports["na"];var _sqlite3_get_autocommit=Module["_sqlite3_get_autocommit"]=wasmExports["oa"];var _malloc=Module["_malloc"]=wasmExports["pa"];var _free=Module["_free"]=wasmExports["qa"];var _sqlite3_sqlar_init=Module["_sqlite3_sqlar_init"]=wasmExports["ra"];var __emscripten_stack_restore=wasmExports["ta"];var __emscripten_stack_alloc=wasmExports["ua"];var _emscripten_stack_get_current=wasmExports["va"];Module["cwrap"]=cwrap;Module["addFunction"]=addFunction;Module["removeFunction"]=removeFunction;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);Module["onRuntimeInitialized"]?.();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();moduleRtn=Module;


  return moduleRtn;
}
);
})()();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], () => Module);
