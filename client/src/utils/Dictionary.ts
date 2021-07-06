/**
 * @Purpose 字典
 * @Author zhanghj
 * @Date 2020/8/10 16:13
 * @Version 1.0
 */

export class Dictionary {
    items: object;
    count:number;
    constructor() {
        this.items = {};
        this.count = 0;
    }
    has(key: any): boolean {
        return this.items.hasOwnProperty(key);
    }
    set(key: any, val: any) {
        this.items[key] = val;
        this.count++;
    }
    delete(key: any): boolean {
        if (this.has(key)) {
            delete this.items[key];
            this.count--;
        }
        return false;
    }
    get(key: any): any {
        return this.has(key) ? this.items[key] : undefined;
    }
    clear():void{
        this.items = {};
        this.count = 0;
    }
    Count():number{
        return this.count;
    }
    values(): any[] {
        let values: any[] = [];
        for (let k in this.items) {
            if (this.has(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    forEach(callback:(value:any)=>void):void
    {
        for (const key of Object.keys(this.items)) {
            if (this.items.hasOwnProperty(key)) {
              callback.call(this, this.get(key));
            }
        }
    }

}