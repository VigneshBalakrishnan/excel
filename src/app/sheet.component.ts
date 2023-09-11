import { Component } from '@angular/core';
import { log } from 'util';

import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-sheet',
   templateUrl: './sheet.component.html',
})

export class SheetJSComponent {
  data: any = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  columns: string[];
  mockData: any;

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const data = reader.result;
      let ws = XLSX.read(data, { type: 'binary' });

      /* save data */
      // this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.data = ws.SheetNames.reduce((initial, name) => {
        const sheet = ws.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.data = this.data['Sheet1'].filter((sheet: any)=> sheet['Creator Name']);
      this.mockData = this.data;
      this.columns = Object.keys(this.data[0]);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  filterData(event): any{
    const myClonedArray = [];
    this.data.forEach(val => myClonedArray.push(Object.assign({}, val)));
    if(event.target.value){
      this.data = myClonedArray.filter((dt: any)=> dt['Creator Name'].includes(event.target.value));
    }else{
      this.data = this.mockData
    }
  }

}