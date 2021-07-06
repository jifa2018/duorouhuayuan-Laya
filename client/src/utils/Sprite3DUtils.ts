// import Sprite3D = Laya.Sprite3D;
// import Handler = Laya.Handler;
//
// export class Sprite3DUtils
// {
//
//     private static _sprite3DLib:Array<string>=[];
//
//     /**
//      *加载模型
//      * @param url
//      *
//      */
//     public static load(url:String,handle:Handler):void
//     {
//         let sp:Sprite3DPool=null;//getPool(url);
//         sp.load(url,handle);
//     }
//
//     public static getPool(url:string):Sprite3DPool
//     {
//         let pool:Sprite3DPool = Sprite3DUtils._sprite3DLib[url];
//         if(!pool){
//             Sprite3DUtils._sprite3DLib[url] = pool = new Sprite3DPool;
//         }
//         return pool;
//     }
// }
//
// class Sprite3DPool{
//     public  source:Sprite3D;
//     public  pool:Array<any>=[];
//     public  max:Number = 5;
//     public  status:Number=0;
//     public  url:String;
//     private _cacheHandles:Array<Handler>=[];
//     public load(url:string, handle:Handler):void{
//         this.url = url;
//         if(this.status==2){
//             handle.runWith(this.getSprite3D());
//             return;
//         }
//         this._cacheHandles.push(handle);
//         if(this.status>0) return;
//         this.status=1;
//         this.source = Sprite3D.load(url, null);
//
//         if( this.source.loaded ){
//             this.onLoaded();
//         }else{
//             source.once(Event.HIERARCHY_LOADED,this,onLoaded);
//         }
//     }
//
//     public clear(handle:Handler):void{
//         var index:Number = _cacheHandles.indexOf(handle);
//         if(index>=0){
//             _cacheHandles.splice(index,1);
//         }
//     }
//
//     private function onLoaded():void{
//         status = 2;
//         var i:Number=0;
//         var len:Number = _cacheHandles.length;
//         for(;i<len;i++){
//             _cacheHandles[i].runWith(getSprite3D());
//         }
//         _cacheHandles.length=0;
//     }
//
//
//
//     public function getSprite3D():Sprite3D{
//         var s:Sprite3D;
//         if(pool.length>0){
//             s= pool.pop();
//         }
//         else{
//             s= source.clone();
//         }
//         s['fileUrl'] = url;
//         return s;
//     }
//
//     public function recovery(s:Sprite3D):void{
//         if(pool.length>=max){
//             s.destroy();
//             return;
//         }
//         pool.push(s);
//     }
// }