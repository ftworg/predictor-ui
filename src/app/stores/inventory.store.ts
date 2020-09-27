import { createContext } from "react";
import { observable, action } from "mobx";

class InventoryStore { 
    constructor() {
        this.reset();
      }

    
  @action
  reset = () => {  
    this.treeData = [];
    this.accData = undefined;
  }
  
  @observable
  treeData: any[] = [];

  
  @observable
  accData: any;

  @action
  setAccData = (value: any) => {
    this.accData = value;
  };

}


export default createContext<InventoryStore>(new InventoryStore());
