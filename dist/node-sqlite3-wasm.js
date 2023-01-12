
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(Module) {
  Module = Module || {};

var Module=typeof Module!="undefined"?Module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});"use strict";const NULL=0;const SQLITE_ROW=100;const SQLITE_DONE=101;const SQLITE_INTEGER=1;const SQLITE_FLOAT=2;const SQLITE_TEXT=3;const SQLITE_BLOB=4;const SQLITE_NULL=5;const SQLITE_UTF8=1;const SQLITE_TRANSIENT=-1;const SQLITE_DETERMINISTIC=2048;let temp;let sqlite3_open_v2;let sqlite3_exec;let sqlite3_errmsg;let sqlite3_prepare_v2;let sqlite3_close_v2;let sqlite3_finalize;let sqlite3_reset;let sqlite3_clear_bindings;let sqlite3_bind_int;let sqlite3_bind_double;let sqlite3_bind_text;let sqlite3_bind_null;let sqlite3_bind_parameter_index;let sqlite3_step;let sqlite3_column_int;let sqlite3_column_double;let sqlite3_column_text;let sqlite3_column_type;let sqlite3_column_name;let sqlite3_column_count;let sqlite3_last_insert_rowid;let sqlite3_changes;let sqlite3_create_function_v2;let sqlite3_value_type;let sqlite3_value_text;let sqlite3_value_int;let sqlite3_value_double;let sqlite3_result_double;let sqlite3_result_null;let sqlite3_result_text;let sqlite3_result_int;let sqlite3_result_error;let sqlite3_column_table_name;let sqlite3_get_autocommit;Module.onRuntimeInitialized=()=>{temp=stackAlloc(4);sqlite3_open_v2=cwrap("sqlite3_open_v2","number",["string","number","number","string"]);sqlite3_exec=cwrap("sqlite3_exec","number",["number","string","number","number","number"]);sqlite3_errmsg=cwrap("sqlite3_errmsg","string",["number"]);sqlite3_prepare_v2=cwrap("sqlite3_prepare_v2","number",["number","string","number","number","number"]);sqlite3_close_v2=cwrap("sqlite3_close_v2","number",["number"]);sqlite3_finalize=cwrap("sqlite3_finalize","number",["number"]);sqlite3_reset=cwrap("sqlite3_reset","number",["number"]);sqlite3_clear_bindings=cwrap("sqlite3_clear_bindings","number",["number"]);sqlite3_bind_int=cwrap("sqlite3_bind_int","number",["number","number","number"]);sqlite3_bind_double=cwrap("sqlite3_bind_double","number",["number","number","number"]);sqlite3_bind_text=cwrap("sqlite3_bind_text","number",["number","number","string","number","number"]);sqlite3_bind_null=cwrap("sqlite3_bind_null","number",["number","number"]);sqlite3_bind_parameter_index=cwrap("sqlite3_bind_parameter_index","number",["number","string"]);sqlite3_step=cwrap("sqlite3_step","number",["number"]);sqlite3_column_int=cwrap("sqlite3_column_int","number",["number","number"]);sqlite3_column_double=cwrap("sqlite3_column_double","number",["number","number"]);sqlite3_column_text=cwrap("sqlite3_column_text","string",["number","number"]);sqlite3_column_type=cwrap("sqlite3_column_type","number",["number","number"]);sqlite3_column_name=cwrap("sqlite3_column_name","string",["number","number"]);sqlite3_column_count=cwrap("sqlite3_column_count","number",["number"]);sqlite3_last_insert_rowid=cwrap("sqlite3_last_insert_rowid","number",["number"]);sqlite3_changes=cwrap("sqlite3_changes","number",["number"]);sqlite3_create_function_v2=cwrap("sqlite3_create_function_v2","number",["number","string","number","number","number","number","number","number","number"]);sqlite3_value_type=cwrap("sqlite3_value_type","number",["number"]);sqlite3_value_text=cwrap("sqlite3_value_text","string",["number"]);sqlite3_value_int=cwrap("sqlite3_value_int","number",["number"]);sqlite3_value_double=cwrap("sqlite3_value_double","number",["number"]);sqlite3_result_double=cwrap("sqlite3_result_double","",["number","number"]);sqlite3_result_null=cwrap("sqlite3_result_null","",["number"]);sqlite3_result_text=cwrap("sqlite3_result_text","",["number","string","number","number"]);sqlite3_result_int=cwrap("sqlite3_result_int","",["number","number"]);sqlite3_result_error=cwrap("sqlite3_result_error","",["number","string","number"]);sqlite3_column_table_name=cwrap("sqlite3_column_table_name","string",["number","number"]);sqlite3_get_autocommit=cwrap("sqlite3_get_autocommit","number",["number"])};function isInt32(number){return number>=-2147483648&&number<=2147483647&&Number.isInteger(number)}function parseFunctionArguments(argc,argv){const args=[];for(let i=0;i<argc;i++){const ptr=getValue(argv+4*i,"i32");const type=sqlite3_value_type(ptr);let arg;switch(type){case SQLITE_INTEGER:arg=sqlite3_value_int(ptr);break;case SQLITE_FLOAT:arg=sqlite3_value_double(ptr);break;case SQLITE_TEXT:arg=sqlite3_value_text(ptr);break;case SQLITE_BLOB:throw new SQLite3Error("Type BLOB not supported");case SQLITE_NULL:arg=null;break}args.push(arg)}return args}function setFunctionResult(cx,result){switch(typeof result){case"boolean":sqlite3_result_int(cx,result?1:0);break;case"number":if(isInt32(result)){sqlite3_result_int(cx,result)}else{sqlite3_result_double(cx,result)}break;case"string":sqlite3_result_text(cx,result,-1,SQLITE_TRANSIENT);break;case"object":if(result===null){sqlite3_result_null(cx)}else{throw new SQLite3Error(`Unsupported type for function result: "${typeof result}"`)}break;default:throw new SQLite3Error(`Unsupported type for function result: "${typeof result}"`)}}class Database{constructor(filename,{fileMustExist:fileMustExist=false}={}){let flags=SQLITE_OPEN_READWRITE;if(!fileMustExist)flags|=SQLITE_OPEN_CREATE;const rc=sqlite3_open_v2(filename,temp,flags,NULL);this._ptr=getValue(temp,"i32");if(rc!==SQLITE_OK){if(this._ptr!==NULL)sqlite3_close_v2(this._ptr);throw new SQLite3Error(`Could not open the database "${filename}"`)}this._functions=new Map}get isOpen(){return this._ptr!==null}get inTransaction(){this._assertOpen();return sqlite3_get_autocommit(this._ptr)===0}close(){this._assertOpen();for(const func of this._functions.values())removeFunction(func);this._functions.clear();this._handleError(sqlite3_close_v2(this._ptr));this._ptr=null}function(name,func,{deterministic:deterministic=false}={}){this._assertOpen();function wrappedFunc(cx,argc,argv){const args=parseFunctionArguments(argc,argv);let result;try{result=func.apply(null,args)}catch(err){sqlite3_result_error(cx,err.toString(),-1);return}setFunctionResult(cx,result)}if(this._functions.has(name)){removeFunction(this._functions.get(name));this._functions.delete(name)}const funcPtr=addFunction(wrappedFunc,"viii");this._functions.set(name,funcPtr);let eTextRep=SQLITE_UTF8;if(deterministic)eTextRep|=SQLITE_DETERMINISTIC;this._handleError(sqlite3_create_function_v2(this._ptr,name,func.length,eTextRep,NULL,funcPtr,NULL,NULL,NULL));return this}exec(sql){this._assertOpen();this._handleError(sqlite3_exec(this._ptr,sql,NULL,NULL,NULL))}prepare(sql){this._assertOpen();return new Statement(this,sql)}run(sql,values){const stmt=this.prepare(sql);try{return stmt.run(values)}finally{stmt.finalize()}}all(sql,values,{expand:expand=false}={}){return this._query(sql,values,false,expand)}get(sql,values,{expand:expand=false}={}){return this._query(sql,values,true,expand)}_query(sql,values,single,expand){const stmt=this.prepare(sql);try{if(single){return stmt.get(values,{expand:expand})}else{return stmt.all(values,{expand:expand})}}finally{stmt.finalize()}}_assertOpen(){if(!this.isOpen)throw new SQLite3Error("Database already closed")}_handleError(returnCode){if(returnCode!==SQLITE_OK)throw new SQLite3Error(sqlite3_errmsg(this._ptr))}}class Statement{constructor(db,sql){db._handleError(sqlite3_prepare_v2(db._ptr,sql,-1,temp,NULL));this._ptr=getValue(temp,"i32");if(this._ptr===NULL)throw new SQLite3Error("Nothing to prepare");this._db=db}get database(){return this._db}get isFinalized(){return this._ptr===null}run(values){this._assertReady();this._bind(values);this._step();return{changes:sqlite3_changes(this._db._ptr),lastInsertRowid:_safeInt(sqlite3_last_insert_rowid(this._db._ptr))}}all(values,{expand:expand=false}={}){return this._queryRows(values,false,expand)}get(values,{expand:expand=false}={}){return this._queryRows(values,true,expand)}finalize(){this._assertReady();this._reset();this._db._handleError(sqlite3_finalize(this._ptr));this._ptr=null}_reset(){return sqlite3_clear_bindings(this._ptr)===SQLITE_OK&&sqlite3_reset(this._ptr)===SQLITE_OK}_queryRows(values,single,expand){this._assertReady();this._bind(values);if(single){if(this._step()){return this._getRow(expand)}else{return null}}else{const rows=[];while(this._step())rows.push(this._getRow(expand));return rows}}_bind(values){if(!this._reset()){throw new SQLite3Error("Could not reset statement prior to binding new values")}if(Array.isArray(values)){this._bindArray(values)}else if(values!=null&&typeof values==="object"){this._bindObject(values)}else if(typeof values!=="undefined"){this._bindValue(values,1)}}_step(){const ret=sqlite3_step(this._ptr);switch(ret){case SQLITE_ROW:return true;case SQLITE_DONE:return false;default:this._db._handleError(ret)}}_getRow(expand){const columns=this._getColumnNames();const row={};for(let i=0;i<columns.length;i++){let v;const colType=sqlite3_column_type(this._ptr,i);switch(colType){case SQLITE_INTEGER:v=sqlite3_column_int(this._ptr,i);break;case SQLITE_FLOAT:v=sqlite3_column_double(this._ptr,i);break;case SQLITE_TEXT:v=sqlite3_column_text(this._ptr,i);break;case SQLITE_BLOB:throw new SQLite3Error("Column type BLOB not supported");case SQLITE_NULL:v=null;break}const column=columns[i];if(expand){let table=sqlite3_column_table_name(this._ptr,i);table=table===""?"$":table;if(Object.hasOwn(row,table)){row[table][column]=v}else{row[table]={[column]:v}}}else{row[column]=v}}return row}_getColumnNames(){const names=[];const columns=sqlite3_column_count(this._ptr);for(let i=0;i<columns;i++)names.push(sqlite3_column_name(this._ptr,i));return names}_bindArray(values){for(let i=0;i<values.length;i++)this._bindValue(values[i],i+1)}_bindObject(values){for(const entry of Object.entries(values)){const param=entry[0];const value=entry[1];const i=sqlite3_bind_parameter_index(this._ptr,param);if(i===0)throw new SQLite3Error(`Unknown binding parameter: "${param}"`);this._bindValue(value,i)}}_bindValue(value,position){let ret;switch(typeof value){case"string":ret=sqlite3_bind_text(this._ptr,position,value,-1,SQLITE_TRANSIENT);break;case"number":if(isInt32(value)){ret=sqlite3_bind_int(this._ptr,position,value)}else{ret=sqlite3_bind_double(this._ptr,position,value)}break;case"boolean":ret=sqlite3_bind_int(this._ptr,position,value?1:0);break;case"object":if(value===null){ret=sqlite3_bind_null(this._ptr,position)}else{throw new SQLite3Error(`Unsupported type for binding: "${typeof value}"`)}break;default:throw new SQLite3Error(`Unsupported type for binding: "${typeof value}"`)}if(ret!==SQLITE_OK)this._db._handleError(ret)}_assertReady(){if(this.isFinalized)throw new SQLite3Error("Statement already finalized");if(!this._db.isOpen)throw new SQLite3Error("Database is closed")}}Module.Database=Database;"use strict";const SQLITE_OK=0;class SQLite3Error extends Error{constructor(message){super(message);this.name="SQLite3Error"}}function _safeInt(bigInt){if(bigInt>=Number.MIN_SAFE_INTEGER&&bigInt<=Number.MAX_SAFE_INTEGER){return Number(bigInt)}else{throw new SQLite3Error("Value too small or large for JavaScript integer")}}Module.SQLite3Error=SQLite3Error;"use strict";const path=require("node:path");const crypto=require("node:crypto");const SQLITE_CANTOPEN=14;const SQLITE_IOERR_READ=266;const SQLITE_IOERR_SHORT_READ=522;const SQLITE_IOERR_FSYNC=1034;const SQLITE_IOERR_WRITE=778;const SQLITE_IOERR_DELETE=2570;const SQLITE_IOERR_CLOSE=4106;const SQLITE_IOERR_TRUNCATE=1546;const SQLITE_IOERR_FSTAT=1802;const SQLITE_OPEN_READONLY=1;const SQLITE_OPEN_READWRITE=2;const SQLITE_OPEN_CREATE=4;const SQLITE_OPEN_EXCLUSIVE=16;const SQLITE_ACCESS_READWRITE=1;const SQLITE_ACCESS_READ=2;function _fd(fileInfo){return getValue(fileInfo+4,"i32")}var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=true;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary;function logExceptionOnExit(e){if(e instanceof ExitStatus)return;let toLog=e;err("exiting due to exception: "+toLog)}if(ENVIRONMENT_IS_NODE){var fs=require("fs");var nodePath=require("path");if(ENVIRONMENT_IS_WORKER){scriptDirectory=nodePath.dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}read_=(filename,binary)=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);return fs.readFileSync(filename,binary?undefined:"utf8")};readBinary=filename=>{var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}return ret};readAsync=(filename,onload,onerror)=>{filename=isFileURI(filename)?new URL(filename):nodePath.normalize(filename);fs.readFile(filename,function(err,data){if(err)onerror(err);else onload(data.buffer)})};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);quit_=(status,toThrow)=>{if(keepRuntimeAlive()){process["exitCode"]=status;throw toThrow}logExceptionOnExit(toThrow);process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAP64,HEAPU64,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf);Module["HEAP64"]=HEAP64=new BigInt64Array(buf);Module["HEAPU64"]=HEAPU64=new BigUint64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function keepRuntimeAlive(){return noExitRuntime}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith("file://")}var wasmBinaryFile;wasmBinaryFile="node-sqlite3-wasm.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"sync fetching of the wasm failed: you can preload it to Module['wasmBinary'] manually, or emcc.py will do that for you when generating HTML (but not JS)"}catch(err){abort(err)}}function instantiateSync(file,info){var instance;var module;var binary;try{binary=getBinary(file);module=new WebAssembly.Module(binary);instance=new WebAssembly.Instance(module,info)}catch(e){var str=e.toString();err("failed to compile wasm module: "+str);if(str.includes("imported Memory")||str.includes("memory import")){err("Memory size incompatibility issues may be due to changing INITIAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set INITIAL_MEMORY at runtime to something smaller than it was at compile time).")}throw e}return[instance,module]}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["s"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["ba"];addOnInit(Module["asm"]["t"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);readyPromiseReject(e)}}var result=instantiateSync(wasmBinaryFile,info);receiveInstance(result[0]);return Module["asm"]}var tempDouble;var tempI64;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}function uleb128Encode(n,target){if(n<128){target.push(n)}else{target.push(n%128|128,n>>7)}}function sigToWasmTypes(sig){var typeNames={"i":"i32","j":"i32","f":"f32","d":"f64","p":"i32"};var type={parameters:[],results:sig[0]=="v"?[]:[typeNames[sig[0]]]};for(var i=1;i<sig.length;++i){type.parameters.push(typeNames[sig[i]]);if(sig[i]==="j"){type.parameters.push("i32")}}return type}function generateFuncType(sig,target){var sigRet=sig.slice(0,1);var sigParam=sig.slice(1);var typeCodes={"i":127,"p":127,"j":126,"f":125,"d":124};target.push(96);uleb128Encode(sigParam.length,target);for(var i=0;i<sigParam.length;++i){target.push(typeCodes[sigParam[i]])}if(sigRet=="v"){target.push(0)}else{target.push(1,typeCodes[sigRet])}}function convertJsFunctionToWasm(func,sig){if(typeof WebAssembly.Function=="function"){return new WebAssembly.Function(sigToWasmTypes(sig),func)}var typeSectionBody=[1];generateFuncType(sig,typeSectionBody);var bytes=[0,97,115,109,1,0,0,0,1];uleb128Encode(typeSectionBody.length,bytes);bytes.push.apply(bytes,typeSectionBody);bytes.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);var module=new WebAssembly.Module(new Uint8Array(bytes));var instance=new WebAssembly.Instance(module,{"e":{"f":func}});var wrappedFunc=instance.exports["f"];return wrappedFunc}var wasmTableMirror=[];function getWasmTableEntry(funcPtr){var func=wasmTableMirror[funcPtr];if(!func){if(funcPtr>=wasmTableMirror.length)wasmTableMirror.length=funcPtr+1;wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}return func}function updateTableMap(offset,count){if(functionsInTableMap){for(var i=offset;i<offset+count;i++){var item=getWasmTableEntry(i);if(item){functionsInTableMap.set(item,i)}}}}var functionsInTableMap=undefined;var freeTableIndexes=[];function getEmptyTableSlot(){if(freeTableIndexes.length){return freeTableIndexes.pop()}try{wasmTable.grow(1)}catch(err){if(!(err instanceof RangeError)){throw err}throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."}return wasmTable.length-1}function setWasmTableEntry(idx,func){wasmTable.set(idx,func);wasmTableMirror[idx]=wasmTable.get(idx)}function addFunction(func,sig){if(!functionsInTableMap){functionsInTableMap=new WeakMap;updateTableMap(0,wasmTable.length)}if(functionsInTableMap.has(func)){return functionsInTableMap.get(func)}var ret=getEmptyTableSlot();try{setWasmTableEntry(ret,func)}catch(err){if(!(err instanceof TypeError)){throw err}var wrapped=convertJsFunctionToWasm(func,sig);setWasmTableEntry(ret,wrapped)}functionsInTableMap.set(func,ret);return ret}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module)}}function getValue(ptr,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":return HEAP8[ptr>>0];case"i8":return HEAP8[ptr>>0];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP64[ptr>>3];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];case"*":return HEAPU32[ptr>>2];default:abort("invalid type for getValue: "+type)}return null}function removeFunction(index){functionsInTableMap.delete(getWasmTableEntry(index));freeTableIndexes.push(index)}function setValue(ptr,value,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":HEAP8[ptr>>0]=value;break;case"i8":HEAP8[ptr>>0]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":tempI64=[value>>>0,(tempDouble=value,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[ptr>>2]=tempI64[0],HEAP32[ptr+4>>2]=tempI64[1];break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;case"*":HEAPU32[ptr>>2]=value;break;default:abort("invalid type for setValue: "+type)}}function readI53FromI64(ptr){return HEAPU32[ptr>>2]+HEAP32[ptr+4>>2]*4294967296}function __isLeapYear(year){return year%4===0&&(year%100!==0||year%400===0)}var __MONTH_DAYS_LEAP_CUMULATIVE=[0,31,60,91,121,152,182,213,244,274,305,335];var __MONTH_DAYS_REGULAR_CUMULATIVE=[0,31,59,90,120,151,181,212,243,273,304,334];function __yday_from_date(date){var isLeapYear=__isLeapYear(date.getFullYear());var monthDaysCumulative=isLeapYear?__MONTH_DAYS_LEAP_CUMULATIVE:__MONTH_DAYS_REGULAR_CUMULATIVE;var yday=monthDaysCumulative[date.getMonth()]+date.getDate()-1;return yday}function __localtime_js(time,tmPtr){var date=new Date(readI53FromI64(time)*1e3);HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getDay();var yday=__yday_from_date(date)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+36>>2]=-(date.getTimezoneOffset()*60);var start=new Date(date.getFullYear(),0,1);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>2]=dst}function allocateUTF8(str){var size=lengthBytesUTF8(str)+1;var ret=_malloc(size);if(ret)stringToUTF8Array(str,HEAP8,ret,size);return ret}function __tzset_js(timezone,daylight,tzname){var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAPU32[timezone>>2]=stdTimezoneOffset*60;HEAP32[daylight>>2]=Number(winterOffset!=summerOffset);function extractZone(date){var match=date.toTimeString().match(/\(([A-Za-z ]+)\)$/);return match?match[1]:"GMT"}var winterName=extractZone(winter);var summerName=extractZone(summer);var winterNamePtr=allocateUTF8(winterName);var summerNamePtr=allocateUTF8(summerName);if(summerOffset<winterOffset){HEAPU32[tzname>>2]=winterNamePtr;HEAPU32[tzname+4>>2]=summerNamePtr}else{HEAPU32[tzname>>2]=summerNamePtr;HEAPU32[tzname+4>>2]=winterNamePtr}}function _emscripten_date_now(){return Date.now()}var _emscripten_get_now;if(ENVIRONMENT_IS_NODE){_emscripten_get_now=()=>{var t=process["hrtime"]();return t[0]*1e3+t[1]/1e6}}else _emscripten_get_now=()=>performance.now();function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function getHeapMax(){return 2147483648}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}let alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}function _nodejsAccess(vfs,filePath,flags,outResult){let aflags=fs.constants.F_OK;if(flags==SQLITE_ACCESS_READWRITE)aflags=fs.constants.R_OK|fs.constants.W_OK;if(flags==SQLITE_ACCESS_READ)aflags=fs.constants.R_OK;try{fs.accessSync(UTF8ToString(filePath),aflags);setValue(outResult,1,"i32")}catch{setValue(outResult,0,"i32")}return SQLITE_OK}function _nodejsClose(fi){try{fs.closeSync(_fd(fi))}catch{return SQLITE_IOERR_CLOSE}return SQLITE_OK}function _nodejsDelete(vfs,filePath,dirSync){const pathStr=UTF8ToString(filePath);try{fs.unlinkSync(pathStr)}catch(err){if(err.code!="ENOENT")return SQLITE_IOERR_DELETE}if(dirSync){let fd=-1;try{fd=fs.openSync(path.dirname(pathStr),"r");fs.fsyncSync(fd)}catch{return SQLITE_IOERR_FSYNC}finally{try{fs.closeSync(fd)}catch{return SQLITE_IOERR_FSYNC}}}return SQLITE_OK}function _nodejsFileSize(fi,outSize){try{setValue(outSize,fs.fstatSync(_fd(fi)).size,"i64")}catch{return SQLITE_IOERR_FSTAT}return SQLITE_OK}function _nodejsFullPathname(vfs,relPath,sizeFullPath,outFullPath){const full=path.resolve(UTF8ToString(relPath));stringToUTF8(full,outFullPath,sizeFullPath);return full.length<sizeFullPath?SQLITE_OK:SQLITE_CANTOPEN}function _nodejsRandomness(vfs,bytes,outBuffer){const buf=HEAPU8.subarray(outBuffer,outBuffer+bytes);crypto.randomFillSync(buf);return bytes}function _nodejsRead(fi,outBuffer,bytes,offset){const buf=HEAPU8.subarray(outBuffer,outBuffer+bytes);let bytesRead;try{bytesRead=fs.readSync(_fd(fi),buf,0,bytes,offset)}catch{return SQLITE_IOERR_READ}if(bytesRead==bytes){return SQLITE_OK}else if(bytesRead>=0){if(bytesRead<bytes){try{buf.fill(0,bytesRead)}catch{return SQLITE_IOERR_READ}}return SQLITE_IOERR_SHORT_READ}return SQLITE_IOERR_READ}function _nodejsSync(fi,flags){try{fs.fsyncSync(_fd(fi))}catch{return SQLITE_IOERR_FSYNC}return SQLITE_OK}function _nodejsTruncate(fi,size){try{fs.ftruncateSync(_fd(fi),_safeInt(size))}catch{return SQLITE_IOERR_TRUNCATE}return SQLITE_OK}function _nodejsWrite(fi,buffer,bytes,offset){try{const bytesWritten=fs.writeSync(_fd(fi),HEAPU8.subarray(buffer,buffer+bytes),0,bytes,_safeInt(offset));return bytesWritten!=bytes?SQLITE_IOERR_WRITE:SQLITE_OK}catch{return SQLITE_IOERR_WRITE}}function _nodejs_max_path_length(){return process.platform=="win32"?260:4096}function _nodejs_open(filePath,flags,mode){let oflags=0;if(flags&SQLITE_OPEN_EXCLUSIVE)oflags|=fs.constants.O_EXCL;if(flags&SQLITE_OPEN_CREATE)oflags|=fs.constants.O_CREAT;if(flags&SQLITE_OPEN_READONLY)oflags|=fs.constants.O_RDONLY;if(flags&SQLITE_OPEN_READWRITE)oflags|=fs.constants.O_RDWR;try{return fs.openSync(UTF8ToString(filePath),oflags,mode)}catch{return-1}}function getCFunc(ident){var func=Module["_"+ident];return func}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret},"array":arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret}function cwrap(ident,returnType,argTypes,opts){argTypes=argTypes||[];var numericArgs=argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return function(){return ccall(ident,returnType,argTypes,arguments,opts)}}var asmLibraryArg={"m":__localtime_js,"n":__tzset_js,"l":_emscripten_date_now,"a":_emscripten_get_now,"k":_emscripten_memcpy_big,"j":_emscripten_resize_heap,"q":_nodejsAccess,"f":_nodejsClose,"r":_nodejsDelete,"p":_nodejsFileSize,"i":_nodejsFullPathname,"h":_nodejsRandomness,"e":_nodejsRead,"b":_nodejsSync,"c":_nodejsTruncate,"d":_nodejsWrite,"g":_nodejs_max_path_length,"o":_nodejs_open};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=asm["t"];var _sqlite3_finalize=Module["_sqlite3_finalize"]=asm["u"];var _sqlite3_reset=Module["_sqlite3_reset"]=asm["v"];var _sqlite3_clear_bindings=Module["_sqlite3_clear_bindings"]=asm["w"];var _sqlite3_value_text=Module["_sqlite3_value_text"]=asm["x"];var _sqlite3_value_double=Module["_sqlite3_value_double"]=asm["y"];var _sqlite3_value_int=Module["_sqlite3_value_int"]=asm["z"];var _sqlite3_value_type=Module["_sqlite3_value_type"]=asm["A"];var _sqlite3_result_double=Module["_sqlite3_result_double"]=asm["B"];var _sqlite3_result_error=Module["_sqlite3_result_error"]=asm["C"];var _sqlite3_result_int=Module["_sqlite3_result_int"]=asm["D"];var _sqlite3_result_null=Module["_sqlite3_result_null"]=asm["E"];var _sqlite3_result_text=Module["_sqlite3_result_text"]=asm["F"];var _sqlite3_step=Module["_sqlite3_step"]=asm["G"];var _sqlite3_column_count=Module["_sqlite3_column_count"]=asm["H"];var _sqlite3_column_double=Module["_sqlite3_column_double"]=asm["I"];var _sqlite3_column_int=Module["_sqlite3_column_int"]=asm["J"];var _sqlite3_column_text=Module["_sqlite3_column_text"]=asm["K"];var _sqlite3_column_type=Module["_sqlite3_column_type"]=asm["L"];var _sqlite3_column_name=Module["_sqlite3_column_name"]=asm["M"];var _sqlite3_column_table_name=Module["_sqlite3_column_table_name"]=asm["N"];var _sqlite3_bind_double=Module["_sqlite3_bind_double"]=asm["O"];var _sqlite3_bind_int=Module["_sqlite3_bind_int"]=asm["P"];var _sqlite3_bind_null=Module["_sqlite3_bind_null"]=asm["Q"];var _sqlite3_bind_text=Module["_sqlite3_bind_text"]=asm["R"];var _sqlite3_bind_parameter_index=Module["_sqlite3_bind_parameter_index"]=asm["S"];var _sqlite3_exec=Module["_sqlite3_exec"]=asm["T"];var _sqlite3_prepare_v2=Module["_sqlite3_prepare_v2"]=asm["U"];var _sqlite3_errmsg=Module["_sqlite3_errmsg"]=asm["V"];var _sqlite3_last_insert_rowid=Module["_sqlite3_last_insert_rowid"]=asm["W"];var _sqlite3_changes=Module["_sqlite3_changes"]=asm["X"];var _sqlite3_close_v2=Module["_sqlite3_close_v2"]=asm["Y"];var _sqlite3_create_function_v2=Module["_sqlite3_create_function_v2"]=asm["Z"];var _sqlite3_open_v2=Module["_sqlite3_open_v2"]=asm["_"];var _sqlite3_get_autocommit=Module["_sqlite3_get_autocommit"]=asm["$"];var _malloc=Module["_malloc"]=asm["aa"];var stackSave=Module["stackSave"]=asm["ca"];var stackRestore=Module["stackRestore"]=asm["da"];var stackAlloc=Module["stackAlloc"]=asm["ea"];Module["stackAlloc"]=stackAlloc;Module["cwrap"]=cwrap;Module["addFunction"]=addFunction;Module["removeFunction"]=removeFunction;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


  return Module
}
);
})()();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], function() { return Module; });
else if (typeof exports === 'object')
  exports["Module"] = Module;
