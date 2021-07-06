import { Utils } from "../../utils/Utils";
import { Staff_Cfg } from "../../manager/ConfigManager";
import { Time } from "../../common/Time";
import { BagSystem } from "../bag/BagSystem";
import { SaveManager, ModelStorage } from "../../manager/SaveManager";
/**
 * 全局游戏数据类  设计目的；解耦   ，数据与逻辑运算分离
 */
export  class GameData 
{
    /**存储的角色信息 */
    private static _roleInfo: any[] = [];
    /** 采集的物品 */
    private static _treeInfo:{[num:number]:Array<[number,number]>}={};
    //private static _treeInfo:Map<number,Array<[number,number]>> = new Map<number,Array<[number,number]>>();

    public static onInit (): void
    {
       this.LoadInfo();
    }

    onDestroy (): void{}


    //#region  员工数据

    /**
     * 开始升级
     * @param tableID 表ID
     */
    public static ChangUpGrade(tableID:number):void
    {
        let data = this.GetRole(tableID);
        data.updateTimeStamp = Time.serverSeconds;
        SaveManager.getInstance().SetStaffCache(this._roleInfo);
    }

    /**
     * 升级
     * @param beforeId 升级前Id   表ID
     * @param laterId 升级后Id
     */
    public static upgrade(beforeId:number,laterId:number):void
    {
        let data = this.GetRole(beforeId);
        if (data.id==beforeId) {
            data.id = laterId;
            data.updateTimeStamp = 0;
            SaveManager.getInstance().SetStaffCache(this._roleInfo);
        }
    }

    public static InitStaffID(id:number,dataIndex:number)
    {
        if (dataIndex!=-1) {
            let array = this._roleInfo;
            array[dataIndex]["id"] = id;
            this._roleInfo = array;
            SaveManager.getInstance().SetStaffCache(array);
        }
    }

    public static get RoleInfo(){
        return this._roleInfo;
    }

    public static set RoleInfo(a){
        this._roleInfo= a;
    }

    public static GetRole(nID : number){
        for (let i in this._roleInfo){
            if (nID == this._roleInfo[i].id){
                return this._roleInfo[i];
            }
        }
    }

    /**读取信息 */
    public static LoadInfo() {
       // Utils.clearLocal();
        let value = SaveManager.getInstance().GetCache(ModelStorage.Staff);
        if (value) {
            this._roleInfo=value;
        }
        else {
            let idunm:number = Utils.GetTableLength(Staff_Cfg);
            let staffunm:number = Staff_Cfg[idunm].staffID;
            for (let i = 1; i <= staffunm; i++) 
            {
                for (let j = 1; j <= idunm; j++) 
                {
                    if (Staff_Cfg[j]["staffID"] == i) 
                    {
                        let data=
                        {                     
                            id:0,    //角色id 对应staff表中id                                     
                            workState:0, //工作状态 0默认 1工作 2休息 3收获
                            updateTimeStamp:0,    //升级时间戳 0为默认         
                            workTimeStamp:0,       //工作时间戳 0为默认
                            //restTimeStamp:0,  //休息时间戳 0为默认                     
                            //workOrRestTimeCD:0     //工作休息时长
                        }
                        this._roleInfo.push(data);
                        break;
                    }
                }
            }
            SaveManager.getInstance().SetStaffCache(this._roleInfo);
        }

        let da = SaveManager.getInstance().GetCache(ModelStorage.Tree);
        if (da) {
            this._treeInfo=da;
        }
    }

    //#endregion
 


    //#region  收获物品
    public static get ItemInfo()
    {
        return this._treeInfo;
    }

    public static set ItemInfo(a)
    {
        this._treeInfo= a;
    }

    public static GetItem(staffId:number):any
    {
        return this._treeInfo[staffId];
    }

    public static AddItem(staffId:number,itemId:number):void
    {
        if (!staffId && !itemId) {
            return;
        }
        if (this._treeInfo &&  this._treeInfo[staffId])
        {
            let array = this._treeInfo[staffId];
            for (const key in array) 
            {
                if (Object.prototype.hasOwnProperty.call(array, key)) 
                {
                    const element = array[key];
                    if (element[1] == itemId) 
                    {
                        element[0] += 1;
                        this.SaveTree(this._treeInfo);
                        return;
                    }   
                }
            }
        }
        let array =  this._treeInfo[staffId];
        if (array) 
        {
            array.push([1,itemId]);
            this._treeInfo[staffId] = array;
        }
        else
        {
            let DataList = new Array(); 
            DataList.push([1,itemId]);
            this._treeInfo[staffId] =DataList;
        }
        this.SaveTree(this._treeInfo);
    }

    public static ClearItem(staffID:number):void
    {
        let array =  this._treeInfo[staffID];
        if (array) {
            array.forEach(element => {
                BagSystem.getInstance().addItem(element[1],element[0]);
            }); 
        }
        this._treeInfo[staffID] = null;
        this.SaveTree(this._treeInfo);
    }

    private static SaveTree(array:any){
        SaveManager.getInstance().SetTreeCache(array);
    }
    //#endregion
}